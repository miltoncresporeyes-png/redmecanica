import { useTranslation } from 'react-i18next';
import { setMarket } from '../../config/market';
import React, { useState, useEffect } from 'react';
import { ClipboardList, ExternalLink, House, Settings, Store, X } from 'lucide-react';
import api from '../../lib/http';
import { useAuth } from '../../app/providers';
import { readCache, writeCache } from '../../lib/cache';
import { formatMoney } from '../../utils/money';
import ProviderHome from './ProviderHome';
import RequestsHub, { RequestsView } from './RequestsHub';
import BusinessPanel from './BusinessPanel';
import ProviderAccountPanel from './ProviderAccountPanel';
import SubscriptionPaymentModal from './SubscriptionPaymentModal';

interface ProviderDashboardProps {
  onClose: () => void;
}

type Tab = 'home' | 'requests' | 'business' | 'account';

const IN_PROGRESS_STATUSES = ['CONFIRMED', 'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING', 'IN_PROGRESS', 'WORK_COMPLETED'];

const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: 'Verificada', cls: 'bg-emerald-100 text-emerald-800' },
  ACTIVE: { label: 'Publicada', cls: 'bg-blue-100 text-blue-800' },
  PAUSED: { label: 'Pausada', cls: 'bg-slate-200 text-slate-700' },
  SUSPENDED: { label: 'Suspendida', cls: 'bg-red-100 text-red-800' },
  REJECTED: { label: 'Rechazada', cls: 'bg-red-100 text-red-800' },
  UNDER_REVIEW: { label: 'En revisión', cls: 'bg-blue-100 text-blue-800' },
  PENDING: { label: 'Sin publicar', cls: 'bg-amber-100 text-amber-900' },
};

/**
 * Panel del prestador: 4 destinos (Inicio, Solicitudes, Mi negocio, Cuenta), como las apps de referencia
 * (pocos destinos, "Inicio" = lo que requiere accion, configuracion y cuenta aparte).
 * Barra inferior en el movil, pestañas arriba en pantallas grandes.
 */
const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onClose }) => {
  const { user: authUser } = useAuth();
  const cacheKey = authUser?.id ? `panel:${authUser.id}` : null;
  // Ultimo panel visto (si existe): se muestra al instante y se actualiza en segundo plano.
  const [cached] = useState<any>(() => (cacheKey ? readCache<any>(cacheKey) : null));

  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('home');
  const [requestsView, setRequestsView] = useState<RequestsView>('new');
  const [loading, setLoading] = useState(!cached);
  const [data, setData] = useState<any>(cached?.dashboard ?? null);
  const [jobs, setJobs] = useState<any[]>(cached?.jobs ?? []);
  const [quotes, setQuotes] = useState<any[]>(cached?.quotes ?? []);
  const [invoices, setInvoices] = useState<any[]>(cached?.invoices ?? []);
  const [openRequestsCount, setOpenRequestsCount] = useState<number>(cached?.openRequestsCount ?? 0);
  // Contactos y visitas de la ultima semana (null mientras la base no tenga la tabla de eventos)
  const [engagement, setEngagement] = useState<any>(cached?.engagement ?? null);
  // Condiciones comerciales que informa el servidor (p. ej. la comision). Si no llegan, no se muestran montos derivados.
  const [platformFeePercent, setPlatformFeePercent] = useState<number | null>(cached?.config?.platformFeePercent ?? null);
  // Plan vigente y sus limites segun el servidor (un plan vencido cuenta como gratuito)
  const [planInfo, setPlanInfo] = useState<{ plan: string; communes: number; statsLocked: boolean }>({
    plan: cached?.plan ?? 'FREE', communes: cached?.limits?.communes ?? 1, statsLocked: cached?.engagementLocked ?? true,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const applyPanel = (panel: any) => {
    setData(panel.dashboard);
    setJobs(panel.jobs || []);
    setQuotes(panel.quotes || []);
    setInvoices(panel.invoices || []);
    setOpenRequestsCount(Number(panel.openRequestsCount) || 0);
    setEngagement(panel.engagement ?? null);
    setPlanInfo({ plan: panel.plan ?? 'FREE', communes: panel.limits?.communes ?? 1, statsLocked: panel.engagementLocked ?? false });
    setMarket(panel.config?.market);
    setPlatformFeePercent(typeof panel.config?.platformFeePercent === 'number' ? panel.config.platformFeePercent : null);
    if (cacheKey) writeCache(cacheKey, panel);
  };

  // Una sola peticion trae todo el panel. El indicador de carga solo aparece la primera vez y sin cache.
  const fetchData = async () => {
    try {
      if (!data) setLoading(true);
      try {
        const { data: panel } = await api.get('/providers/me/panel');
        applyPanel(panel);
      } catch (err: any) {
        // Servidor sin el endpoint nuevo (despliegue por partes): se usan los endpoints anteriores.
        if (err?.response?.status && err.response.status !== 404) throw err;
        const [dashRes, jobsRes, quotesRes, invoicesRes] = await Promise.all([
          api.get('/providers/me/dashboard').catch(() => ({ data: null })),
          api.get('/providers/me/jobs').catch(() => ({ data: [] })),
          api.get('/providers/me/quotes').catch(() => ({ data: [] })),
          api.get('/providers/me/invoices').catch(() => ({ data: [] })),
        ]);
        applyPanel({ dashboard: dashRes.data, jobs: jobsRes.data || [], quotes: quotesRes.data || [], invoices: invoicesRes.data || [] });
      }
    } catch (error) {
      console.error('Error fetching provider data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const provider = data?.provider;
  const stats = data?.stats || {};
  const activeJobs = jobs.filter((j) => IN_PROGRESS_STATUSES.includes(j.status));
  const sentQuotes = quotes.filter((q) => q.status === 'SENT');
  const attentionCount = openRequestsCount + activeJobs.length;

  const goRequests = (view: 'new' | 'quoted' | 'active') => { setRequestsView(view); setTab('requests'); };

  // Resumen de pagos por la plataforma: solo aparece si hay pagos y se conoce la comision.
  const paymentsSection = (() => {
    const held = jobs.filter((j) => j.paymentStatus === 'HELD');
    const released = jobs.filter((j) => j.paymentStatus === 'RELEASED');
    if ((held.length === 0 && released.length === 0) || platformFeePercent == null) return null;
    const sum = (list: any[]) => list.reduce((acc, j) => acc + (Number(j.estimatedCost) || 0), 0);
    const gross = sum(released);
    const commission = gross * (platformFeePercent / 100);
    return (
      <section className="bg-white border border-slate-200 rounded-control p-6 shadow-sm" aria-labelledby="pay-title">
        <h3 id="pay-title" className="text-base font-bold text-slate-900 mb-4">Pagos por la plataforma</h3>
        <dl className={`grid grid-cols-1 gap-4 ${platformFeePercent > 0 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          <div><dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Liberado a tu favor</dt><dd className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(gross - commission)}</dd><dd className="text-xs text-slate-500">{platformFeePercent > 0 ? `Descontada la comisión (${platformFeePercent} %)` : 'Sin comisión: recibes el total'}</dd></div>
          <div><dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retenido</dt><dd className="text-2xl font-bold text-blue-700 mt-1">{formatMoney(sum(held))}</dd><dd className="text-xs text-slate-500">Se libera al cerrar cada servicio</dd></div>
          {platformFeePercent > 0 && <div><dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comisión</dt><dd className="text-2xl font-bold text-slate-600 mt-1">{formatMoney(commission)}</dd><dd className="text-xs text-slate-500">{platformFeePercent} % de lo liberado</dd></div>}
        </dl>
      </section>
    );
  })();

  const NAV: Array<{ id: Tab; label: string; icon: any; badge?: number }> = [
    { id: 'home', label: t('nav.home'), icon: House },
    { id: 'requests', label: t('nav.requests'), icon: ClipboardList, badge: attentionCount },
    { id: 'business', label: t('nav.business'), icon: Store },
    { id: 'account', label: t('nav.account'), icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20" role="status">
        <div className="flex items-center gap-3 text-slate-600 font-semibold animate-pulse">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" aria-hidden="true" />
          Cargando tu panel…
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
        <h1 className="text-slate-900 mb-2">No encontramos tu perfil de prestador</h1>
        <p className="text-sm text-slate-600 mb-5">Si te registraste como prestador, escríbenos a contacto@redmecanica.cl.</p>
        <button onClick={onClose} className="btn-primary">Ir al inicio</button>
      </div>
    );
  }

  const chip = STATUS_CHIP[provider.status] || STATUS_CHIP.PENDING;
  const name = provider.businessName || provider.user?.name || 'Mi negocio';
  const published = provider.status === 'ACTIVE' || provider.status === 'APPROVED';

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 pb-28 md:pb-10 animate-fadeIn">
      {/* Cabecera compacta: quien eres y como estas */}
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl text-slate-900 truncate">{name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${chip.cls}`}>{chip.label}</span>
            {provider.commune && <span className="text-sm text-slate-600 truncate">{provider.commune}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {published && (
            <a href={`/proveedor/${provider.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[40px] !py-2 hidden sm:inline-flex">
              Ver mi vitrina <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          <button onClick={onClose} aria-label="Salir del panel" className="hidden md:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-control min-h-[44px] min-w-[44px] items-center justify-center">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Navegacion: pestañas en escritorio */}
      <nav className="hidden md:flex gap-1 border-b border-slate-200 mb-6" aria-label="Secciones del panel">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            aria-current={tab === n.id ? 'page' : undefined}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px min-h-[44px] transition-colors ${
              tab === n.id ? 'text-primary border-primary' : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <n.icon className="w-4 h-4" aria-hidden="true" />
            {n.label}
            {!!n.badge && n.badge > 0 && <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-1.5 min-w-[20px] text-center">{n.badge}</span>}
          </button>
        ))}
      </nav>

      <main id="panel-content" aria-live="polite">
        {tab === 'home' && (
          <ProviderHome
            provider={provider}
            openRequestsCount={openRequestsCount}
            activeJobsCount={activeJobs.length}
            sentQuotesCount={sentQuotes.length}
            rating={Number(stats.avgRating) || 0}
            engagement={engagement}
            statsLocked={planInfo.statsLocked}
            onUpgrade={() => setShowPaymentModal(true)}
            onChanged={fetchData}
            onGoRequests={goRequests}
            onGoBusiness={() => setTab('business')}
            onGoAccount={() => setTab('account')}
          />
        )}

        {tab === 'requests' && (
          <RequestsHub
            view={requestsView}
            onViewChange={setRequestsView}
            quotes={quotes}
            jobs={jobs}
            providerStatus={provider.status}
            openRequestsCount={openRequestsCount}
            onChanged={fetchData}
            onGoToProfile={() => setTab('business')}
          />
        )}

        {tab === 'business' && <BusinessPanel provider={provider} onSaved={fetchData} onUpgradePlan={() => setShowPaymentModal(true)} />}

        {tab === 'account' && (
          <ProviderAccountPanel
            provider={provider}
            invoices={invoices}
            onChanged={fetchData}
            onOpenBilling={() => setShowPaymentModal(true)}
            planInfo={planInfo}
            onClose={onClose}
            paymentsSection={paymentsSection}
          />
        )}
      </main>

      {/* Navegacion: barra inferior en el movil (alcance del pulgar) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 safe-bottom" aria-label="Secciones del panel">
        <ul className="grid grid-cols-4">
          {NAV.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => setTab(n.id)}
                aria-current={tab === n.id ? 'page' : undefined}
                className={`relative w-full flex flex-col items-center justify-center gap-0.5 pt-2 pb-2.5 min-h-[56px] text-xs font-semibold ${tab === n.id ? 'text-primary' : 'text-slate-600'}`}
              >
                <span className="relative">
                  <n.icon className="w-6 h-6" aria-hidden="true" />
                  {!!n.badge && n.badge > 0 && <span className="absolute -top-1.5 -right-2.5 text-[11px] leading-none font-bold bg-red-600 text-white rounded-full px-1.5 py-0.5">{n.badge}</span>}
                </span>
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {showPaymentModal && provider && (
        <SubscriptionPaymentModal providerId={provider.id} onClose={() => setShowPaymentModal(false)} onSuccess={fetchData} />
      )}
    </div>
  );
};

export default ProviderDashboard;
