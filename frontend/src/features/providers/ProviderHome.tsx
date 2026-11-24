import React, { useState } from 'react';
import { ArrowRight, Check, CircleDashed, Inbox, PartyPopper, PlayCircle, ShieldCheck, Star, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMarket } from '../../config/market';
import api from '../../lib/http';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  provider: any;
  openRequestsCount: number;
  activeJobsCount: number;
  sentQuotesCount: number;
  rating: number;
  /** Contactos y visitas de los ultimos 7 dias y de los 7 anteriores; null si aun no se registran */
  engagement: { views: number; contacts: number; previousViews: number; previousContacts: number } | null;
  /** Las estadisticas de visitas y contactos son parte de los planes de pago */
  statsLocked?: boolean;
  onUpgrade?: () => void;
  onChanged: () => void;
  onGoRequests: (view: 'new' | 'quoted' | 'active') => void;
  onGoBusiness: () => void;
  onGoAccount: () => void;
}

// Variacion respecto de la semana anterior (solo si hay con que comparar)
const Delta: React.FC<{ now: number; before: number }> = ({ now, before }) => {
  if (before <= 0) return <p className="text-xs text-slate-400 mt-0.5">&nbsp;</p>;
  const diff = now - before;
  if (diff === 0) return <p className="text-xs text-slate-500 mt-0.5">Igual que la semana pasada</p>;
  return <p className={`text-xs font-semibold mt-0.5 ${diff > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>{diff > 0 ? '+' : ''}{diff} vs. semana pasada</p>;
};

const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.response?.data?.message || fallback;

/**
 * Inicio: solo lo que hay que hacer ahora. Mientras la vitrina no esta lista, una lista de pasos;
 * ya publicada, lo que requiere atencion y tres numeros. Nada de estadisticas de relleno.
 */
const ProviderHome: React.FC<Props> = ({
  provider, openRequestsCount, activeJobsCount, sentQuotesCount, rating, engagement, statsLocked, onUpgrade, onChanged, onGoRequests, onGoBusiness, onGoAccount,
}) => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const market = useMarket();
  const [busy, setBusy] = useState(false);
  const status: string = provider?.status || 'PENDING';
  const published = status === 'ACTIVE' || status === 'APPROVED';

  const dataDone = Boolean(provider?.businessName?.trim() && provider?.phone?.trim() && provider?.commune?.trim());
  const canPublish = status === 'PENDING';

  const act = async (path: string, okText: string) => {
    setBusy(true);
    try {
      const { data } = await api.post(path);
      addToast(data?.message || okText, 'success');
      onChanged();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo completar la acción.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  /* ───── 1) Estados que bloquean todo lo demas ───── */
  if (status === 'SUSPENDED' || status === 'REJECTED' || status === 'UNDER_REVIEW') {
    const rejected = status === 'REJECTED';
    return (
      <div className="bg-white border border-slate-200 rounded-card p-6 shadow-sm">
        <h2 className="text-lg text-slate-900 mb-1">
          {status === 'SUSPENDED' ? 'Tu cuenta está suspendida' : rejected ? 'Tu vitrina fue rechazada' : 'Tu vitrina está en revisión'}
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          {status === 'UNDER_REVIEW'
            ? 'Nuestro equipo está revisando tu información. Te avisaremos cuando termine.'
            : provider?.rejectionReason || 'Escribe a contacto@redmecanica.cl para revisar tu caso.'}
        </p>
        <button type="button" onClick={onGoAccount} className="btn-primary !min-h-[40px] !py-2">
          {rejected ? 'Corregir y reenviar' : 'Ver detalles'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  /* ───── 2) Vitrina pausada ───── */
  if (status === 'PAUSED') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-card p-6">
        <h2 className="text-lg text-slate-900 mb-1">Tu vitrina está pausada</h2>
        <p className="text-sm text-slate-600 mb-4">No apareces en el directorio ni recibes solicitudes nuevas. Los servicios en curso continúan.</p>
        <button type="button" disabled={busy} onClick={() => act('/providers/me/resume', 'Vitrina reanudada.')} className="btn-cta !min-h-[40px] !py-2 disabled:opacity-50">
          <PlayCircle className="w-4 h-4" aria-hidden="true" /> Reanudar mi vitrina
        </button>
      </div>
    );
  }

  /* ───── 3) Vitrina por completar / publicar ───── */
  if (!published) {
    const steps = [
      { done: dataDone, title: t('home.stepData'), hint: t('home.stepDataHint', { zone: market.zoneLabel.singular }), action: onGoBusiness, label: 'Completar datos' },
      { done: false, title: 'Publica tu vitrina', hint: 'Aparecerás en el directorio y recibirás solicitudes.', action: () => act('/providers/me/publish', 'Vitrina publicada.'), label: 'Publicar', disabled: !dataDone || !canPublish },
    ];
    return (
      <section className="bg-white border border-slate-200 rounded-card p-6 shadow-sm" aria-labelledby="start-title">
        <h2 id="start-title" className="text-lg text-slate-900 mb-1">{t('home.setupTitle')}</h2>
        <p className="text-sm text-slate-600 mb-5">Son dos pasos y quedas visible para tus clientes.</p>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s.title} className={`flex items-center gap-3 p-4 rounded-control border ${s.done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
              <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${s.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`} aria-hidden="true">
                {s.done ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-600">{s.hint}</p>
              </div>
              {!s.done && (
                <button type="button" disabled={busy || s.disabled} onClick={s.action} className="btn-primary !min-h-[40px] !py-2 shrink-0 disabled:opacity-40">
                  {s.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  /* ───── 4) Publicada: lo que requiere atencion ───── */
  const attention = [
    openRequestsCount > 0 && {
      icon: Inbox,
      text: t('home.newRequests', { count: openRequestsCount }),
      cta: t('home.viewRequests'),
      go: () => onGoRequests('new'),
      tone: 'bg-amber-50 border-amber-200',
    },
    status === 'ACTIVE' && !(provider?.hasIdDocument && provider?.hasBackgroundCheck) && {
      icon: ShieldCheck,
      text: t('home.uploadDocs'),
      cta: t('home.upload'),
      go: onGoBusiness,
      tone: 'bg-emerald-50 border-emerald-200',
    },
    activeJobsCount > 0 && {
      icon: Wrench,
      text: t('home.activeJobs', { count: activeJobsCount }),
      cta: t('home.continue'),
      go: () => onGoRequests('active'),
      tone: 'bg-blue-50 border-blue-200',
    },
  ].filter(Boolean) as Array<{ icon: any; text: string; cta: string; go: () => void; tone: string }>;

  return (
    <div className="space-y-6">
      <section aria-labelledby="att-title">
        <h2 id="att-title" className="text-lg text-slate-900 mb-3">{t('home.attention')}</h2>
        {attention.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-card p-6 text-center">
            <PartyPopper className="w-8 h-8 mx-auto mb-2 text-slate-300" aria-hidden="true" />
            <p className="font-semibold text-slate-900">{t('home.allDone')}</p>
            <p className="text-sm text-slate-600 mt-1">{t('home.allDoneHint')}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {attention.map((a) => (
              <li key={a.text}>
                <button type="button" onClick={a.go} className={`w-full flex items-center gap-3 p-4 rounded-card border text-left min-h-[64px] ${a.tone}`}>
                  <a.icon className="w-6 h-6 text-slate-700 shrink-0" aria-hidden="true" />
                  <span className="flex-1 font-semibold text-slate-900">{a.text}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary shrink-0">{a.cta}<ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Resumen" className="grid grid-cols-3 gap-3">
        {engagement ? (
          <>
            <div className="bg-white border border-slate-200 rounded-card p-4">
              <p className="text-2xl font-black text-slate-900">{engagement.contacts}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{t('home.contactsWeek')}</p>
              <Delta now={engagement.contacts} before={engagement.previousContacts} />
            </div>
            <div className="bg-white border border-slate-200 rounded-card p-4">
              <p className="text-2xl font-black text-slate-900">{engagement.views}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{t('home.views')}</p>
              <Delta now={engagement.views} before={engagement.previousViews} />
            </div>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onGoRequests('active')} className="bg-white border border-slate-200 rounded-card p-4 text-left">
              <p className="text-2xl font-black text-slate-900">{activeJobsCount}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">En curso</p>
            </button>
            <button type="button" onClick={() => onGoRequests('quoted')} className="bg-white border border-slate-200 rounded-card p-4 text-left">
              <p className="text-2xl font-black text-slate-900">{sentQuotesCount}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Cotizaciones enviadas</p>
            </button>
          </>
        )}
        <div className="bg-white border border-slate-200 rounded-card p-4">
          <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
            {rating > 0 ? <>{rating.toFixed(1)}<Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" /></> : '—'}
          </p>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{rating > 0 ? t('home.rating') : t('home.noRatings')}</p>
        </div>
      </section>
      {statsLocked && (
        <p className="text-xs text-slate-600 -mt-3">
          Las estadísticas de visitas y contactos están incluidas en el plan Destacado.{' '}
          {onUpgrade && <button type="button" onClick={onUpgrade} className="font-bold text-primary hover:underline">Ver planes</button>}
        </p>
      )}
      {engagement && engagement.contacts === 0 && engagement.views === 0 && (
        <p className="text-xs text-slate-500 -mt-3">Contamos las visitas a tu vitrina y los clics en WhatsApp y teléfono. Comparte tu enlace para empezar a recibirlos.</p>
      )}

      {status === 'ACTIVE' && (
        <p className="text-sm text-slate-600 flex items-start gap-2">
          <CircleDashed className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
          Tu vitrina está visible. Sube tu cédula y tu certificado de antecedentes para verificarla.
        </p>
      )}
    </div>
  );
};

export default ProviderHome;
