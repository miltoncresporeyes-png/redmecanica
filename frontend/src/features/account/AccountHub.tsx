import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Car, ClipboardList, FileText, Plus, Search, Star, Trash2, X } from 'lucide-react';
import api from '../../lib/http';
import { useAuth } from '../../app/providers';
import { readCache, writeCache } from '../../lib/cache';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

interface AccountHubProps {
  currentUser: any;
  onClose: () => void;
}

// Estado real del servicio (Job). Si aun no hay Job, se usa el estado de la solicitud.
const JOB_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-900' },
  SEARCHING: { label: 'Buscando prestador', cls: 'bg-amber-100 text-amber-900' },
  QUOTING: { label: 'Recibiendo cotizaciones', cls: 'bg-blue-100 text-blue-800' },
  COMPARING_QUOTES: { label: 'Comparando cotizaciones', cls: 'bg-blue-100 text-blue-800' },
  CONFIRMED: { label: 'Confirmado', cls: 'bg-blue-100 text-blue-800' },
  PROVIDER_EN_ROUTE: { label: 'Prestador en camino', cls: 'bg-blue-100 text-blue-800' },
  PROVIDER_ARRIVED: { label: 'Prestador llegó', cls: 'bg-blue-100 text-blue-800' },
  DIAGNOSING: { label: 'En diagnóstico', cls: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'Trabajo en curso', cls: 'bg-blue-100 text-blue-800' },
  WORK_COMPLETED: { label: 'Trabajo terminado', cls: 'bg-emerald-100 text-emerald-800' },
  DELIVERED: { label: 'Entregado', cls: 'bg-emerald-100 text-emerald-800' },
  REVIEWED: { label: 'Calificado', cls: 'bg-emerald-100 text-emerald-800' },
  CLOSED: { label: 'Cerrado', cls: 'bg-emerald-100 text-emerald-800' },
  CANCELLED: { label: 'Cancelado', cls: 'bg-red-100 text-red-700' },
  DISPUTED: { label: 'En disputa', cls: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Reembolsado', cls: 'bg-slate-100 text-slate-700' },
  ACCEPTED: { label: 'Aceptada', cls: 'bg-blue-100 text-blue-800' },
  REJECTED: { label: 'Rechazada', cls: 'bg-red-100 text-red-700' },
};

// Mismos estados que permite cancelar el backend (jobs.ts > CANCELLABLE_STATUSES)
const CANCELLABLE = ['PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES', 'CONFIRMED', 'PROVIDER_EN_ROUTE'];
const RATEABLE = ['WORK_COMPLETED', 'DELIVERED'];

const clp = (n?: number | null) => `$${Number(n || 0).toLocaleString('es-CL')}`;
const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.response?.data?.message || fallback;

const AccountHub: React.FC<AccountHubProps> = ({ currentUser, onClose }) => {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const confirm = useConfirm();

  const [tab, setTab] = useState<'overview' | 'history' | 'settings'>('overview');
  // Ultimo panel visto (si existe): se muestra al instante y se actualiza en segundo plano.
  const cacheKey = currentUser?.id ? `client-panel:${currentUser.id}` : null;
  const [cached] = useState<any>(() => (cacheKey ? readCache<any>(cacheKey) : null));
  const [loading, setLoading] = useState(!cached);
  const [userData, setUserData] = useState<any>(cached?.user ?? null);
  const [quotes, setQuotes] = useState<any[]>(cached?.quotes ?? []);
  const [invoices, setInvoices] = useState<any[]>(cached?.invoices ?? []);

  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const [pwd, setPwd] = useState({ current: '', next: '', repeat: '' });
  const [pwdSaving, setPwdSaving] = useState(false);

  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', year: '', licensePlate: '' });
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleSaving, setVehicleSaving] = useState(false);

  const [ratingFor, setRatingFor] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [busyJob, setBusyJob] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      let panel: { user: any; quotes: any[]; invoices: any[] };
      try {
        // Una sola peticion trae todo el panel.
        panel = (await api.get('/users/me/panel')).data;
      } catch (err: any) {
        // Servidor sin el endpoint nuevo (despliegue por partes): se usan los 3 endpoints anteriores.
        if (err?.response?.status && err.response.status !== 404) throw err;
        const [userRes, quotesRes, invoicesRes] = await Promise.all([
          api.get(`/users/${currentUser.id}`),
          api.get('/quotes/user/me'),
          api.get('/users/me/invoices').catch(() => ({ data: [] })),
        ]);
        panel = { user: userRes.data, quotes: quotesRes.data, invoices: invoicesRes.data };
      }
      setInvoices(Array.isArray(panel.invoices) ? panel.invoices : []);
      setUserData(panel.user);
      setQuotes(Array.isArray(panel.quotes) ? panel.quotes : []);
      setForm({ name: panel.user.name || '', phone: panel.user.phone || '' });
      if (cacheKey) writeCache(cacheKey, panel);
    } catch (err) {
      console.error('Error cargando perfil', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) fetchData();
  }, [currentUser?.id, fetchData]);

  /* ───────── acciones ───────── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${currentUser.id}`, { name: form.name, phone: form.phone });
      addToast('Datos guardados.', 'success');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudieron guardar los cambios.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleSaving(true);
    try {
      await api.post('/users/me/vehicles', vehicleForm);
      addToast('Vehículo agregado.', 'success');
      setVehicleForm({ make: '', model: '', year: '', licensePlate: '' });
      setShowVehicleForm(false);
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo agregar el vehículo.'), 'error');
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleDeleteVehicle = async (v: any) => {
    const ok = await confirm({
      title: 'Eliminar vehículo',
      message: `¿Eliminar ${v.make} ${v.model}?`,
      confirmText: 'Eliminar',
      confirmVariant: 'danger',
      icon: 'delete',
    });
    if (!ok) return;
    try {
      await api.delete(`/users/me/vehicles/${v.id}`);
      addToast('Vehículo eliminado.', 'success');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo eliminar el vehículo.'), 'error');
    }
  };

  const handleAcceptQuote = async (q: any) => {
    const ok = await confirm({
      title: 'Aceptar cotización',
      message: `Aceptarás ${clp(q.totalCost)} de ${q.provider?.user?.name || 'este prestador'}. Las demás cotizaciones de esta solicitud se descartarán.`,
      confirmText: 'Aceptar',
      confirmVariant: 'primary',
      icon: 'info',
    });
    if (!ok) return;
    try {
      await api.post(`/quotes/${q.id}/accept`);
      addToast('Cotización aceptada. El prestador fue notificado.', 'success');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo aceptar la cotización.'), 'error');
    }
  };

  const handleRejectQuote = async (q: any) => {
    const ok = await confirm({
      title: 'Rechazar cotización',
      message: 'El prestador verá que la rechazaste. Podrás seguir esperando otras cotizaciones.',
      confirmText: 'Rechazar',
      confirmVariant: 'danger',
      icon: 'warning',
    });
    if (!ok) return;
    try {
      await api.post(`/quotes/${q.id}/reject`);
      addToast('Cotización rechazada.', 'success');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo rechazar la cotización.'), 'error');
    }
  };

  const handleCancelJob = async (req: any) => {
    const ok = await confirm({
      title: 'Cancelar solicitud',
      message: `¿Cancelar la solicitud de ${req.service?.name || 'servicio'}? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, cancelar',
      confirmVariant: 'danger',
      icon: 'warning',
    });
    if (!ok) return;
    setBusyJob(req.job.id);
    try {
      await api.post(`/jobs/${req.job.id}/cancel`);
      addToast('Solicitud cancelada.', 'success');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo cancelar la solicitud.'), 'error');
    } finally {
      setBusyJob(null);
    }
  };

  const handleRate = async (req: any) => {
    setBusyJob(req.job.id);
    try {
      await api.post(`/jobs/${req.job.id}/rate`, { rating, review: review.trim() || undefined });
      addToast('¡Gracias por calificar!', 'success');
      setRatingFor(null);
      setRating(5);
      setReview('');
      fetchData();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo enviar la calificación.'), 'error');
    } finally {
      setBusyJob(null);
    }
  };

  const handleDeactivateAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/users/me/deactivate');
      addToast('Tu cuenta fue dada de baja.', 'success');
      await logout();
      onClose();
    } catch (err) {
      addToast(errMsg(err, 'No se pudo procesar la baja de la cuenta.'), 'error');
      setDeleting(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-label="Cargando" />
      </div>
    );
  }

  const serviceRequests: any[] = userData.serviceRequests || [];
  const vehicles: any[] = userData.vehicles || [];
  const pendingQuotes = quotes.filter((q: any) => q.status === 'SENT' && (!q.validUntil || new Date(q.validUntil).getTime() > Date.now()));

  const TABS = [
    { id: 'overview', label: 'Inicio' },
    { id: 'history', label: 'Solicitudes' },
    { id: 'settings', label: 'Mi cuenta' },
  ] as const;

  const statusOf = (req: any) => {
    const key = req.job?.status || req.status;
    return JOB_STATUS[key] || { label: key, cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn pb-8">
      {/* Cabecera */}
      <div className="flex items-center gap-3 py-4">
        <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-black shrink-0" aria-hidden="true">
          {userData.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate">{userData.name}</p>
          <p className="text-sm text-slate-600 truncate">{userData.email}</p>
        </div>
        <Link to="/solicitar" className="btn-cta !min-h-[40px] !py-2 shrink-0">
          <Plus className="w-4 h-4" aria-hidden="true" /> <span className="hidden sm:inline">Nueva solicitud</span><span className="sm:hidden">Nueva</span>
        </Link>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 rounded-control min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Cerrar">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px min-h-[44px] ${
              tab === t.id ? 'text-primary border-primary' : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ───────── INICIO ───────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <StatPill label="Solicitudes" value={serviceRequests.length} />
            <StatPill label="Vehículos" value={vehicles.length} />
            <StatPill label="Cotizaciones por responder" value={pendingQuotes.length} highlight={pendingQuotes.length > 0} />
          </div>

          {pendingQuotes.length > 0 && (
            <section aria-labelledby="pq-title">
              <h2 id="pq-title" className="text-sm font-bold text-slate-900 mb-2">Cotizaciones por responder</h2>
              <ul className="space-y-3">
                {pendingQuotes.map((q: any) => (
                  <li key={q.id} className="bg-white border border-slate-200 rounded-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{q.provider?.businessName || q.provider?.user?.name || 'Prestador'}</p>
                        <p className="text-sm text-slate-600 truncate">
                          {q.job?.request?.service?.name} · {q.job?.request?.vehicle?.make} {q.job?.request?.vehicle?.model}
                        </p>
                        {q.preliminaryDiagnosis && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{q.preliminaryDiagnosis}</p>}
                        <p className="text-xs text-slate-500 mt-1">
                          {q.warranty && q.warranty !== 'Sin garantía' ? `Garantía: ${q.warranty} · ` : ''}
                          {q.validUntil ? `Válida hasta ${new Date(q.validUntil).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}` : ''}
                        </p>
                      </div>
                      <p className="font-black text-primary text-lg shrink-0">{clp(q.totalCost)}</p>
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <button onClick={() => handleRejectQuote(q)} className="btn-ghost !min-h-[40px] !py-2">Rechazar</button>
                      <button onClick={() => handleAcceptQuote(q)} className="btn-primary !min-h-[40px] !py-2">Aceptar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Vehículos */}
          <section aria-labelledby="veh-title">
            <div className="flex items-center justify-between mb-2">
              <h2 id="veh-title" className="text-sm font-bold text-slate-900">Mis vehículos</h2>
              {!showVehicleForm && (
                <button onClick={() => setShowVehicleForm(true)} className="text-sm font-bold text-primary hover:underline min-h-[44px] inline-flex items-center gap-1">
                  <Plus className="w-4 h-4" aria-hidden="true" /> Agregar
                </button>
              )}
            </div>

            {showVehicleForm && (
              <form onSubmit={handleAddVehicle} className="bg-white border border-slate-200 rounded-card p-4 mb-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="v-make" className="block text-sm font-semibold text-slate-700 mb-1">Marca</label>
                    <input id="v-make" required maxLength={60} value={vehicleForm.make} onChange={(e) => setVehicleForm((f) => ({ ...f, make: e.target.value }))} className="input-market" placeholder="Toyota" />
                  </div>
                  <div>
                    <label htmlFor="v-model" className="block text-sm font-semibold text-slate-700 mb-1">Modelo</label>
                    <input id="v-model" required maxLength={60} value={vehicleForm.model} onChange={(e) => setVehicleForm((f) => ({ ...f, model: e.target.value }))} className="input-market" placeholder="Hilux" />
                  </div>
                  <div>
                    <label htmlFor="v-year" className="block text-sm font-semibold text-slate-700 mb-1">Año</label>
                    <input id="v-year" required type="number" min={1950} max={new Date().getFullYear() + 1} value={vehicleForm.year} onChange={(e) => setVehicleForm((f) => ({ ...f, year: e.target.value }))} className="input-market" placeholder="2018" />
                  </div>
                  <div>
                    <label htmlFor="v-plate" className="block text-sm font-semibold text-slate-700 mb-1">Patente (opcional)</label>
                    <input id="v-plate" maxLength={10} value={vehicleForm.licensePlate} onChange={(e) => setVehicleForm((f) => ({ ...f, licensePlate: e.target.value }))} className="input-market uppercase" placeholder="AB-CD-12" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowVehicleForm(false)} className="btn-ghost !min-h-[40px] !py-2">Cancelar</button>
                  <button type="submit" disabled={vehicleSaving} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50">{vehicleSaving ? 'Guardando…' : 'Guardar vehículo'}</button>
                </div>
              </form>
            )}

            {vehicles.length === 0 && !showVehicleForm ? (
              <p className="text-sm text-slate-600 bg-white border border-dashed border-slate-300 rounded-card p-4">
                Aún no tienes vehículos. Agrégalo para pedir cotizaciones más rápido.
              </p>
            ) : (
              <ul className="space-y-2">
                {vehicles.map((v: any) => (
                  <li key={v.id} className="bg-white border border-slate-200 rounded-card px-4 py-3 flex items-center gap-3">
                    <Car className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{v.make} {v.model} {v.year ? `(${v.year})` : ''}</p>
                      {v.licensePlate && <p className="text-xs text-slate-500">{v.licensePlate}</p>}
                    </div>
                    <button onClick={() => handleDeleteVehicle(v)} aria-label={`Eliminar ${v.make} ${v.model}`} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-control min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Últimas solicitudes */}
          {serviceRequests.length > 0 ? (
            <section aria-labelledby="last-title">
              <div className="flex items-center justify-between mb-2">
                <h2 id="last-title" className="text-sm font-bold text-slate-900">Últimas solicitudes</h2>
                <button onClick={() => setTab('history')} className="text-sm font-bold text-primary hover:underline min-h-[44px]">Ver todas</button>
              </div>
              <ul className="space-y-2">
                {serviceRequests.slice(0, 3).map((req: any) => {
                  const s = statusOf(req);
                  return (
                    <li key={req.id} className="bg-white border border-slate-200 rounded-card px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{req.service?.name || 'Servicio'}</p>
                        <p className="text-xs text-slate-500 truncate">{req.vehicle?.make} {req.vehicle?.model} · {new Date(req.createdAt).toLocaleDateString('es-CL')}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <div className="text-center py-10 bg-white border border-dashed border-slate-300 rounded-card">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-400" aria-hidden="true" />
              <p className="font-semibold text-slate-900 mb-1">Aún no tienes solicitudes</p>
              <p className="text-sm text-slate-600 mb-4">Pide cotizaciones o busca un prestador en tu comuna.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center px-4">
                <Link to="/solicitar" className="btn-cta"><FileText className="w-4 h-4" aria-hidden="true" /> Pedir cotizaciones</Link>
                <Link to="/search" className="btn-ghost"><Search className="w-4 h-4" aria-hidden="true" /> Buscar prestadores</Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────── SOLICITUDES ───────── */}
      {tab === 'history' && (
        <div>
          {serviceRequests.length === 0 ? (
            <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-card">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-400" aria-hidden="true" />
              <p className="text-sm text-slate-600 mb-4">No tienes solicitudes registradas.</p>
              <Link to="/solicitar" className="btn-cta">Pedir cotizaciones</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {serviceRequests.map((req: any) => {
                const s = statusOf(req);
                const job = req.job;
                const cost = job?.estimatedCost;
                const canCancel = job && CANCELLABLE.includes(job.status);
                const canRate = job && RATEABLE.includes(job.status);
                const quotesCount = job?.quotes?.filter((q: any) => q.status === 'SENT').length || 0;
                return (
                  <li key={req.id} className="bg-white border border-slate-200 rounded-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{req.service?.name || 'Servicio'}</p>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {req.vehicle?.make} {req.vehicle?.model}
                          {(job?.provider?.businessName || job?.provider?.user?.name) && job.status !== 'SEARCHING' && job.status !== 'QUOTING'
                            ? ` · ${job.provider.businessName || job.provider.user.name}` : ''}
                        </p>
                        <p className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {cost != null && <p className="font-bold text-primary text-sm">{clp(cost)}</p>}
                        <span className={`inline-block mt-1 text-xs font-bold px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                      </div>
                    </div>

                    {quotesCount > 0 && job && ['SEARCHING', 'QUOTING', 'COMPARING_QUOTES'].includes(job.status) && (
                      <button onClick={() => setTab('overview')} className="mt-3 text-sm font-bold text-primary hover:underline min-h-[44px]">
                        {quotesCount} cotización{quotesCount === 1 ? '' : 'es'} por responder
                      </button>
                    )}

                    {(canCancel || canRate) && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                        {canCancel && (
                          <button disabled={busyJob === job.id} onClick={() => handleCancelJob(req)} className="btn-ghost !min-h-[40px] !py-2 !text-red-700 hover:!border-red-300 disabled:opacity-50">
                            Cancelar solicitud
                          </button>
                        )}
                        {canRate && ratingFor !== job.id && (
                          <button onClick={() => { setRatingFor(job.id); setRating(5); setReview(''); }} className="btn-cta !min-h-[40px] !py-2">
                            <Star className="w-4 h-4" aria-hidden="true" /> Calificar servicio
                          </button>
                        )}
                      </div>
                    )}

                    {canRate && ratingFor === job.id && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                        <fieldset>
                          <legend className="text-sm font-semibold text-slate-700 mb-1">¿Cómo fue el servicio?</legend>
                          <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                role="radio"
                                aria-checked={rating === n}
                                aria-label={`${n} estrella${n === 1 ? '' : 's'}`}
                                onClick={() => setRating(n)}
                                className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              >
                                <Star className={`w-7 h-7 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden="true" />
                              </button>
                            ))}
                          </div>
                        </fieldset>
                        <div>
                          <label htmlFor={`rv-${job.id}`} className="block text-sm font-semibold text-slate-700 mb-1">Comentario (opcional)</label>
                          <textarea id={`rv-${job.id}`} rows={3} maxLength={1000} value={review} onChange={(e) => setReview(e.target.value)} className="input-market" placeholder="Cuéntanos cómo te atendieron" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setRatingFor(null)} className="btn-ghost !min-h-[40px] !py-2">Cancelar</button>
                          <button disabled={busyJob === job.id} onClick={() => handleRate(req)} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50">
                            {busyJob === job.id ? 'Enviando…' : 'Enviar calificación'}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* ───────── MI CUENTA ───────── */}
      {tab === 'settings' && (
        <div className="space-y-5">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Datos personales</h2>
            <div>
              <label htmlFor="acc-name" className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
              <input id="acc-name" type="text" required minLength={2} maxLength={100} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-market" />
            </div>
            <div>
              <label htmlFor="acc-phone" className="block text-sm font-semibold text-slate-700 mb-1">Teléfono (opcional)</label>
              <input id="acc-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-market" placeholder="+56 9 1234 5678" />
            </div>
            <div>
              <label htmlFor="acc-email" className="block text-sm font-semibold text-slate-700 mb-1">Correo</label>
              <input id="acc-email" type="email" value={userData.email || ''} readOnly className="input-market bg-slate-50 text-slate-600" />
              <p className="text-xs text-slate-500 mt-1">Para cambiar tu correo escribe a contacto@redmecanica.cl.</p>
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Guardando…' : 'Guardar cambios'}</button>
          </form>

          <section className="bg-white border border-slate-200 rounded-card p-5" aria-labelledby="inv-title">
            <h2 id="inv-title" className="text-sm font-bold text-slate-900 mb-3">Pagos y comprobantes</h2>
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-600">Aún no tienes pagos registrados. Aparecerán aquí cuando pagues un servicio.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {invoices.map((inv: any) => (
                  <li key={inv.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-slate-900 truncate">{inv.invoiceNumber}</p>
                      <p className="text-xs text-slate-500">
                        {inv.type === 'REFUND' ? 'Reembolso' : 'Servicio técnico'} · {new Date(inv.paidAt || inv.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-slate-900">{clp(inv.total)}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'PENDING' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                        {inv.status === 'PAID' ? 'Pagada' : inv.status === 'PENDING' ? 'Pendiente' : inv.status === 'REFUNDED' ? 'Reembolsada' : 'Anulada'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={handleChangePassword} className="bg-white border border-slate-200 rounded-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Cambiar contraseña</h2>
            <div>
              <label htmlFor="pw-current" className="block text-sm font-semibold text-slate-700 mb-1">Contraseña actual</label>
              <input id="pw-current" type="password" autoComplete="current-password" required value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} className="input-market" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="pw-new" className="block text-sm font-semibold text-slate-700 mb-1">Nueva contraseña</label>
                <input id="pw-new" type="password" autoComplete="new-password" required minLength={8} value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} className="input-market" />
              </div>
              <div>
                <label htmlFor="pw-repeat" className="block text-sm font-semibold text-slate-700 mb-1">Repetir nueva</label>
                <input id="pw-repeat" type="password" autoComplete="new-password" required minLength={8} value={pwd.repeat} onChange={(e) => setPwd((p) => ({ ...p, repeat: e.target.value }))} className="input-market" />
              </div>
            </div>
            <p className="text-xs text-slate-500">Mínimo 8 caracteres, con letras y números.</p>
            <button type="submit" disabled={pwdSaving} className="btn-primary disabled:opacity-50">{pwdSaving ? 'Actualizando…' : 'Actualizar contraseña'}</button>
          </form>

          <div className="bg-white border border-slate-200 rounded-card p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Cuenta</h2>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Miembro desde</span>
              <span className="font-semibold text-slate-900">{new Date(userData.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tipo de cuenta</span>
              <span className="font-semibold text-slate-900">{userData.role === 'USER' ? 'Usuario' : userData.role === 'MECHANIC' ? 'Prestador' : userData.role}</span>
            </div>
            <button onClick={logout} className="btn-ghost w-full mt-2">Cerrar sesión</button>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-card p-5 space-y-3">
            <h2 className="text-sm font-bold text-red-700">Zona de peligro</h2>
            <p className="text-sm text-slate-700">Al dar de baja tu cuenta se suspenden todos tus accesos. No se puede deshacer, y no puedes hacerlo con servicios en curso o pagos en custodia.</p>
            {!showDeleteConfirm ? (
              <button type="button" onClick={() => setShowDeleteConfirm(true)} className="text-sm font-bold text-red-700 hover:text-red-800 underline min-h-[44px]">
                Quiero dar de baja mi cuenta
              </button>
            ) : (
              <div className="space-y-3 pt-3 border-t border-red-100">
                <p className="text-sm font-bold text-red-700">¿Estás seguro? Confirma para continuar.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" disabled={deleting} onClick={handleDeactivateAccount} className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                    {deleting ? 'Procesando…' : 'Sí, dar de baja definitivamente'}
                  </button>
                  <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn-ghost">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatPill = ({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`rounded-card border px-3 py-3 text-center ${highlight ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`}>
    <p className={`text-2xl font-black ${highlight ? 'text-primary' : 'text-slate-900'}`}>{value}</p>
    <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-tight">{label}</p>
  </div>
);

export default AccountHub;
