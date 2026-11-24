import React, { useState } from 'react';
import { CreditCard, FileText, PauseCircle, PlayCircle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';
import { tierOf, TIER_LABEL } from '../../config/plans';
import api from '../../lib/http';
import { useAuth } from '../../app/providers';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

interface Props {
  provider: any;
  invoices: any[];
  onChanged: () => void;
  onOpenBilling: () => void;
  /** Plan efectivo segun el servidor (un plan vencido cuenta como gratuito) */
  planInfo?: { plan: string; communes: number; statsLocked: boolean };
  onClose: () => void;
  /** Resumen de pagos por la plataforma (solo si existen); se muestra entre el plan y las facturas */
  paymentsSection?: React.ReactNode;
}

const PLAN_NAMES: Record<string, string> = {
  FREE: 'Plan Gratuito',
  MONTHLY: 'Plan Mensual',
  YEARLY: 'Plan Anual',
  PROFESSIONAL: 'Plan Profesional',
};


const SUB_STATUS: Record<string, string> = {
  ACTIVE: 'Activa',
  PENDING: 'Pendiente de pago',
  EXPIRED: 'Vencida',
  CANCELLED: 'Cancelada',
};

const INVOICE_STATUS: Record<string, { label: string; cls: string }> = {
  PAID: { label: 'Pagada', cls: 'bg-emerald-100 text-emerald-800' },
  PENDING: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-900' },
  CANCELLED: { label: 'Anulada', cls: 'bg-slate-100 text-slate-700' },
  REFUNDED: { label: 'Reembolsada', cls: 'bg-slate-100 text-slate-700' },
};

const clp = (n?: number | null) => `$${Number(n || 0).toLocaleString('es-CL')}`;
const date = (d?: string | null) => (d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.response?.data?.message || fallback;

// "Lo que incluye tu plan": cada linea refleja lo que realmente ocurre con esta vitrina, no una promesa generica.
const PlanIncludes: React.FC<{ provider: any; planInfo?: { plan: string; communes: number; statsLocked: boolean }; onUpgrade: () => void }> = ({ provider, planInfo, onUpgrade }) => {
  const tier = tierOf(planInfo?.plan);
  const status: string = provider?.status || 'PENDING';
  const published = status === 'ACTIVE' || status === 'APPROVED';
  const used = Number(provider?.coveredCommunes) || (provider?.commune ? 1 : 0);
  const limit = planInfo?.communes ?? 1;
  const docs = provider?.hasIdDocument && provider?.hasBackgroundCheck;
  const rows: Array<{ ok: boolean; text: string }> = [
    { ok: published, text: published ? 'Tu vitrina está publicada en el directorio' : 'Tu vitrina aún no está publicada' },
    { ok: status === 'APPROVED', text: status === 'APPROVED' ? 'Insignia “Verificado” activa' : docs ? 'Documentos en revisión para la insignia “Verificado”' : 'Sube tus documentos para la insignia “Verificado” (gratis)' },
    { ok: tier !== 'FREE', text: tier === 'FREE' ? 'Posición normal en tu comuna' : 'Apareces primero en tu comuna y en Anuncios Destacados' },
    { ok: tier !== 'FREE', text: tier === 'FREE' ? 'Sin insignia de plan' : `Insignia “${TIER_LABEL[tier]}” visible en tu vitrina y listados` },
    { ok: true, text: `Cobertura: ${used} de ${limit} ${limit === 1 ? 'comuna' : 'comunas'} usadas` },
    { ok: tier !== 'FREE', text: tier === 'FREE' ? 'Estadísticas de visitas y contactos: incluidas en Destacado' : 'Estadísticas de visitas y contactos en tu Inicio' },
  ];
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lo que incluye tu plan</p>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.text} className={`flex items-start gap-2 text-sm ${r.ok ? 'text-slate-800' : 'text-slate-500'}`}>
            <span className={`mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${r.ok ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`} aria-hidden="true">{r.ok ? '✓' : '–'}</span>
            {r.text}
          </li>
        ))}
      </ul>
      {tier === 'FREE' && (
        <button type="button" onClick={onUpgrade} className="mt-3 text-sm font-bold text-primary hover:underline">Ver qué suma el plan Destacado</button>
      )}
    </div>
  );
};

const ProviderAccountPanel: React.FC<Props> = ({ provider, invoices, onChanged, onOpenBilling, planInfo, onClose, paymentsSection }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const confirm = useConfirm();

  const sub = provider?.subscription;
  const planKey = sub?.plan || 'FREE';
  const status: string = provider?.status || 'PENDING';
  const isVisible = status === 'ACTIVE' || status === 'APPROVED';
  const effPlan = planInfo?.plan ?? planKey;
  const expired = planKey !== 'FREE' && effPlan === 'FREE';
  const effectiveName = expired ? 'Plan vencido' : PLAN_NAMES[effPlan] || effPlan;

  const [busy, setBusy] = useState(false);
  const [pwd, setPwd] = useState({ current: '', next: '', repeat: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [closeText, setCloseText] = useState('');
  const [showClose, setShowClose] = useState(false);

  const pause = async () => {
    const ok = await confirm({
      title: 'Pausar mi vitrina',
      message: 'Dejarás de aparecer en el directorio y de recibir solicitudes nuevas. Los servicios en curso continúan y puedes reanudar cuando quieras.',
      confirmText: 'Pausar vitrina',
      confirmVariant: 'primary',
      icon: 'warning',
    });
    if (!ok) return;
    setBusy(true);
    try {
      const { data } = await api.post('/providers/me/pause');
      addToast(data?.message || 'Vitrina pausada.', 'success');
      onChanged();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo pausar la vitrina.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const resume = async () => {
    setBusy(true);
    try {
      const { data } = await api.post('/providers/me/resume');
      addToast(data?.message || 'Vitrina reanudada.', 'success');
      onChanged();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo reanudar la vitrina.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const resubmit = async () => {
    setBusy(true);
    try {
      const { data } = await api.post('/providers/me/resubmit');
      addToast(data?.message || 'Vitrina reenviada a revisión.', 'success');
      onChanged();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo reenviar la vitrina.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const cancelRenewal = async () => {
    const ok = await confirm({
      title: 'Cancelar renovación automática',
      message: `Tu plan seguirá vigente hasta el ${date(sub?.endDate)} y luego volverás al Plan Gratuito.`,
      confirmText: 'Cancelar renovación',
      confirmVariant: 'danger',
      icon: 'warning',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await api.post(`/subscriptions/${sub.id}/cancel`);
      addToast('La renovación automática fue cancelada.', 'success');
      onChanged();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo cancelar la renovación.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.repeat) {
      addToast('Las contraseñas nuevas no coinciden.', 'error');
      return;
    }
    setPwdSaving(true);
    try {
      await api.post('/users/me/password', { currentPassword: pwd.current, newPassword: pwd.next });
      addToast('Contraseña actualizada.', 'success');
      setPwd({ current: '', next: '', repeat: '' });
    } catch (err) {
      addToast(errMsg(err, 'No se pudo cambiar la contraseña.'), 'error');
    } finally {
      setPwdSaving(false);
    }
  };

  const closeAccount = async () => {
    setClosing(true);
    try {
      await api.delete('/users/me/deactivate');
      addToast('Tu cuenta fue dada de baja.', 'success');
      await logout();
      onClose();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo cerrar la cuenta.'), 'error');
      setClosing(false);
    }
  };

  const stateBlock = (() => {
    if (status === 'SUSPENDED') {
      return { tone: 'bg-red-50 border-red-100 text-red-800', title: 'Cuenta suspendida por un administrador', text: provider?.rejectionReason || 'Tu vitrina no es visible. Escribe a contacto@redmecanica.cl para revisar tu caso.' };
    }
    if (status === 'REJECTED') {
      return { tone: 'bg-red-50 border-red-100 text-red-800', title: 'Vitrina rechazada', text: provider?.rejectionReason || 'Revisa tus datos y documentos, o escribe a contacto@redmecanica.cl.' };
    }
    if (status === 'UNDER_REVIEW') {
      return { tone: 'bg-blue-50 border-blue-100 text-blue-900', title: 'Vitrina en revisión', text: 'Nuestro equipo está revisando tu información. Te avisaremos cuando termine.' };
    }
    if (status === 'PAUSED') {
      return { tone: 'bg-slate-50 border-slate-200 text-slate-800', title: 'Vitrina pausada', text: 'No apareces en el directorio ni recibes solicitudes nuevas.' };
    }
    if (status === 'APPROVED') {
      return { tone: 'bg-emerald-50 border-emerald-100 text-emerald-900', title: 'Vitrina visible y verificada', text: 'Apareces en el directorio con la insignia “Verificado”.' };
    }
    if (status === 'ACTIVE') {
      return { tone: 'bg-blue-50 border-blue-100 text-blue-900', title: 'Vitrina visible', text: 'Apareces en el directorio. Sube tus documentos para obtener la insignia “Verificado”.' };
    }
    return { tone: 'bg-amber-50 border-amber-100 text-amber-900', title: 'Vitrina sin publicar', text: 'Completa tus datos en “Datos del Prestador” para aparecer en el directorio.' };
  })();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-end gap-2">
        <label htmlFor="lang-select" className="text-sm font-semibold text-slate-700">{t('language.label')}</label>
        <select id="lang-select" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} className="input-market !w-auto">
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      {/* Plan vigente */}
      <section className="bg-white border border-slate-200 rounded-control p-6 shadow-sm" aria-labelledby="plan-title">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h3 id="plan-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" aria-hidden="true" /> Plan vigente
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">{effectiveName}</span>
        </div>
        <PlanIncludes provider={provider} planInfo={planInfo} onUpgrade={onOpenBilling} />

        {sub ? (
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
            <div className="flex justify-between sm:block"><dt className="text-slate-500">Estado</dt><dd className="font-semibold text-slate-900">{SUB_STATUS[sub.status] || sub.status}</dd></div>
            <div className="flex justify-between sm:block"><dt className="text-slate-500">Vigencia</dt><dd className="font-semibold text-slate-900">{date(sub.startDate)} al {date(sub.endDate)}</dd></div>
            <div className="flex justify-between sm:block"><dt className="text-slate-500">Monto</dt><dd className="font-semibold text-slate-900">{clp(sub.amount)}</dd></div>
            <div className="flex justify-between sm:block"><dt className="text-slate-500">Próxima renovación</dt><dd className="font-semibold text-slate-900">{sub.autoRenew ? date(sub.nextBillingDate || sub.endDate) : 'Sin renovación automática'}</dd></div>
          </dl>
        ) : (
          <p className="text-sm text-slate-600 mb-4">No tienes un plan de pago. Puedes mejorar tu plan para ampliar tu cobertura.</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onOpenBilling} className="btn-primary !min-h-[40px] !py-2">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" /> {sub ? 'Gestionar plan y pagos' : 'Mejorar mi plan'}
          </button>
          {sub && sub.autoRenew && planKey !== 'FREE' && (
            <button type="button" disabled={busy} onClick={cancelRenewal} className="btn-ghost !min-h-[40px] !py-2 disabled:opacity-50">Cancelar renovación automática</button>
          )}
        </div>
      </section>

      {paymentsSection}

      {/* Facturas */}
      <section className="bg-white border border-slate-200 rounded-control p-6 shadow-sm" aria-labelledby="inv-title">
        <h3 id="inv-title" className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" aria-hidden="true" /> Facturas y comprobantes
        </h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">Aún no tienes comprobantes. Aparecerán aquí cuando pagues un plan o se liquide un servicio.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th scope="col" className="py-2 pr-3 font-semibold">Folio</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Concepto</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Fecha</th>
                  <th scope="col" className="py-2 pr-3 font-semibold text-right">Total</th>
                  <th scope="col" className="py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const st = INVOICE_STATUS[inv.status] || { label: inv.status, cls: 'bg-slate-100 text-slate-700' };
                  return (
                    <tr key={inv.id}>
                      <td className="py-3 pr-3 font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-3 pr-3 text-slate-700">{inv.type === 'SUBSCRIPTION' ? 'Suscripción' : inv.type === 'REFUND' ? 'Reembolso' : 'Servicio técnico'}</td>
                      <td className="py-3 pr-3 text-slate-700 whitespace-nowrap">{date(inv.paidAt || inv.createdAt)}</td>
                      <td className="py-3 pr-3 text-right font-semibold text-slate-900">{clp(inv.total)}</td>
                      <td className="py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${st.cls}`}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Estado de la vitrina */}
      <section className="bg-white border border-slate-200 rounded-control p-6 shadow-sm" aria-labelledby="state-title">
        <h3 id="state-title" className="text-base font-bold text-slate-900 mb-3">Estado de tu vitrina</h3>
        <div className={`border rounded-control p-4 mb-4 ${stateBlock.tone}`}>
          <p className="font-bold text-sm">{stateBlock.title}</p>
          <p className="text-sm mt-0.5">{stateBlock.text}</p>
        </div>
        {isVisible && (
          <button type="button" disabled={busy} onClick={pause} className="btn-ghost !min-h-[40px] !py-2 disabled:opacity-50">
            <PauseCircle className="w-4 h-4" aria-hidden="true" /> Pausar mi vitrina
          </button>
        )}
        {status === 'REJECTED' && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Corrige tus datos en “Datos del Prestador” y luego pide una nueva revisión.</p>
            <button type="button" disabled={busy} onClick={resubmit} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50">Reenviar a revisión</button>
          </div>
        )}
        {status === 'PAUSED' && (
          <button type="button" disabled={busy} onClick={resume} className="btn-cta !min-h-[40px] !py-2 disabled:opacity-50">
            <PlayCircle className="w-4 h-4" aria-hidden="true" /> Reanudar mi vitrina
          </button>
        )}
      </section>

      {/* Seguridad */}
      <form onSubmit={changePassword} className="bg-white border border-slate-200 rounded-control p-6 shadow-sm space-y-4" aria-labelledby="pw-title">
        <h3 id="pw-title" className="text-base font-bold text-slate-900">Cambiar contraseña</h3>
        <div>
          <label htmlFor="pa-current" className="block text-sm font-semibold text-slate-700 mb-1">Contraseña actual</label>
          <input id="pa-current" type="password" autoComplete="current-password" required value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} className="input-market" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="pa-new" className="block text-sm font-semibold text-slate-700 mb-1">Nueva contraseña</label>
            <input id="pa-new" type="password" autoComplete="new-password" required minLength={8} value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} className="input-market" />
          </div>
          <div>
            <label htmlFor="pa-repeat" className="block text-sm font-semibold text-slate-700 mb-1">Repetir nueva</label>
            <input id="pa-repeat" type="password" autoComplete="new-password" required minLength={8} value={pwd.repeat} onChange={(e) => setPwd((p) => ({ ...p, repeat: e.target.value }))} className="input-market" />
          </div>
        </div>
        <p className="text-xs text-slate-500">Mínimo 8 caracteres, con letras y números.</p>
        <button type="submit" disabled={pwdSaving} className="btn-primary disabled:opacity-50">{pwdSaving ? 'Actualizando…' : 'Actualizar contraseña'}</button>
      </form>

      {/* Cierre de cuenta */}
      <section className="bg-red-50 border border-red-100 rounded-control p-6 space-y-3" aria-labelledby="close-title">
        <h3 id="close-title" className="text-base font-bold text-red-700">Cerrar mi cuenta</h3>
        <p className="text-sm text-slate-700">
          Se desactivan tus accesos y tu vitrina deja de ser visible. No se puede deshacer. No puedes cerrarla con servicios en curso o pagos en custodia.
          Si solo quieres un descanso, usa “Pausar mi vitrina”.
        </p>
        {!showClose ? (
          <button type="button" onClick={() => setShowClose(true)} className="text-sm font-bold text-red-700 hover:text-red-800 underline min-h-[44px]">
            Quiero cerrar mi cuenta
          </button>
        ) : (
          <div className="space-y-3 pt-3 border-t border-red-100">
            <label htmlFor="close-confirm" className="block text-sm font-semibold text-red-700">Escribe CERRAR para confirmar</label>
            <input id="close-confirm" value={closeText} onChange={(e) => setCloseText(e.target.value)} className="input-market max-w-xs" autoComplete="off" />
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={closing || closeText.trim().toUpperCase() !== 'CERRAR'} onClick={closeAccount} className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {closing ? 'Procesando…' : 'Cerrar mi cuenta definitivamente'}
              </button>
              <button type="button" onClick={() => { setShowClose(false); setCloseText(''); }} className="btn-ghost">Cancelar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProviderAccountPanel;
