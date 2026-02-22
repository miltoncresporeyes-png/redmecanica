
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  HardDrive,
  CheckCircle2,
  XCircle,
  RefreshCw,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Monitoring: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uptimeHistory, setUptimeHistory] = useState<any[]>([]);

  const fetchMonitoringData = async () => {
    try {
      const [hRes, mRes] = await Promise.all([
        api.get('/monitoring/health'),
        api.get('/monitoring/metrics')
      ]);
      setHealth(hRes.data);
      setMetrics(mRes.data);
      
      setUptimeHistory(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          memory: Math.round((mRes.data.memory?.rss || 0) / 1024 / 1024) 
        }].slice(-10);
        return newData;
      });
    } catch (error) {
      console.error("Error loading monitoring data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-bold tracking-tight">Cargando telemetría del sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Estado del Sistema</h1>
          <p className="text-gray-500 mt-1">Telemetría y salud de la infraestructura en tiempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            En Línea
          </div>
          <button 
            onClick={fetchMonitoringData}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthCard 
          name="Base de Datos" 
          status={health?.services?.database} 
          icon={Database} 
          details="SQLite (Local Dev)" 
        />
        <HealthCard 
          name="Servidor API" 
          status={health?.services?.api} 
          icon={Server} 
          details={`Runtime Node.js | ${metrics?.uptime ? Math.round(metrics.uptime / 60) : 0}m de uptime`} 
        />
        <HealthCard 
          name="Motor de IA" 
          status="UP" 
          icon={Cpu} 
          details="Gemini 2.0 Flash (External Proxy)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Memory Chart */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight">Memoria del Proceso (RSS)</h3>
               <p className="text-sm text-gray-400 font-medium">Uso dinámico de recursos en el servidor backend.</p>
             </div>
             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
               <HardDrive size={28} />
             </div>
           </div>
           
           <div className="h-[350px] w-full flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={uptimeHistory}>
                 <defs>
                   <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                 <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} unit="MB" />
                 <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorMem)" animationDuration={1000} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Resources Summary */}
        <div className="flex flex-col gap-6">
           <MetricSummaryCard 
             title="Carga de Datos" 
             value={metrics?.audit_logs_total || 0} 
             label="Registros en Auditoría" 
             icon={History}
             color="blue"
           />
           <MetricSummaryCard 
             title="Conexiones" 
             value={metrics?.users_total || 0} 
             label="Cuentas Registradas" 
             icon={Activity}
             color="emerald"
           />
           
           <div className="bg-[#0F172A] p-8 rounded-[32px] text-white overflow-hidden relative group mt-auto shadow-2xl shadow-indigo-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Metadata de Sistema</p>
                <div className="mt-6 space-y-4 font-mono text-[11px]">
                   <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                     <span className="text-gray-500">Node Version:</span>
                     <span className="font-bold">v20.11.0</span>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                     <span className="text-gray-500">V8 Heap Limit:</span>
                     <span className="font-bold">4.0 GB</span>
                   </div>
                   <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                     <span className="text-gray-500">Env Status:</span>
                     <span className="text-emerald-400 font-black tracking-widest">STABLE</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-500">Region:</span>
                     <span className="font-bold">South-America</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const HealthCard: React.FC<{name: string, status: string, icon: any, details: string}> = ({ name, status, icon: Icon, details }) => (
  <motion.div 
    whileHover={{ y: -8, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)' }}
    className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 transition-all group"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shadow-inner">
        <Icon size={24} />
      </div>
      <div className={cn(
        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
        status === 'UP' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      )}>
        <span className={cn("w-2 h-2 rounded-full", status === 'UP' ? "bg-emerald-500" : "bg-red-500")}></span>
        {status || 'OFFLINE'}
      </div>
    </div>
    <h4 className="font-black text-gray-900 tracking-tight text-lg">{name}</h4>
    <p className="text-[11px] text-gray-400 mt-1.5 font-bold italic opacity-80">{details}</p>
  </motion.div>
);

const MetricSummaryCard: React.FC<{title: string, value: number, label: string, icon: any, color: string}> = ({ title, value, label, icon: Icon, color }) => (
  <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group transition-all hover:bg-gray-50/50">
     <div className="flex items-center gap-5">
       <div className={cn(
         "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transform transition-transform group-hover:scale-110",
         color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
       )}>
         <Icon size={28} />
       </div>
       <div>
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
         <div className="flex items-baseline gap-2 mt-1">
           <span className="text-3xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()}</span>
           <span className="text-[11px] font-bold text-gray-400 opacity-60 uppercase">{label}</span>
         </div>
       </div>
     </div>
  </div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Monitoring;
