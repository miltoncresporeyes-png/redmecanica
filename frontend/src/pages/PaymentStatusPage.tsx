import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Card from '../components/common/Card';
import { getPaymentStatus, getSubscriptionStatus } from '../services/api';

type PaymentScope = 'job' | 'subscription' | 'unknown';
type PaymentState = 'loading' | 'pending' | 'approved' | 'failed' | 'refunded' | 'unknown';

const PAYMENT_CHECK_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 8;

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isFinalPage = location.pathname.includes('/payment/final');

  const jobId = searchParams.get('jobId')?.trim() || '';
  const subscriptionId = searchParams.get('subscriptionId')?.trim() || '';
  const queryStatus = (searchParams.get('status') || '').toLowerCase();

  const scope: PaymentScope = useMemo(() => {
    if (jobId) return 'job';
    if (subscriptionId) return 'subscription';
    return 'unknown';
  }, [jobId, subscriptionId]);

  const [state, setState] = useState<PaymentState>('loading');
  const [attempts, setAttempts] = useState(0);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const resolveState = (data: any): PaymentState => {
      if (!data) return 'unknown';

      const rawJobStatus = String(data.jobStatus || data.status || '').toUpperCase();
      const rawPaymentStatus = String(data.paymentStatus || '').toUpperCase();

      if (scope === 'job') {
        if (rawPaymentStatus === 'RELEASED' || rawPaymentStatus === 'HELD') return 'approved';
        if (rawPaymentStatus === 'REFUNDED' || rawJobStatus === 'CANCELLED') return 'refunded';
        if (rawPaymentStatus === 'PENDING' || rawJobStatus === 'CONFIRMED') return 'pending';
        return 'unknown';
      }

      if (scope === 'subscription') {
        if (rawJobStatus === 'ACTIVE' || rawPaymentStatus === 'ACTIVE') return 'approved';
        if (rawJobStatus === 'CANCELLED' || rawJobStatus === 'SUSPENDED') return 'failed';
        if (rawJobStatus === 'PENDING') return 'pending';
        return 'unknown';
      }

      return 'unknown';
    };

    const fetchStatus = async () => {
      try {
        if (scope === 'job' && jobId) {
          const statusData = await getPaymentStatus(jobId);
          if (!isMounted) return;
          setPayload(statusData);
          const nextState = resolveState(statusData);
          setState(nextState);
          if (nextState === 'approved' || nextState === 'failed' || nextState === 'refunded') return;
        }

        if (scope === 'subscription' && subscriptionId) {
          const statusData = await getSubscriptionStatus(subscriptionId);
          if (!isMounted) return;
          setPayload(statusData);
          const nextState = resolveState(statusData);
          setState(nextState);
          if (nextState === 'approved' || nextState === 'failed') return;
        }

        if (!isMounted) return;
        setState((current) => (current === 'loading' ? 'pending' : current));
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.error || 'No pudimos consultar el estado del pago.');
        setState('unknown');
      } finally {
        if (!isMounted) return;
        setAttempts((currentAttempts) => currentAttempts + 1);
      }
    };

    setState('loading');
    setAttempts(0);
    fetchStatus();

    intervalId = window.setInterval(() => {
      fetchStatus();
    }, PAYMENT_CHECK_INTERVAL_MS);

    timeoutId = window.setTimeout(() => {
      if (isMounted) {
        window.clearInterval(intervalId);
      }
    }, PAYMENT_CHECK_INTERVAL_MS * MAX_ATTEMPTS);

    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [jobId, subscriptionId, scope]);

  const pageTitle = isFinalPage ? 'Pago procesado | RedMecánica' : 'Confirmando pago | RedMecánica';
  const pageDescription = 'Estamos verificando el resultado de tu pago con Mercado Pago y actualizando el estado en tiempo real.';

  const headerLabel = scope === 'job'
    ? 'Pago de servicio'
    : scope === 'subscription'
      ? 'Pago de suscripción'
      : 'Pago Mercado Pago';

  const statusLabel = (() => {
    switch (state) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Rechazado';
      case 'refunded': return 'Reembolsado';
      case 'unknown': return 'No confirmado';
      default: return 'Verificando';
    }
  })();

  const accentClass = (() => {
    switch (state) {
      case 'approved': return 'from-emerald-500 to-lime-400';
      case 'pending': return 'from-amber-500 to-yellow-400';
      case 'failed': return 'from-rose-500 to-red-500';
      case 'refunded': return 'from-slate-500 to-slate-400';
      default: return 'from-blue-500 to-cyan-400';
    }
  })();

  const primaryMessage = (() => {
    if (error) return error;

    switch (state) {
      case 'approved':
        return scope === 'subscription'
          ? 'Tu suscripción quedó activa. El proveedor ya debería ver el cambio reflejado.'
          : 'Tu pago fue aprobado y el trabajo quedó confirmado en la plataforma.';
      case 'pending':
        return 'Mercado Pago aún está procesando la transacción. Seguimos revisando el estado.';
      case 'failed':
        return 'La transacción no se pudo completar. Puedes intentarlo nuevamente.';
      case 'refunded':
        return 'El pago fue reembolsado. Revisa el detalle de la operación.';
      case 'unknown':
        return 'No pudimos determinar el estado exacto, pero ya dejamos el registro listo.';
      default:
        return 'Estamos consultando el estado real de tu operación.';
    }
  })();

  const continueHref = scope === 'subscription'
    ? '/provider-dashboard'
    : '/profile';

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4 py-10">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white bg-gradient-to-r ${accentClass} shadow-lg`}>
            Mercado Pago • {headerLabel}
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            {statusLabel}
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm md:text-base">
            {primaryMessage}
          </p>
        </div>

        <Card className="relative overflow-hidden border border-slate-200 shadow-2xl rounded-[2rem] p-6 md:p-8 bg-white">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accentClass}`} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950 text-white p-5 shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Estado</p>
                <p className="mt-2 text-2xl font-black">{statusLabel}</p>
                <p className="mt-1 text-xs text-slate-300">{scope === 'unknown' ? 'Esperando identificador' : `Seguimiento por ${scope}`}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Job ID</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 break-all">{jobId || 'No aplica'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Suscripción</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 break-all">{subscriptionId || 'No aplica'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500 mb-2">Detalle de verificación</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {scope === 'job'
                    ? 'Se consulta el estado del trabajo en backend para reflejar la aprobación real del webhook y el registro de pago asociado.'
                    : scope === 'subscription'
                      ? 'Se consulta la suscripción activada para reflejar la aprobación del webhook y la fecha del último pago.'
                      : 'No encontramos un identificador válido en la URL. Puedes volver al inicio y revisar tu pago desde la cuenta.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 md:p-6 shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-300">Resultado de la operación</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black">{statusLabel}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {scope === 'subscription' ? 'Suscripción' : 'Pago'}
                      {payload?.amount ? ` • $${Number(payload.amount).toLocaleString('es-CL')} CLP` : ''}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300">Intentos</p>
                    <p className="text-xl font-black">{Math.max(1, attempts)}</p>
                  </div>
                </div>
                {payload && (
                  <div className="mt-4 rounded-2xl bg-black/20 p-4 text-xs text-slate-300 space-y-1.5">
                    <div className="flex justify-between gap-4"><span className="text-slate-400">Estado backend</span><span className="font-bold text-white">{payload.paymentStatus || payload.status || 'n/a'}</span></div>
                    {payload.jobStatus && <div className="flex justify-between gap-4"><span className="text-slate-400">Job status</span><span className="font-bold text-white">{payload.jobStatus}</span></div>}
                    {payload.lastPaymentDate && <div className="flex justify-between gap-4"><span className="text-slate-400">Último pago</span><span className="font-bold text-white">{new Date(payload.lastPaymentDate).toLocaleString('es-CL')}</span></div>}
                    {payload.endDate && <div className="flex justify-between gap-4"><span className="text-slate-400">Vencimiento</span><span className="font-bold text-white">{new Date(payload.endDate).toLocaleDateString('es-CL')}</span></div>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/search"
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-3.5 text-center transition-colors shadow-lg"
                >
                  Buscar servicio
                </Link>
                <Link
                  to={continueHref}
                  className="rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black px-5 py-3.5 text-center transition-colors"
                >
                  Continuar
                </Link>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 leading-relaxed">
                Si el estado sigue en pendiente unos segundos, Mercado Pago puede seguir confirmando la transacción. Esta pantalla se actualizará sola mientras esté abierta.
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-5 text-center text-xs text-slate-500">
          <Link to="/" className="font-bold text-blue-600 hover:underline">Volver al inicio</Link>
          <span className="mx-2">•</span>
          <Link to="/help" className="font-bold text-blue-600 hover:underline">Ayuda</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;