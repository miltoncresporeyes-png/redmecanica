
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Database, 
  Globe, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/audit');
      setLogs(response.data);
    } catch (error) {
      console.error("Error loading audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.userId && log.userId.includes(searchTerm))
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rastro de Auditoría</h1>
          <p className="text-gray-500 mt-1">Historial inmutable de acciones realizadas en la plataforma.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por acción, recurso o ID de usuario..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center">
            <Filter size={16} />
            Acción
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center">
            <Calendar size={16} />
            Fecha
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Suceso</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Recurso</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Identidad</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Contexto Digital</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest">Marca Temporal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, index) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-blue-50/30 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          log.action.includes('REGISTER') || log.action.includes('CREATE') ? "bg-emerald-100 text-emerald-600" :
                          log.action.includes('LOGIN') ? "bg-blue-100 text-blue-600" :
                          log.action.includes('VIEW') ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                        )}>
                          <ShieldAlert size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">{log.action}</p>
                          <p className="text-[11px] text-gray-400 mt-1 font-medium tracking-tight">ID: {log.id.split('-')[0]}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Database size={14} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">{log.resource}</span>
                        {log.resourceId && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                            #{log.resourceId.split('-')[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{log.userId || 'SISTEMA'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                          <Globe size={12} />
                          {log.ipAddress || 'Unknown IP'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 max-w-[200px] truncate">
                          <Monitor size={12} />
                          {log.userAgent || 'Unknown Agent'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium whitespace-nowrap">
                         {new Date(log.createdAt).toLocaleString('es-CL', {
                           day: '2-digit',
                           month: 'short',
                           hour: '2-digit',
                           minute: '2-digit'
                         })}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="px-8 py-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
           <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
             Mostrando {filteredLogs.length} de {logs.length} registros
           </p>
           <div className="flex items-center gap-2">
              <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default AuditLogs;
