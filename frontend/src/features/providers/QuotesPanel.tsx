import React, { useCallback, useEffect, useState } from 'react';
import { FileText, Inbox, Pencil, Trash2, X } from 'lucide-react';
import api from '../../lib/http';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

interface QuotesPanelProps {
  quotes: any[];
  /** Estado de la vitrina: solo ACTIVE o APPROVED pueden cotizar */
  providerStatus?: string;
  onChanged: () => void;
  onGoToProfile: () => void;
  /** Muestra solo una parte: solicitudes abiertas o mis cotizaciones (por defecto ambas) */
  section?: 'open' | 'mine';
}

const DURATIONS = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 480, label: '1 día' },
  { value: 1440, label: '2 días o más' },
];
const VALIDITY = [
  { hours: 24, label: '24 horas' },
  { hours: 48, label: '48 horas' },
  { hours: 24 * 7, label: '7 días' },
];

const clp = (n: number | undefined | null) => `$${Number(n || 0).toLocaleString('es-CL')}`;
const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.response?.data?.message || fallback;

interface FormState {
  totalCost: string;
  laborCost: string;
  partsCost: string;
  estimatedDuration: number;
  warranty: string;
  preliminaryDiagnosis: string;
  validityHours: number;
}

const emptyForm: FormState = {
  totalCost: '',
  laborCost: '',
  partsCost: '',
  estimatedDuration: 60,
  warranty: '',
  preliminaryDiagnosis: '',
  validityHours: 48,
};

const QuoteFormModal: React.FC<{
  title: string;
  subtitle?: string;
  initial: FormState;
  submitLabel: string;
  onSubmit: (f: FormState) => Promise<void>;
  onClose: () => void;
}> = ({ title, subtitle, initial, submitLabel, onSubmit, onClose }) => {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormState, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  // Si hay mano de obra y repuestos, sugiere el total (editable)
  const suggested = (Number(form.laborCost) || 0) + (Number(form.partsCost) || 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(Number(form.totalCost) > 0)) {
      setError('Ingresa el valor total de la cotización.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(errMsg(err, 'No se pudo guardar la cotización.'));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="quote-form-title">
      <form onSubmit={submit} className="bg-white w-full max-w-lg rounded-card shadow-2xl border border-slate-100 max-h-[92dvh] overflow-y-auto my-auto">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-100">
          <div className="min-w-0">
            <h3 id="quote-form-title" className="text-lg text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm text-slate-600 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="p-2 -m-2 text-slate-500 hover:text-slate-800 rounded-control">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="q-labor" className="block text-sm font-semibold text-slate-700 mb-1">Mano de obra</label>
              <input id="q-labor" type="number" min={0} inputMode="numeric" value={form.laborCost} onChange={(e) => set('laborCost', e.target.value)} className="input-market" placeholder="$ 0" />
            </div>
            <div>
              <label htmlFor="q-parts" className="block text-sm font-semibold text-slate-700 mb-1">Repuestos</label>
              <input id="q-parts" type="number" min={0} inputMode="numeric" value={form.partsCost} onChange={(e) => set('partsCost', e.target.value)} className="input-market" placeholder="$ 0" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="q-total" className="block text-sm font-semibold text-slate-700">Valor total (CLP) *</label>
              {suggested > 0 && Number(form.totalCost) !== suggested && (
                <button type="button" onClick={() => set('totalCost', String(suggested))} className="text-xs font-bold text-primary hover:underline">
                  Usar suma: {clp(suggested)}
                </button>
              )}
            </div>
            <input id="q-total" type="number" min={1} inputMode="numeric" required value={form.totalCost} onChange={(e) => set('totalCost', e.target.value)} className="input-market" placeholder="Ej: 45000" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="q-duration" className="block text-sm font-semibold text-slate-700 mb-1">Duración estimada</label>
              <select id="q-duration" value={form.estimatedDuration} onChange={(e) => set('estimatedDuration', Number(e.target.value))} className="input-market">
                {DURATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="q-valid" className="block text-sm font-semibold text-slate-700 mb-1">Oferta válida por</label>
              <select id="q-valid" value={form.validityHours} onChange={(e) => set('validityHours', Number(e.target.value))} className="input-market">
                {VALIDITY.map((v) => <option key={v.hours} value={v.hours}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="q-warranty" className="block text-sm font-semibold text-slate-700 mb-1">Garantía (opcional)</label>
            <input id="q-warranty" type="text" maxLength={200} value={form.warranty} onChange={(e) => set('warranty', e.target.value)} className="input-market" placeholder="Ej: 30 días en mano de obra" />
          </div>

          <div>
            <label htmlFor="q-diag" className="block text-sm font-semibold text-slate-700 mb-1">Diagnóstico o detalle (opcional)</label>
            <textarea id="q-diag" rows={3} maxLength={2000} value={form.preliminaryDiagnosis} onChange={(e) => set('preliminaryDiagnosis', e.target.value)} className="input-market" placeholder="Qué incluye, qué revisarás, supuestos del precio…" />
          </div>

          {error && <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-control p-3">{error}</p>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-5 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-cta disabled:opacity-50">{saving ? 'Guardando…' : submitLabel}</button>
        </div>
      </form>
    </div>
  );
};

const QuotesPanel: React.FC<QuotesPanelProps> = ({ quotes, providerStatus, onChanged, onGoToProfile, section }) => {
  const { addToast } = useToast();
  const confirm = useConfirm();
  const canQuote = providerStatus === 'ACTIVE' || providerStatus === 'APPROVED';

  const [open, setOpen] = useState<any[]>([]);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [openError, setOpenError] = useState('');
  const [modal, setModal] = useState<
    | { kind: 'new'; job: any }
    | { kind: 'edit'; quote: any }
    | null
  >(null);

  const loadOpen = useCallback(async () => {
    if (!canQuote) return;
    setLoadingOpen(true);
    setOpenError('');
    try {
      const { data } = await api.get('/quotes/marketplace');
      setOpen(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setOpenError(errMsg(e, 'No se pudieron cargar las solicitudes abiertas.'));
    } finally {
      setLoadingOpen(false);
    }
  }, [canQuote]);

  useEffect(() => { loadOpen(); }, [loadOpen]);

  const toPayload = (f: FormState) => ({
    totalCost: Number(f.totalCost),
    laborCost: f.laborCost === '' ? undefined : Number(f.laborCost),
    partsCost: f.partsCost === '' ? undefined : Number(f.partsCost),
    estimatedDuration: f.estimatedDuration,
    warranty: f.warranty,
    preliminaryDiagnosis: f.preliminaryDiagnosis,
    validUntil: new Date(Date.now() + f.validityHours * 3600 * 1000).toISOString(),
  });

  const handleCreate = async (job: any, f: FormState) => {
    await api.post('/quotes', { jobId: job.id, ...toPayload(f) });
    addToast('Cotización enviada. El cliente la verá en su panel.', 'success');
    setModal(null);
    onChanged();
    loadOpen();
  };

  const handleEdit = async (quote: any, f: FormState) => {
    await api.put(`/quotes/${quote.id}`, toPayload(f));
    addToast('Cotización actualizada.', 'success');
    setModal(null);
    onChanged();
  };

  const handleWithdraw = async (quote: any) => {
    const ok = await confirm({
      title: 'Retirar cotización',
      message: 'El cliente dejará de ver esta oferta. Podrás volver a cotizar la solicitud mientras siga abierta.',
      confirmText: 'Retirar',
      confirmVariant: 'danger',
      icon: 'delete',
    });
    if (!ok) return;
    try {
      await api.delete(`/quotes/${quote.id}`);
      addToast('Cotización retirada.', 'success');
      onChanged();
      loadOpen();
    } catch (e: any) {
      addToast(errMsg(e, 'No se pudo retirar la cotización.'), 'error');
    }
  };

  const initialFromQuote = (q: any): FormState => ({
    totalCost: String(q.totalCost ?? ''),
    laborCost: q.laborCost ? String(q.laborCost) : '',
    partsCost: q.partsCost ? String(q.partsCost) : '',
    estimatedDuration: DURATIONS.some((d) => d.value === q.estimatedDuration) ? q.estimatedDuration : 60,
    warranty: q.warranty && q.warranty !== 'Sin garantía' ? q.warranty : '',
    preliminaryDiagnosis: q.preliminaryDiagnosis || '',
    validityHours: 48,
  });

  const jobTitle = (job: any) => job?.request?.service?.name || 'Servicio automotriz';
  const vehicleText = (job: any) => [job?.request?.vehicle?.make, job?.request?.vehicle?.model, job?.request?.vehicle?.year].filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      {/* Solicitudes abiertas */}
      {section !== 'mine' && <section className="bg-white rounded-control p-6 border border-slate-200 shadow-sm" aria-labelledby="open-title">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 id="open-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" aria-hidden="true" /> Solicitudes abiertas
          </h3>
          {canQuote && (
            <button type="button" onClick={loadOpen} className="text-sm font-semibold text-primary hover:underline min-h-[44px]">Actualizar</button>
          )}
        </div>
        <p className="text-sm text-slate-600 mb-4">Clientes que están pidiendo cotizaciones. Responde con tu mejor precio.</p>

        {!canQuote ? (
          <div className="bg-amber-50 border border-amber-100 rounded-control p-4 text-sm text-amber-900">
            Para cotizar, primero completa y publica tu vitrina.{' '}
            <button type="button" onClick={onGoToProfile} className="font-bold underline">Completar mis datos</button>
          </div>
        ) : loadingOpen ? (
          <p className="text-sm text-slate-500 py-6 text-center">Buscando solicitudes…</p>
        ) : openError ? (
          <p role="alert" className="text-sm text-red-600 py-4">{openError}</p>
        ) : open.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No hay solicitudes abiertas por ahora. Te mostraremos las nuevas aquí.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {open.map((job) => (
              <li key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900">{jobTitle(job)}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {vehicleText(job) || 'Vehículo sin detalle'}
                    {job.request?.user?.name ? ` · ${String(job.request.user.name).split(' ')[0]}` : ''}
                  </p>
                  {job.request?.problemDescription && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{job.request.problemDescription}</p>
                  )}
                </div>
                <button type="button" onClick={() => setModal({ kind: 'new', job })} className="btn-cta !min-h-[40px] !py-2 shrink-0">
                  <FileText className="w-4 h-4" aria-hidden="true" /> Cotizar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>}

      {/* Mis cotizaciones */}
      {section !== 'open' && <section className="bg-white rounded-control p-6 border border-slate-200 shadow-sm" aria-labelledby="mine-title">
        <h3 id="mine-title" className="text-base font-bold text-slate-900 mb-4">Mis cotizaciones</h3>
        {quotes.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">Aún no has enviado cotizaciones.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {quotes.map((quote) => {
              const sent = quote.status === 'SENT';
              const expired = sent && quote.validUntil && new Date(quote.validUntil).getTime() < Date.now();
              return (
                <li key={quote.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{quote.job?.request?.service?.name || 'Servicio'}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{quote.job?.request?.user?.name}</p>
                    {sent && quote.validUntil && (
                      <p className="text-xs text-slate-500 mt-1">
                        {expired ? 'Venció' : 'Válida hasta'} {new Date(quote.validUntil).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900">{clp(quote.totalCost)}</p>
                      <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded ${
                        quote.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800'
                        : quote.status === 'REJECTED' ? 'bg-rose-100 text-rose-800'
                        : expired ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-100 text-amber-900'
                      }`}>
                        {quote.status === 'ACCEPTED' ? 'Aceptada' : quote.status === 'REJECTED' ? 'Rechazada' : expired ? 'Vencida' : 'Enviada'}
                      </span>
                    </div>
                    {sent && (
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setModal({ kind: 'edit', quote })} aria-label="Editar cotización" className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-control min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => handleWithdraw(quote)} aria-label="Retirar cotización" className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-control min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>}

      {modal?.kind === 'new' && (
        <QuoteFormModal
          title="Enviar cotización"
          subtitle={`${jobTitle(modal.job)}${vehicleText(modal.job) ? ' · ' + vehicleText(modal.job) : ''}`}
          initial={emptyForm}
          submitLabel="Enviar cotización"
          onSubmit={(f) => handleCreate(modal.job, f)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'edit' && (
        <QuoteFormModal
          title="Editar cotización"
          subtitle={modal.quote.job?.request?.service?.name}
          initial={initialFromQuote(modal.quote)}
          submitLabel="Guardar cambios"
          onSubmit={(f) => handleEdit(modal.quote, f)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default QuotesPanel;
