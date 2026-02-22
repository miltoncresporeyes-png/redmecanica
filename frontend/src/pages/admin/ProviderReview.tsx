
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  UserCheck, 
  Search, 
  ExternalLink, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  X,
  Filter,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Provider {
  id: string;
  type: string;
  status: string;
  rut: string;
  commune?: string;
  region?: string;
  rating: number;
  trustScore: number;
  completedJobs: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  subscription?: {
    plan: string;
    status: string;
    endDate: string;
  };
  _count?: {
    jobs: number;
  };
  createdAt: string;
  submittedAt?: string;
}

const ProviderReview: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', '15');
      
      if (filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/admin/providers?${params.toString()}`);
      setProviders(response.data.providers);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [pagination.page, filters.status, filters.type]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend' | 'reactivate', reason?: string) => {
    setIsProcessing(true);
    try {
      const endpoint = action === 'reactivate' 
        ? `/admin/providers/${id}/reactivate`
        : `/admin/providers/${id}/${action === 'approve' ? 'approve' : 'suspend'}`;
      
      await api.post(endpoint, { reason });
      setSelectedProvider(null);
      fetchProviders();
    } catch (error) {
      alert("Error al procesar la solicitud");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      UNDER_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
      SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
      APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    
    const labels: Record<string, string> = {
      ACTIVE: 'Activo',
      PENDING: 'Pendiente',
      UNDER_REVIEW: 'En Revisión',
      SUSPENDED: 'Suspendido',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
    };

    return (
      <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MECHANIC: 'Mecánico',
      WORKSHOP: 'Taller',
      TOWING: 'Grúa',
      INSURANCE: 'Seguro'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Prestadores</h1>
          <p className="text-gray-500 mt-1">Administra y verifica todos los prestadores de servicio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchProviders}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
             {pagination.total} Prestadores
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filtros:</span>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="PENDING">Pendientes</option>
            <option value="UNDER_REVIEW">En Revisión</option>
            <option value="SUSPENDED">Suspendidos</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="MECHANIC">Mecánico</option>
            <option value="WORKSHOP">Taller</option>
            <option value="TOWING">Grúa</option>
            <option value="INSURANCE">Seguro</option>
          </select>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, RUT o comuna..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {providers.length === 0 && !loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
               <UserCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No se encontraron Prestadores</h3>
            <p className="text-gray-400 mt-2 font-medium">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Proveedor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rendimiento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Suscripción</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {providers.map((p, index) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50/50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                          {p.user.name?.charAt(0) || '?'}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-gray-900 leading-none">{p.user.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{p.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-md tracking-widest border border-gray-200">
                        {getTypeLabel(p.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.commune || 'N/A'}, {p.region || ''}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">{p.completedJobs || p._count?.jobs || 0}</span>
                          <span className="text-gray-400 text-xs ml-1">jobs</span>
                        </div>
                        {p.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="text-sm font-bold text-gray-900">{p.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.subscription ? (
                        <div className="text-sm">
                          <span className={`font-bold ${p.subscription.plan === 'PROFESSIONAL' ? 'text-purple-600' : p.subscription.plan === 'YEARLY' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {p.subscription.plan === 'PROFESSIONAL' ? 'Pro' : p.subscription.plan === 'YEARLY' ? 'Anual' : 'Mensual'}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">• {p.subscription.status}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Sin plan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedProvider(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        {p.status === 'ACTIVE' && (
                          <button 
                            onClick={() => handleAction(p.id, 'suspend')}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Suspender"
                          >
                            <PauseCircle size={16} />
                          </button>
                        )}
                        {p.status === 'SUSPENDED' && (
                          <button 
                            onClick={() => handleAction(p.id, 'reactivate')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Reactivar"
                          >
                            <PlayCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {selectedProvider && (
          <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                      {selectedProvider.user.name?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900">{selectedProvider.user.name}</h2>
                      <p className="text-gray-500 text-sm">{selectedProvider.user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProvider(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RUT</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedProvider.rut || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedProvider.user.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedProvider.commune || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jobs Completados</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedProvider.completedJobs || 0}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {selectedProvider.status === 'PENDING' && (
                    <>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleAction(selectedProvider.id, 'reject', 'No cumple requisitos')}
                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        Rechazar
                      </button>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleAction(selectedProvider.id, 'approve')}
                        className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                      >
                        <CheckCircle2 size={16} />
                        {isProcessing ? 'Procesando...' : 'Aprobar'}
                      </button>
                    </>
                  )}
                  {selectedProvider.status === 'ACTIVE' && (
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleAction(selectedProvider.id, 'suspend', 'Suspendido por administrador')}
                      className="flex-1 py-3 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                    >
                      <PauseCircle size={16} />
                      Suspender Proveedor
                    </button>
                  )}
                  {selectedProvider.status === 'SUSPENDED' && (
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleAction(selectedProvider.id, 'reactivate')}
                      className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                    >
                      <PlayCircle size={16} />
                      Reactivar Proveedor
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderReview;
