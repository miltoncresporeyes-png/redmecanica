
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { formatPrice } from '../../utils/format';
import { downloadCsv } from '../../lib/csv';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  provider: {
    user: {
      name: string;
      email: string;
    };
  };
}

const SubscriptionsAdmin: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { addToast } = useToast();
  const confirm = useConfirm();
  const [filters, setFilters] = useState({ status: 'ALL', plan: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', '15');
      if (filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.plan) params.append('plan', filters.plan);

      const response = await api.get(`/admin/subscriptions?${params.toString()}`);
      setSubscriptions(response.data.subscriptions);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [pagination.page, filters.status, filters.plan]);

  // Acciones del administrador sobre una suscripcion. El backend valida que sea administrador y deja historial.
  const runAction = async (sub: Subscription, kind: 'activate' | 'renew' | 'cancel') => {
    const copy = {
      activate: { title: 'Activar suscripción', msg: `Se activará el plan de ${sub.provider.user.name} sin cobro. Queda registrado en su historial.`, ok: 'Activar', done: 'Suscripción activada.' },
      renew: { title: 'Renovar suscripción', msg: `Se extenderá la vigencia del plan de ${sub.provider.user.name} un período más sin cobro.`, ok: 'Renovar', done: 'Suscripción renovada.' },
      cancel: { title: 'Cancelar renovación', msg: `El plan de ${sub.provider.user.name} seguirá vigente hasta su fecha de término y no se renovará.`, ok: 'Cancelar renovación', done: 'Renovación automática cancelada.' },
    }[kind];
    const accepted = await confirm({ title: copy.title, message: copy.msg, confirmText: copy.ok, confirmVariant: kind === 'cancel' ? 'danger' : 'primary', icon: kind === 'cancel' ? 'warning' : 'info' });
    if (!accepted) return;
    setBusyId(sub.id);
    try {
      await api.post(`/subscriptions/${sub.id}/${kind}`);
      addToast(copy.done, 'success');
      fetchSubscriptions();
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'No se pudo completar la acción.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () =>
    downloadCsv(`suscripciones-${new Date().toISOString().slice(0, 10)}`, subscriptions, [
      { header: 'Prestador', value: (s) => s.provider.user.name },
      { header: 'Correo', value: (s) => s.provider.user.email },
      { header: 'Plan', value: (s) => s.plan },
      { header: 'Estado', value: (s) => s.status },
      { header: 'Monto (CLP)', value: (s) => s.amount },
      { header: 'Inicio', value: (s) => new Date(s.startDate).toLocaleDateString('es-CL') },
      { header: 'Término', value: (s) => new Date(s.endDate).toLocaleDateString('es-CL') },
      { header: 'Renovación automática', value: (s) => (s.autoRenew ? 'Sí' : 'No') },
    ]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      EXPIRED: 'bg-red-50 text-red-700 border-red-200',
      CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    
    const labels: Record<string, string> = {
      ACTIVE: 'Activa',
      EXPIRED: 'Expirada',
      CANCELLED: 'Cancelada',
      PENDING: 'Pendiente',
    };

    return (
      <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      PROFESSIONAL: 'bg-purple-50 text-purple-700 border-purple-200',
      YEARLY: 'bg-blue-50 text-blue-700 border-blue-200',
      MONTHLY: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return (
      <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[plan] || styles.MONTHLY}`}>
        {plan}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'ACTIVE').length,
    revenue: subscriptions
      .filter(s => s.status === 'ACTIVE')
      .reduce((acc, s) => acc + s.amount, 0),
    monthlyRecurring: subscriptions
      .filter(s => s.status === 'ACTIVE' && s.plan === 'MONTHLY')
      .reduce((acc, s) => acc + s.amount, 0)
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Suscripciones</h1>
          <p className="text-gray-500 mt-1">Controla y gestiona los planes de los Prestadores.</p>
        </div>
        <div className="flex gap-2">
        <button onClick={exportCsv} disabled={subscriptions.length === 0} className="btn-ghost !min-h-[44px] disabled:opacity-40">
          <Download size={16} aria-hidden="true" /> Exportar
        </button>
        <button
          onClick={fetchSubscriptions}
          className="p-3 bg-white border border-gray-200 rounded-control text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-card border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-control flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <span className="text-sm text-gray-500">Total Suscripciones</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{pagination.total}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-card border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-control flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm text-gray-500">Activas</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{stats.active}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-card border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-control flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-gray-500">Ingresos Mensuales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{formatPrice(stats.monthlyRecurring)}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-card border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-control flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <span className="text-sm text-gray-500">Ingresos Totales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{formatPrice(stats.revenue)}</p>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-card border border-gray-100 shadow-sm flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-control text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activas</option>
          <option value="EXPIRED">Expiradas</option>
          <option value="CANCELLED">Canceladas</option>
        </select>

        <select
          value={filters.plan}
          onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-control text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los planes</option>
          <option value="MONTHLY">Mensual</option>
          <option value="YEARLY">Anual</option>
          <option value="PROFESSIONAL">Profesional</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Proveedor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Renovación</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-Renew</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscriptions.map((sub, index) => (
                <motion.tr 
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{sub.provider.user.name}</p>
                      <p className="text-xs text-gray-400">{sub.provider.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getPlanBadge(sub.plan)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatPrice(sub.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(sub.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.autoRenew ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-gray-300" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      {(sub.status === 'PENDING' || sub.status === 'EXPIRED' || sub.status === 'CANCELLED') && (
                        <button disabled={busyId === sub.id} onClick={() => runAction(sub, 'activate')} className="px-3 py-1.5 text-xs font-bold rounded-control bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Activar</button>
                      )}
                      {(sub.status === 'ACTIVE' || sub.status === 'EXPIRED') && (
                        <button disabled={busyId === sub.id} onClick={() => runAction(sub, 'renew')} className="px-3 py-1.5 text-xs font-bold rounded-control bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50">Renovar</button>
                      )}
                      {sub.status === 'ACTIVE' && sub.autoRenew && (
                        <button disabled={busyId === sub.id} onClick={() => runAction(sub, 'cancel')} className="px-3 py-1.5 text-xs font-bold rounded-control bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">Cancelar renovación</button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {subscriptions.length === 0 && !loading && (
          <p className="p-10 text-center text-sm text-gray-500">No hay suscripciones con estos filtros.</p>
        )}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            <span>Página {pagination.page} de {pagination.totalPages} · {pagination.total} suscripciones</span>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} aria-label="Página anterior" className="btn-ghost !min-h-[36px] !px-3 disabled:opacity-40"><ChevronLeft size={16} aria-hidden="true" /></button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} aria-label="Página siguiente" className="btn-ghost !min-h-[36px] !px-3 disabled:opacity-40"><ChevronRight size={16} aria-hidden="true" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsAdmin;
