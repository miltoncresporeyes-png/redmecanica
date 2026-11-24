import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import api from '../../lib/http';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

interface JobsPanelProps {
  jobs: any[];
  onChanged: () => void;
  /** Muestra solo los servicios en curso o el historial (por defecto ambos) */
  section?: 'active' | 'history';
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  SEARCHING: 'Buscando prestador',
  QUOTING: 'Recibiendo cotizaciones',
  COMPARING_QUOTES: 'Cliente comparando',
  CONFIRMED: 'Confirmado',
  PROVIDER_EN_ROUTE: 'En camino',
  PROVIDER_ARRIVED: 'Llegaste',
  DIAGNOSING: 'En diagnóstico',
  IN_PROGRESS: 'Trabajo en curso',
  WORK_COMPLETED: 'Trabajo terminado',
  DELIVERED: 'Entregado',
  REVIEWED: 'Calificado',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado',
  DISPUTED: 'En disputa',
  REFUNDED: 'Reembolsado',
};

// Mismo flujo que permite el backend al prestador (jobs.ts > PROVIDER_TRANSITIONS)
const NEXT_ACTION: Record<string, { label: string; confirm?: string }> = {
  CONFIRMED: { label: 'Salir en camino' },
  PROVIDER_EN_ROUTE: { label: 'Ya llegué' },
  PROVIDER_ARRIVED: { label: 'Iniciar diagnóstico' },
  DIAGNOSING: { label: 'Iniciar trabajo' },
  IN_PROGRESS: { label: 'Marcar trabajo terminado', confirm: 'Se avisará al cliente que el trabajo terminó.' },
  WORK_COMPLETED: { label: 'Marcar como entregado', confirm: 'Confirma que entregaste el vehículo al cliente.' },
};

const STEPS = ['CONFIRMED', 'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING', 'IN_PROGRESS', 'WORK_COMPLETED', 'DELIVERED'];

const badgeClass = (s: string) =>
  s === 'CLOSED' || s === 'DELIVERED' || s === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800'
  : s === 'CANCELLED' || s === 'DISPUTED' || s === 'REFUNDED' ? 'bg-rose-100 text-rose-800'
  : NEXT_ACTION[s] ? 'bg-blue-100 text-blue-800'
  : 'bg-slate-100 text-slate-700';

const JobsPanel: React.FC<JobsPanelProps> = ({ jobs, onChanged, section }) => {
  const { addToast } = useToast();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);

  const advance = async (job: any) => {
    const action = NEXT_ACTION[job.status];
    if (!action) return;
    if (action.confirm) {
      const ok = await confirm({ title: action.label, message: action.confirm, confirmText: 'Confirmar', confirmVariant: 'primary', icon: 'info' });
      if (!ok) return;
    }
    setBusyId(job.id);
    try {
      await api.patch(`/jobs/${job.id}/advance`);
      addToast('Estado actualizado.', 'success');
      onChanged();
    } catch (e: any) {
      addToast(e?.response?.data?.error || e?.response?.data?.message || 'No se pudo actualizar el estado.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const active = jobs.filter((j) => !['CLOSED', 'CANCELLED', 'REVIEWED', 'REFUNDED'].includes(j.status));
  const finished = jobs.filter((j) => ['CLOSED', 'CANCELLED', 'REVIEWED', 'REFUNDED'].includes(j.status));

  const renderJob = (job: any) => {
    const action = NEXT_ACTION[job.status];
    const stepIndex = STEPS.indexOf(job.status);
    return (
      <li key={job.id} className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900">{job.request?.service?.name || 'Servicio'}</p>
            <p className="text-sm text-slate-600 mt-0.5">
              {[job.request?.vehicle?.make, job.request?.vehicle?.model].filter(Boolean).join(' ') || 'Vehículo'}
              {job.request?.user?.name ? ` · ${job.request.user.name}` : ''}
            </p>
            {job.status !== 'PENDING' && job.request?.user?.email && STEPS.includes(job.status) && (
              <p className="text-xs text-slate-500 mt-1">Cliente: {job.request.user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <div className="text-right">
              {job.estimatedCost ? <p className="font-bold text-sm text-slate-900">${Number(job.estimatedCost).toLocaleString('es-CL')}</p> : null}
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded ${badgeClass(job.status)}`}>
                {STATUS_LABEL[job.status] || job.status}
              </span>
            </div>
            {action && (
              <button type="button" disabled={busyId === job.id} onClick={() => advance(job)} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50 shrink-0">
                {busyId === job.id ? 'Actualizando…' : action.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        {stepIndex >= 0 && (
          <ol className="mt-3 flex items-center gap-1" aria-label="Progreso del servicio">
            {STEPS.map((s, i) => (
              <li key={s} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-slate-200'}`} title={STATUS_LABEL[s]} />
            ))}
          </ol>
        )}
        {job.status === 'DELIVERED' && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-emerald-700">
            <Check className="w-4 h-4" aria-hidden="true" /> Entregado. Esperando la calificación del cliente.
          </p>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {section !== 'history' && <section className="bg-white rounded-control p-6 border border-slate-200 shadow-sm" aria-labelledby="jobs-active">
        <h3 id="jobs-active" className="text-base font-bold text-slate-900 mb-1">Servicios en curso</h3>
        <p className="text-sm text-slate-600 mb-4">Avanza cada etapa para mantener informado al cliente.</p>
        {active.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No tienes servicios activos. Cuando un cliente acepte tu cotización aparecerá aquí.</p>
        ) : (
          <ul className="divide-y divide-slate-100">{active.map(renderJob)}</ul>
        )}
      </section>}

      {section !== 'active' && <section className="bg-white rounded-control p-6 border border-slate-200 shadow-sm" aria-labelledby="jobs-done">
        <h3 id="jobs-done" className="text-base font-bold text-slate-900 mb-4">Historial</h3>
        {finished.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">Aún no hay servicios finalizados.</p>
        ) : (
          <ul className="divide-y divide-slate-100">{finished.map(renderJob)}</ul>
        )}
      </section>}
    </div>
  );
};

export default JobsPanel;
