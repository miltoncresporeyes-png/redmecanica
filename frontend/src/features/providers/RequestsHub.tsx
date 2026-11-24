import React from 'react';
import QuotesPanel from './QuotesPanel';
import JobsPanel from './JobsPanel';

export type RequestsView = 'new' | 'quoted' | 'active' | 'history';

interface Props {
  view: RequestsView;
  onViewChange: (v: RequestsView) => void;
  quotes: any[];
  jobs: any[];
  providerStatus?: string;
  openRequestsCount: number;
  onChanged: () => void;
  onGoToProfile: () => void;
}

const ACTIVE = ['CONFIRMED', 'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING', 'IN_PROGRESS', 'WORK_COMPLETED'];

/**
 * Solicitudes: todo el trabajo en un solo lugar y en el orden en que ocurre
 * (nuevas -> cotizadas -> en curso -> historial), en vez de dos pestañas separadas.
 */
const RequestsHub: React.FC<Props> = ({ view, onViewChange, quotes, jobs, providerStatus, openRequestsCount, onChanged, onGoToProfile }) => {
  const sentQuotes = quotes.filter((q) => q.status === 'SENT');
  const activeJobs = jobs.filter((j) => ACTIVE.includes(j.status));

  const tabs: Array<{ id: RequestsView; label: string; count: number }> = [
    { id: 'new', label: 'Nuevas', count: openRequestsCount },
    { id: 'quoted', label: 'Cotizadas', count: sentQuotes.length },
    { id: 'active', label: 'En curso', count: activeJobs.length },
    { id: 'history', label: 'Historial', count: 0 },
  ];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Estado de las solicitudes" className="flex gap-1 p-1 bg-slate-100 rounded-card overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={view === t.id}
            onClick={() => onViewChange(t.id)}
            className={`flex-1 whitespace-nowrap px-3 py-2.5 rounded-control text-sm font-semibold min-h-[44px] transition-colors flex items-center justify-center gap-1.5 ${
              view === t.id ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
            {t.count > 0 && <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${view === t.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {view === 'new' && <QuotesPanel section="open" quotes={quotes} providerStatus={providerStatus} onChanged={onChanged} onGoToProfile={onGoToProfile} />}
      {view === 'quoted' && <QuotesPanel section="mine" quotes={quotes} providerStatus={providerStatus} onChanged={onChanged} onGoToProfile={onGoToProfile} />}
      {view === 'active' && <JobsPanel section="active" jobs={jobs} onChanged={onChanged} />}
      {view === 'history' && <JobsPanel section="history" jobs={jobs} onChanged={onChanged} />}
    </div>
  );
};

export default RequestsHub;
