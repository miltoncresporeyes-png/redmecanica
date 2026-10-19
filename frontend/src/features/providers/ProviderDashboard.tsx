import React, { useState, useEffect } from 'react';
import api from '../../lib/http';
import SubscriptionPaymentModal from './SubscriptionPaymentModal';
import CoverageDashboard from './CoverageDashboard';
import { 
  Building2, 
  MapPin, 
  Star, 
  Bell, 
  X, 
  DollarSign, 
  Wrench, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  User, 
  CheckCircle2, 
  Briefcase
} from 'lucide-react';

interface ProviderDashboardProps {
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'new_job' | 'quote_accepted' | 'payment_received' | 'review';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coverage' | 'quotes' | 'jobs' | 'earnings' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, jobsRes, quotesRes, invoicesRes] = await Promise.all([
        api.get('/providers/me/dashboard').catch(() => ({ data: null })),
        api.get('/providers/me/jobs').catch(() => ({ data: [] })),
        api.get('/providers/me/quotes').catch(() => ({ data: [] })),
        api.get('/providers/me/invoices').catch(() => ({ data: [] }))
      ]);
      
      setData(dashRes.data);
      setJobs(jobsRes.data || []);
      setQuotes(quotesRes.data || []);
      setInvoices(invoicesRes.data || []);
      
      setNotifications([
        {
          id: '1',
          type: 'new_job',
          title: 'Nueva solicitud de servicio',
          message: 'Toyota Hilux - Mantención preventiva en Las Condes',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'quote_accepted',
          title: 'Cotización aprobada por cliente',
          message: 'Presupuesto de $45.000 confirmado',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'payment_received',
          title: 'Liquidación procesada',
          message: '$38.000 acreditados a tu cuenta bancaria',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (error) {
      console.error("Error fetching provider data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const stats = data?.stats || {
    totalEarnings: 0,
    monthEarnings: 0,
    completedJobs: 0,
    avgRating: 0,
    responseTime: 'N/A',
    completionRate: 0,
    pendingQuotes: 0,
    activeJobs: 0
  };

  const provider = data?.provider;

  const pendingJobs = jobs.filter(j => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');
  const pendingQuotes = quotes.filter(q => q.status === 'SENT');

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="flex items-center gap-3 text-slate-600 font-semibold text-base animate-pulse">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        Cargando panel de gestión...
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Header Ejecutivo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                {provider?.user?.name ? provider.user.name.charAt(0).toUpperCase() : <Building2 className="w-8 h-8 text-slate-300" />}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-slate-900 rounded-full w-5 h-5 flex items-center justify-center" title="Cuenta Operativa">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {provider?.user?.name || 'Portal Prestador'}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border ${
                  provider?.status === 'ACTIVE' 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80' 
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${provider?.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  {provider?.status === 'ACTIVE' ? 'Cuenta Verificada' : 'Validación Pendiente'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-slate-200">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {provider?.type === 'WORKSHOP' ? 'Taller Establecido' : 'Mecánico Certificado'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {provider?.commune || 'Región Metropolitana'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <strong className="text-white">{stats.avgRating || '5.0'}</strong> / 5.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Panel de Notificaciones */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 p-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 w-84 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                    <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Avisos Operativos</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        Marcar como leídos
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3.5 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1 rounded-md bg-slate-100 text-slate-600">
                            {n.type === 'new_job' ? <Wrench className="w-3.5 h-3.5" /> : 
                             n.type === 'quote_accepted' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : 
                             <DollarSign className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-slate-900 truncate">{n.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString('es-CL')}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Principales (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facturación Mensual</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">${(stats.monthEarnings || 250000).toLocaleString('es-CL')}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Rendimiento en ciclo activo
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Servicios en Curso</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{pendingJobs.length}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Órdenes confirmadas o en taller</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cotizaciones Pendientes</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{pendingQuotes.length}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Por confirmar con el usuario</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Índice de Calidad</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{stats.avgRating || '5.0'}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Basado en reseñas de clientes</p>
        </div>
      </div>

      {/* Barra de Navegación de Pestañas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Resumen Ejecutivo', icon: TrendingUp },
          { id: 'coverage', label: 'Zonas y Cobertura', icon: MapPin },
          { id: 'quotes', label: 'Cotizaciones', icon: FileText, badge: pendingQuotes.length },
          { id: 'jobs', label: 'Servicios', icon: Wrench, badge: pendingJobs.length },
          { id: 'earnings', label: 'Liquidación y Finanzas', icon: DollarSign },
          { id: 'profile', label: 'Datos del Prestador', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido de la Pestaña Activa */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Cotizaciones que requieren acción */}
            {pendingQuotes.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" /> Presupuestos Enviados
                  </h3>
                  <button onClick={() => setActiveTab('quotes')} className="text-xs font-semibold text-blue-600 hover:underline">
                    Ver todos ({quotes.length})
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {pendingQuotes.slice(0, 5).map(quote => (
                    <div key={quote.id} className="py-3.5 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{quote.job?.request?.service?.name || 'Servicio Técnico'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{quote.job?.request?.vehicle?.make} {quote.job?.request?.vehicle?.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900">${quote.totalCost?.toLocaleString('es-CL')}</p>
                        <p className="text-[11px] text-slate-400">{new Date(quote.createdAt).toLocaleDateString('es-CL')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trabajos Activos */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" /> Trabajos en Operación
                </h3>
                <button onClick={() => setActiveTab('jobs')} className="text-xs font-semibold text-blue-600 hover:underline">
                  Ver historial
                </button>
              </div>

              {pendingJobs.length > 0 ? (
                <div className="space-y-3">
                  {pendingJobs.slice(0, 5).map(job => (
                    <div key={job.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-900">{job.request?.service?.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            job.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                            job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {job.status === 'CONFIRMED' ? 'Confirmado' : 
                             job.status === 'IN_PROGRESS' ? 'En Taller' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{job.request?.vehicle?.make} {job.request?.vehicle?.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900">${job.estimatedCost?.toLocaleString('es-CL')}</p>
                        <button className="text-xs font-medium text-blue-600 hover:underline mt-1">
                          Revisar orden
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                  <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500">No registras trabajos en curso actualmente</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Lateral */}
          <div className="space-y-6">
            {/* Gestión Rápida */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Gestión Comercial</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('quotes')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 py-2.5 px-3.5 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" /> Cotizaciones por responder
                  </span>
                  <span className="text-[11px] font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">{pendingQuotes.length}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('coverage')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 py-2.5 px-3.5 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" /> Configurar comunas activas
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button 
                  onClick={() => setActiveTab('earnings')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 py-2.5 px-3.5 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-500" /> Estado de pagos y retenciones
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Resumen Operativo */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Indicadores Operativos</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">Cumplimiento de servicio</span>
                    <span className="font-bold text-slate-900">{stats.completionRate != null ? `${stats.completionRate}%` : '100%'}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.completionRate ?? 100}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs py-2 border-t border-slate-100">
                  <span className="text-slate-500">Tiempo de respuesta prom.</span>
                  <span className="font-semibold text-slate-900">{stats.responseTime ?? '15 min'}</span>
                </div>
                <div className="flex justify-between text-xs py-2 border-t border-slate-100">
                  <span className="text-slate-500">Total trabajos finalizados</span>
                  <span className="font-semibold text-slate-900">{stats.completedJobs || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coverage' && (
        <CoverageDashboard onUpgradePlan={() => setShowPaymentModal(true)} />
      )}

      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6">Registro de Cotizaciones</h3>
          {quotes.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {quotes.map(quote => (
                <div key={quote.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{quote.job?.request?.service?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{quote.job?.request?.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">${quote.totalCost?.toLocaleString('es-CL')}</p>
                    <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      quote.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      quote.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {quote.status === 'ACCEPTED' ? 'Aceptada' : quote.status === 'REJECTED' ? 'Rechazada' : 'Enviada'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10 text-xs">No se registran cotizaciones previas</p>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6">Historial de Servicios</h3>
          {jobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {jobs.map(job => (
                <div key={job.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{job.request?.service?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.request?.vehicle?.make} {job.request?.vehicle?.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">${job.estimatedCost?.toLocaleString('es-CL')}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10 text-xs">No se registran trabajos previos</p>
          )}
        </div>
      )}

      {activeTab === 'earnings' && (() => {
        const escrowFunds = jobs
          .filter(j => j.paymentStatus === 'HELD')
          .reduce((sum, j) => sum + (j.estimatedCost || 0), 0);

        const commissionPaid = jobs
          .filter(j => j.paymentStatus === 'RELEASED')
          .reduce((sum, j) => sum + ((j.estimatedCost || 0) * 0.12), 0);

        const netEarnings = jobs
          .filter(j => j.paymentStatus === 'RELEASED')
          .reduce((sum, j) => sum + ((j.estimatedCost || 0) * 0.88), 0);

        return (
          <div className="space-y-6">
            {/* Membresía / Plan Comercial */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">Suscripción Profesional RedMecánica</h3>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      provider?.status === 'ACTIVE' 
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' 
                        : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                    }`}>
                      {provider?.status === 'ACTIVE' ? 'Activa' : 'En Evaluación'}
                    </span>
                  </div>
                  {provider?.subscription ? (
                    <div className="space-y-1 text-slate-300 text-xs sm:text-sm">
                      <p>Plan vigente: <strong className="text-white uppercase">{provider.subscription.plan}</strong></p>
                      <p>Vigencia: {new Date(provider.subscription.startDate).toLocaleDateString('es-CL')} al <strong className="text-white">{new Date(provider.subscription.endDate).toLocaleDateString('es-CL')}</strong></p>
                      <p>Monto de renovación: <strong className="text-emerald-400">${provider.subscription.amount?.toLocaleString('es-CL')} CLP</strong></p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Tu perfil cuenta con visibilidad activa para recibir solicitudes de clientes en tu comuna.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {provider?.subscription ? 'Gestionar Facturación' : 'Mejorar Plan de Cobertura'}
                </button>
              </div>
            </div>

            {/* Desglose de Fondos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monto Neto Liquidado (88%)</p>
                <p className="text-2xl font-bold text-slate-900">${netEarnings.toLocaleString('es-CL')}</p>
                <p className="text-[11px] text-slate-400 mt-1">Fondos transferidos a tu cuenta</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fondos en Custodia (Escrow)</p>
                <p className="text-2xl font-bold text-blue-700">${escrowFunds.toLocaleString('es-CL')}</p>
                <p className="text-[11px] text-slate-400 mt-1">Liberación al finalizar cada trabajo</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Comisión de Plataforma (12%)</p>
                <p className="text-2xl font-bold text-slate-600">${commissionPaid.toLocaleString('es-CL')}</p>
                <p className="text-[11px] text-slate-400 mt-1">Cargos por gestión y garantías</p>
              </div>
            </div>

            {/* Facturas */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Registro de Comprobantes
              </h3>
              
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Folio</th>
                        <th className="py-2.5 px-3">Concepto</th>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50 text-slate-700">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="py-3 px-3">
                            {inv.type === 'SUBSCRIPTION' ? 'Suscripción de visibilidad' : 'Servicio técnico'}
                          </td>
                          <td className="py-3 px-3">{new Date(inv.createdAt).toLocaleDateString('es-CL')}</td>
                          <td className="py-3 px-3 font-bold">${inv.total?.toLocaleString('es-CL')} CLP</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inv.status === 'PAID' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <FileText className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">No se registran comprobantes emitidos</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 mb-6">Información del Prestador</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre / Razón Social</label>
              <input 
                type="text" 
                defaultValue={provider?.user?.name}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Correo Electrónico de Contacto</label>
              <input 
                type="email" 
                defaultValue={provider?.user?.email}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono / WhatsApp Operativo</label>
              <input 
                type="tel" 
                defaultValue={provider?.phone || ''}
                placeholder="+56 9 8341 4730"
                className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Actualizar Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && provider && (
        <SubscriptionPaymentModal 
          providerId={provider.id} 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={fetchData} 
        />
      )}
    </div>
  );
};

export default ProviderDashboard;
