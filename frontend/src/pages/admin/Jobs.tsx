
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { downloadCsv } from '../../lib/csv';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { 
  Wrench, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Car, 
  User, 
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  Download,
  Printer,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [acting, setActing] = useState(false);
  const { addToast } = useToast();
  const confirm = useConfirm();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/jobs');
      setJobs(response.data?.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobTimeline = async (jobId: string) => {
    try {
      const response = await api.get(`/admin/jobs/${jobId}/timeline`);
      setSelectedJob(response.data);
    } catch (error) {
      console.error("Error fetching timeline", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter && job.status !== statusFilter) return false;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      job.id.toLowerCase().includes(q) ||
      (STATUS_LABEL[job.status] || job.status).toLowerCase().includes(q) ||
      (job.request?.vehicle?.licensePlate || '').toLowerCase().includes(q) ||
      (job.request?.vehicle?.make || '').toLowerCase().includes(q) ||
      (job.request?.service?.name || '').toLowerCase().includes(q) ||
      (job.provider?.user?.name || '').toLowerCase().includes(q)
    );
  });

  const exportCsv = () =>
    downloadCsv(`servicios-${new Date().toISOString().slice(0, 10)}`, filteredJobs, [
      { header: 'ID', value: (j) => j.id },
      { header: 'Servicio', value: (j) => j.request?.service?.name },
      { header: 'Estado', value: (j) => STATUS_LABEL[j.status] || j.status },
      { header: 'Cliente', value: (j) => j.request?.user?.name },
      { header: 'Prestador', value: (j) => j.provider?.user?.name },
      { header: 'Vehículo', value: (j) => [j.request?.vehicle?.make, j.request?.vehicle?.model].filter(Boolean).join(' ') },
      { header: 'Patente', value: (j) => j.request?.vehicle?.licensePlate },
      { header: 'Monto estimado (CLP)', value: (j) => j.estimatedCost },
      { header: 'Pago', value: (j) => PAYMENT_LABEL[j.paymentStatus] || j.paymentStatus },
      { header: 'Creado', value: (j) => new Date(j.createdAt).toLocaleString('es-CL') },
    ]);

  // Intervencion del administrador sobre un servicio
  const adminAct = async (kind: 'cancel' | 'dispute') => {
    if (!selectedJob) return;
    const ok = await confirm({
      title: kind === 'cancel' ? 'Cancelar servicio' : 'Marcar en disputa',
      message: kind === 'cancel'
        ? 'El servicio quedará cancelado para el cliente y el prestador. Esta acción queda registrada en la auditoría.'
        : 'El servicio quedará marcado en disputa para su revisión. Esta acción queda registrada en la auditoría.',
      confirmText: kind === 'cancel' ? 'Cancelar servicio' : 'Marcar en disputa',
      confirmVariant: 'danger',
      icon: 'warning',
    });
    if (!ok) return;
    setActing(true);
    try {
      if (kind === 'cancel') await api.post(`/jobs/${selectedJob.id}/cancel`);
      else await api.patch(`/jobs/${selectedJob.id}/status`, { status: 'DISPUTED', metadata: { by: 'admin' } });
      addToast(kind === 'cancel' ? 'Servicio cancelado.' : 'Servicio marcado en disputa.', 'success');
      await fetchJobs();
      await fetchJobTimeline(selectedJob.id);
    } catch (e: any) {
      addToast(e?.response?.data?.error || e?.response?.data?.message || 'No se pudo completar la acción.', 'error');
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión Operativa</h1>
          <p className="text-gray-500 mt-1">Monitoreo de servicios activos, diagnósticos y finalizaciones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchJobs}
            className="p-3 bg-white border border-gray-200 rounded-control text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-control text-xs font-black uppercase tracking-widest border border-blue-100">
             {jobs.length} Servicios
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-control border border-gray-100 w-full font-medium">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, Patente o Estado..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label htmlFor="job-status" className="sr-only">Filtrar por estado</label>
          <select id="job-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-market !w-auto">
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABEL).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
          <button onClick={exportCsv} disabled={filteredJobs.length === 0} className="btn-ghost !min-h-[44px] disabled:opacity-40">
            <Download size={16} aria-hidden="true" /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Servicio</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehículo</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asignación</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Flujo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job, index) => (
                  <motion.tr 
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                    onClick={() => fetchJobTimeline(job.id)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-control bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                          <Wrench size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{job.request?.service?.name || 'Servicio General'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">ID: #{job.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <Car size={14} className="text-gray-400" />
                          {job.request?.vehicle?.licensePlate || 'S/P'}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium ml-5">{job.request?.vehicle?.make} {job.request?.vehicle?.model}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <StatusBadge status={job.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {job.provider?.user?.name?.charAt(0) || 'T'}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{job.provider?.user?.name || 'Técnico Asignado'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button type="button" aria-label="Ver detalle del servicio" onClick={(e) => { e.stopPropagation(); fetchJobTimeline(job.id); }} className="p-2 text-blue-600 bg-blue-50 rounded-control hover:bg-blue-600 hover:text-white transition-all">
                         <ChevronRight size={18} />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Job Timeline / Details */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-lg flex items-center justify-end p-4 z-50">
            <motion.div 
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 500, opacity: 0 }}
              className="bg-white w-full max-w-xl h-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-6 flex items-center justify-between border-b border-gray-50">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Auditoría Técnica</span>
                    <h2 className="text-2xl font-black text-gray-900 mt-1">Historial del Job</h2>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-card transition-all">
                    <X size={24} className="text-gray-400" />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Cliente</p>
                      <p className="text-sm font-bold text-gray-800">{selectedJob.request?.user?.name || 'Usuario'}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Estado Actual</p>
                      <div className="flex justify-end">
                        <StatusBadge status={selectedJob.status} />
                      </div>
                   </div>
                   <div className="col-span-2 flex items-center gap-3 pt-3 border-t border-blue-100/50">
                      <MapPin size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Comuna del prestador: {selectedJob.provider?.commune || 'sin dato'}</span>
                   </div>
                </div>

                {/* Timeline Events */}
                <div className="space-y-8 relative">
                   <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 to-gray-100"></div>
                   
                   {selectedJob.events?.length > 0 ? (
                      selectedJob.events.map((event: any, i: number) => (
                        <div key={event.id} className="relative pl-12">
                           <div className={cn(
                             "absolute left-2.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-10 scale-125",
                             i === 0 ? "bg-blue-600 animate-pulse" : "bg-gray-300"
                           )}></div>
                           <div className="bg-white group">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{event.status}</span>
                                <span className="text-[10px] font-bold text-gray-400">{new Date(event.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-sm font-bold text-gray-700 leading-snug">{event.description}</p>
                              {event.metadata && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-control font-mono text-[9px] text-gray-400 overflow-x-auto">
                                   {event.metadata}
                                </div>
                              )}
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="pl-12 text-gray-400 italic text-sm py-4">
                        Iniciando traza técnica...
                      </div>
                   )}
                </div>
              </div>

              <div className="p-10 bg-gray-900 text-white rounded-t-[40px] space-y-5">
                 <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Resumen financiero</p>
                    <div className="px-3 py-1 bg-white/10 text-gray-100 rounded-control text-xs font-bold">
                       Pago: {PAYMENT_LABEL[selectedJob.paymentStatus] || selectedJob.paymentStatus || '—'}
                    </div>
                 </div>
                 <div className="flex items-end justify-between gap-4">
                    <div>
                       <p className="text-3xl font-black text-white">{selectedJob.estimatedCost != null ? `$ ${Number(selectedJob.estimatedCost).toLocaleString('es-CL')}` : 'Sin monto'}</p>
                       <p className="text-xs text-gray-300 mt-2 font-semibold flex items-center gap-2">
                         <Layers size={14} aria-hidden="true" /> Monto de la cotización aceptada
                       </p>
                    </div>
                    <button onClick={() => window.print()} className="px-5 py-3 bg-white text-black rounded-card font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2">
                       <Printer size={16} aria-hidden="true" /> Imprimir
                    </button>
                 </div>
                 {!['CANCELLED', 'CLOSED', 'REFUNDED', 'DISPUTED'].includes(selectedJob.status) && (
                   <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                     <button disabled={acting} onClick={() => adminAct('dispute')} className="px-4 py-2.5 rounded-control bg-amber-400 text-gray-900 font-bold text-sm hover:bg-amber-300 disabled:opacity-50">Marcar en disputa</button>
                     <button disabled={acting} onClick={() => adminAct('cancel')} className="px-4 py-2.5 rounded-control bg-red-500 text-white font-bold text-sm hover:bg-red-400 disabled:opacity-50">Cancelar servicio</button>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  SEARCHING: 'Buscando prestador',
  QUOTING: 'Recibiendo cotizaciones',
  COMPARING_QUOTES: 'Comparando cotizaciones',
  CONFIRMED: 'Confirmado',
  PROVIDER_EN_ROUTE: 'Prestador en camino',
  PROVIDER_ARRIVED: 'Prestador llegó',
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

const PAYMENT_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  HELD: 'En custodia',
  RELEASED: 'Liberado',
  REFUNDED: 'Reembolsado',
};

const StatusBadge: React.FC<{status: string}> = ({ status }) => {
  const tone =
    ['CANCELLED', 'DISPUTED'].includes(status) ? 'bg-red-50 text-red-700 border-red-100'
    : ['DELIVERED', 'REVIEWED', 'CLOSED', 'WORK_COMPLETED'].includes(status) ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : ['PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES'].includes(status) ? 'bg-amber-50 text-amber-800 border-amber-100'
    : status === 'REFUNDED' ? 'bg-gray-50 text-gray-700 border-gray-200'
    : 'bg-blue-50 text-blue-700 border-blue-100';
  const Icon = ['CANCELLED', 'DISPUTED'].includes(status) ? XCircle
    : ['DELIVERED', 'REVIEWED', 'CLOSED', 'WORK_COMPLETED'].includes(status) ? CheckCircle2
    : ['PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES'].includes(status) ? Clock
    : Activity;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
      tone
    )}>
      <Icon size={12} aria-hidden="true" />
      {STATUS_LABEL[status] || status}
    </span>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Jobs;
