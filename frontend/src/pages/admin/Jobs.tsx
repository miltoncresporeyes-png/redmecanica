
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredJobs = jobs.filter(job => 
    job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.request?.vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
             {jobs.length} Servicios
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full font-medium">
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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center">
            <Filter size={16} />
            Filtrar
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
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
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
                          {job.request?.vehicle?.plate || 'S/P'}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium ml-5">{job.request?.vehicle?.brand} {job.request?.vehicle?.model}</p>
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
                       <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
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
                  <button onClick={() => setSelectedJob(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
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
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Comuna: {selectedJob.request?.commune || 'S/E'}</span>
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
                                <div className="mt-3 p-3 bg-gray-50 rounded-xl font-mono text-[9px] text-gray-400 overflow-x-auto">
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

              <div className="p-10 bg-gray-900 text-white rounded-t-[40px]">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resumen Financiero</p>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                       Validado
                    </div>
                 </div>
                 <div className="flex items-end justify-between">
                    <div>
                       <p className="text-3xl font-black text-white tracking-widest">$ {selectedJob.totalAmount || '0'}</p>
                       <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                         <Layers size={14} /> Total Consolidado (IVA Incl)
                       </p>
                    </div>
                    <button className="px-6 py-3 bg-white text-black rounded-2xl font-black text-xs hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-white/5">
                       Imprimir Reporte
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge: React.FC<{status: string}> = ({ status }) => {
  const styles: Record<string, string> = {
    'SEARCHING': 'bg-amber-50 text-amber-700 border-amber-100',
    'ASSIGNED': 'bg-blue-50 text-blue-700 border-blue-100',
    'IN_PROGRESS': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'ARRIVED': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'DIAGNOSED': 'bg-purple-50 text-purple-700 border-purple-100',
    'FINISHED': 'bg-teal-50 text-teal-700 border-teal-100',
    'CANCELLED': 'bg-red-50 text-red-700 border-red-100',
    'CLOSED': 'bg-gray-50 text-gray-700 border-gray-100'
  };

  const icons: Record<string, any> = {
    'FINISHED': CheckCircle2,
    'CANCELLED': XCircle,
    'DIAGNOSED': Activity,
    'SEARCHING': Clock
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border shadow-xs transition-transform hover:scale-105 cursor-default",
      styles[status] || 'bg-gray-50 text-gray-500 border-gray-200'
    )}>
      <Icon size={12} />
      {status}
    </span>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { Activity } from 'lucide-react';

export default Jobs;
