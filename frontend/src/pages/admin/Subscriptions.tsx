
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
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

  const formatPrice = (amount: number, currency: string = 'CLP') => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency }).format(amount);
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
        <button 
          onClick={fetchSubscriptions}
          className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <span className="text-sm text-gray-500">Total Suscripciones</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{pagination.total}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm text-gray-500">Activas</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{stats.active}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-gray-500">Ingresos Mensuales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{formatPrice(stats.monthlyRecurring)}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <span className="text-sm text-gray-500">Ingresos Totales</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{formatPrice(stats.revenue)}</p>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todos los estados</option>
          <option value="ACTIVE">Activas</option>
          <option value="EXPIRED">Expiradas</option>
          <option value="CANCELLED">Canceladas</option>
        </select>

        <select
          value={filters.plan}
          onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsAdmin;
