import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../lib/http';
import { useAuth } from '../../app/providers';

interface AccountHubProps {
  currentUser: any;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING:     { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-700' },
  IN_PROGRESS: { label: 'En proceso', cls: 'bg-blue-100 text-blue-700'   },
  COMPLETED:   { label: 'Completado', cls: 'bg-green-100 text-green-700'  },
  CANCELLED:   { label: 'Cancelado',  cls: 'bg-red-100 text-red-600'     },
};

const AccountHub: React.FC<AccountHubProps> = ({ currentUser, onClose }) => {
  const { logout } = useAuth();
  const [tab, setTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [quotes, setQuotes]     = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, quotesRes] = await Promise.all([
        api.get(`/users/${currentUser.id}`),
        api.get('/quotes/user/me'),
      ]);
      setUserData(userRes.data);
      setQuotes(quotesRes.data);
      setForm({ name: userRes.data.name || '', email: userRes.data.email || '' });
    } catch (err) {
      console.error('Error cargando perfil', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) fetchData();
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      await api.put(`/users/${currentUser.id}`, form);
      setSaveMsg('Cambios guardados.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/users/me/deactivate');
      alert('Tu cuenta ha sido dada de baja exitosamente.');
      await logout();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al procesar la baja de la cuenta');
      setDeleting(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm('¿Confirmas aceptar esta cotización?')) return;
    try {
      await api.post(`/quotes/${quoteId}/accept`);
      fetchData();
    } catch {
      alert('Error al aceptar la cotización.');
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const serviceRequests: any[] = userData.serviceRequests || [];
  const vehicles: any[]        = userData.vehicles || [];
  const pendingQuotes           = quotes.filter((q: any) => q.status === 'SENT');

  const TABS = [
    { id: 'overview', label: 'Inicio'       },
    { id: 'history',  label: 'Solicitudes'  },
    { id: 'settings', label: 'Mi cuenta'    },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn pb-8">

      {/* ── Header compacto ── */}
      <div className="flex items-center gap-3 py-4 mb-1">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shrink-0">
          {userData.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 truncate">{userData.name}</p>
          <p className="text-xs text-slate-400 truncate">{userData.email}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-100 mb-5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════
          TAB: INICIO
      ════════════════════════════════════════ */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Estadísticas reales */}
          <div className="grid grid-cols-3 gap-3">
            <StatPill label="Solicitudes" value={serviceRequests.length} />
            <StatPill label="Vehículos"   value={vehicles.length} />
            <StatPill label="Cotizaciones pendientes" value={pendingQuotes.length} highlight={pendingQuotes.length > 0} />
          </div>

          {/* Cotizaciones pendientes */}
          {pendingQuotes.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Cotizaciones pendientes
              </h2>
              <div className="space-y-2">
                {pendingQuotes.map((q: any) => (
                  <div key={q.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {q.provider?.user?.name || 'Prestador'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {q.job?.request?.service?.name} · {q.job?.request?.vehicle?.make} {q.job?.request?.vehicle?.model}
                      </p>
                      {q.preliminaryDiagnosis && (
                        <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">
                          "{q.preliminaryDiagnosis}"
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-blue-600 text-base">
                        ${q.totalCost?.toLocaleString('es-CL')}
                      </p>
                      <button
                        onClick={() => handleAcceptQuote(q.id)}
                        className="mt-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vehículos registrados */}
          {vehicles.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mis vehículos
              </h2>
              <div className="space-y-2">
                {vehicles.map((v: any) => (
                  <div key={v.id} className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">🚗</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">
                        {v.make} {v.model} {v.year && `(${v.year})`}
                      </p>
                      {v.licensePlate && (
                        <p className="text-xs text-slate-400">{v.licensePlate}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Últimas solicitudes */}
          {serviceRequests.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Últimas solicitudes
                </h2>
                <button
                  onClick={() => setTab('history')}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Ver todas
                </button>
              </div>
              <div className="space-y-2">
                {serviceRequests.slice(0, 3).map((req: any) => {
                  const s = STATUS_LABELS[req.status] || { label: req.status, cls: 'bg-slate-100 text-slate-500' };
                  return (
                    <div key={req.id} className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {req.service?.name || 'Servicio'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {req.vehicle?.make} {req.vehicle?.model} · {new Date(req.createdAt).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Estado vacío */}
          {serviceRequests.length === 0 && vehicles.length === 0 && pendingQuotes.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p className="text-4xl mb-3">🔧</p>
              <p className="font-semibold text-slate-600 mb-1">Aún no tienes actividad</p>
              <p className="text-sm mb-4">Busca un prestador y agenda tu primer servicio.</p>
              <Link
                to="/search"
                className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Buscar prestadores
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB: SOLICITUDES / HISTORIAL
      ════════════════════════════════════════ */}
      {tab === 'history' && (
        <div className="space-y-2">
          {serviceRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm">No tienes solicitudes registradas.</p>
            </div>
          ) : (
            serviceRequests.map((req: any) => {
              const s = STATUS_LABELS[req.status] || { label: req.status, cls: 'bg-slate-100 text-slate-500' };
              const cost = req.job?.estimatedCost;
              return (
                <div key={req.id} className="bg-white border border-slate-100 rounded-xl px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{req.service?.name || 'Servicio'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {req.vehicle?.make} {req.vehicle?.model}
                        {req.job?.provider?.user?.name && ` · ${req.job.provider.user.name}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {cost != null && (
                        <p className="font-bold text-blue-600 text-sm">${cost.toLocaleString('es-CL')}</p>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.cls}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          TAB: CONFIGURACIÓN
      ════════════════════════════════════════ */}
      {tab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-slate-700 text-sm">Datos personales</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              {saveMsg && (
                <span className={`text-xs font-medium ${saveMsg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {saveMsg}
                </span>
              )}
            </div>
          </div>

          {/* Info de cuenta */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-slate-700 text-sm">Cuenta</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Miembro desde</span>
              <span className="font-semibold text-slate-700">
                {new Date(userData.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Rol</span>
              <span className="font-semibold text-slate-700">
                {userData.role === 'USER' ? 'Usuario' : userData.role === 'MECHANIC' ? 'Mecánico' : userData.role}
              </span>
            </div>
          </div>

          {/* Cerrar sesión */}
          <button
            onClick={logout}
            className="w-full py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
          >
            Cerrar sesión
          </button>

          {/* Zona de peligro: Baja de cuenta */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 space-y-3 mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600">Zona de Peligro</h4>
            <p className="text-xs text-slate-600">
              Al dar de baja tu cuenta se suspenderán todos tus accesos y publicaciones. Esta acción no se puede deshacer.
            </p>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Quiero dar de baja mi cuenta
              </button>
            ) : (
              <div className="space-y-3 pt-2 border-t border-red-100">
                <p className="text-xs font-bold text-red-700">¿Estás totalmente seguro? Confirma para continuar:</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeactivateAccount}
                    className="bg-red-600 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {deleting ? 'Procesando baja...' : 'Sí, dar de baja definitivamente'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Pill stat compacta ── */
const StatPill = ({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) => (
  <div className={`rounded-xl border px-3 py-3 text-center ${highlight ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'}`}>
    <p className={`text-xl font-black ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</p>
    <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight">{label}</p>
  </div>
);

export default AccountHub;
