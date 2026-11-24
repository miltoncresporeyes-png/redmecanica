
import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { downloadCsv } from '../../lib/csv';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error loading stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium font-sans">Sincronizando panorama total...</p>
      </div>
    );
  }

  const jobDistribution = stats?.jobsByStatus?.map((s: any) => ({
    name: s.status,
    value: s._count?._all || s._count || 0
  })) || [];

  const topCommunes = stats?.topCommunes?.map((c: any) => ({
    name: c.commune,
    count: c._count?._all || c._count || 0
  })) || [];

  const exportReport = () => {
    const sm = stats?.summary || {};
    const rows: { seccion: string; metrica: string; valor: string | number }[] = [
      { seccion: 'Resumen', metrica: 'Prestadores totales', valor: sm.totalProviders ?? 0 },
      { seccion: 'Resumen', metrica: 'Prestadores visibles en el directorio', valor: sm.visibleProviders ?? 0 },
      { seccion: 'Resumen', metrica: 'Prestadores verificados', valor: sm.verifiedProviders ?? 0 },
      { seccion: 'Resumen', metrica: 'Prestadores por revisar', valor: sm.pendingProviders ?? 0 },
      { seccion: 'Resumen', metrica: 'Servicios activos', valor: sm.activeJobsCount ?? 0 },
      { seccion: 'Resumen', metrica: 'Servicios totales', valor: sm.totalJobs ?? 0 },
      { seccion: 'Resumen', metrica: 'Conversión a servicio (%)', valor: sm.conversionRate ?? 0 },
      { seccion: 'Resumen', metrica: 'Satisfacción promedio', valor: sm.avgRating ? Number(sm.avgRating).toFixed(2) : 'sin datos' },
      { seccion: 'Resumen', metrica: 'Servicios calificados', valor: sm.ratedJobs ?? 0 },
      { seccion: 'Resumen', metrica: 'Ingresos cobrados (CLP)', valor: sm.totalRevenue ?? 0 },
      { seccion: 'Resumen', metrica: 'Cancelaciones (total)', valor: stats?.issues?.cancellations ?? 0 },
      { seccion: 'Resumen', metrica: 'Cancelaciones (últimas 24 h)', valor: stats?.issues?.cancellations24h ?? 0 },
      ...jobDistribution.map((j: any) => ({ seccion: 'Servicios por estado', metrica: j.name, valor: j.value })),
      ...topCommunes.map((c: any) => ({ seccion: 'Comunas con más prestadores', metrica: c.name, valor: c.count })),
    ];
    downloadCsv(`reporte-${new Date().toISOString().slice(0, 10)}`, rows, [
      { header: 'Sección', value: (r) => r.seccion },
      { header: 'Métrica', value: (r) => r.metrica },
      { header: 'Valor', value: (r) => r.valor },
    ]);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Centro de Control</h1>
          <p className="text-gray-500 mt-1">Monitoreo en tiempo real de la red RedMecánica.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportReport} className="btn-primary !min-h-[40px] !py-2">
            <Download size={16} aria-hidden="true" />
            Exportar reporte
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Prestadores visibles"
          value={stats?.summary?.visibleProviders ?? 0}
          icon={Users}
          gradient="from-blue-600 to-indigo-600"
          subtitle={`${stats?.summary?.verifiedProviders ?? 0} verificados · ${stats?.summary?.pendingProviders ?? 0} por revisar`}
        />
        <KPICard
          title="Conversión a servicio"
          value={`${stats?.summary?.conversionRate ?? 0}%`}
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-600"
          subtitle="Solicitudes con cotización aceptada"
        />
        <KPICard
          title="Servicios activos"
          value={stats?.summary?.activeJobsCount ?? 0}
          icon={Clock}
          gradient="from-amber-400 to-orange-500"
          subtitle="Abiertos o en curso"
        />
        <KPICard
          title="Satisfacción promedio"
          value={stats?.summary?.avgRating ? Number(stats.summary.avgRating).toFixed(1) : '—'}
          icon={CheckCircle2}
          gradient="from-purple-500 to-pink-600"
          subtitle={stats?.summary?.ratedJobs ? `${stats.summary.ratedJobs} calificaciones` : 'Aún sin calificaciones'}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Distribución de Flujo</h3>
              <p className="text-sm text-gray-500">Estado de todos los servicios históricos.</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {jobDistribution.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.name}:</span>
                <span className="text-sm font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Communes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Cobertura Regional</h3>
              <p className="text-sm text-gray-500">Top comunas por volumen de técnicos.</p>
            </div>
            <MapPin size={24} className="text-blue-500" />
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCommunes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 10, 10, 0]} 
                  barSize={18}
                >
                   {topCommunes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3B82F6" opacity={1 - (index * 0.15)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Critical Issues / Alerts */}
      <div className="bg-[#0F172A] p-8 md:p-10 rounded-[40px] overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-blue-500/20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-red-500/10 rounded-card flex items-center justify-center border border-red-500/20 shadow-inner">
               <AlertCircle size={36} className="text-red-500" />
            </div>
            <div>
              <h4 className="text-white text-2xl font-black tracking-tight">Cancelaciones de servicios</h4>
              <p className="text-gray-300 mt-1 max-w-md font-medium">
                {stats?.issues?.cancellations24h ?? 0} en las últimas 24 horas · {stats?.issues?.cancellations ?? 0} en total.
                {(stats?.issues?.cancellations24h ?? 0) >= 5 ? ' Conviene revisar el motivo en el rastro de auditoría.' : ''}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/audit')} className="w-full lg:w-auto px-10 py-5 bg-white text-[#0F172A] rounded-card font-black flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-95 transition-all group shadow-2xl">
            Ver rastro de auditoría
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{
  title: string, 
  value: string | number, 
  trend?: string, 
  icon: any, 
  gradient: string,
  subtitle: string
}> = ({ title, value, trend, icon: Icon, gradient, subtitle }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-full group transition-all hover:shadow-xl hover:shadow-gray-200/50"
  >
    <div className="flex items-center justify-between">
      <div className={cn("w-14 h-14 rounded-card bg-gradient-to-br flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110", gradient)}>
        <Icon size={28} />
      </div>
      {trend && (
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-black tracking-tighter shadow-sm",
          trend.startsWith('+') ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}>
          {trend}
        </div>
      )}
    </div>
    <div className="mt-10">
      <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.15em]">{title}</p>
      <h3 className="text-4xl font-black text-gray-900 mt-1 tracking-tighter">{value}</h3>
      <p className="text-xs text-gray-600 mt-2 font-semibold">{subtitle}</p>
    </div>
  </motion.div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default AdminDashboard;
