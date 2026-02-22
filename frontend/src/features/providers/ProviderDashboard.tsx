import React, { useState, useEffect } from 'react';
import api from '../../lib/http';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'quotes' | 'earnings' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, jobsRes, quotesRes] = await Promise.all([
        api.get('/providers/me/dashboard').catch(() => ({ data: null })),
        api.get('/providers/me/jobs').catch(() => ({ data: [] })),
        api.get('/providers/me/quotes').catch(() => ({ data: [] }))
      ]);
      
      setData(dashRes.data);
      setJobs(jobsRes.data || []);
      setQuotes(quotesRes.data || []);
      
      // Simulated notifications (in production, fetch from API)
      setNotifications([
        {
          id: '1',
          type: 'new_job',
          title: 'Nueva solicitud de servicio',
          message: 'Toyota Hilux - Cambio de aceite en Las Condes',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'quote_accepted',
          title: 'Cotización aceptada',
          message: 'Juan Pérez aceptó tu cotización de $45.000',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'payment_received',
          title: 'Pago recibido',
          message: '$38.000 depositados a tu cuenta',
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
      <div className="text-xl font-bold animate-pulse">Cargando tu panel...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-6 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-3xl font-black text-indigo-600">
                {provider?.user?.name?.charAt(0) || 'P'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-black mb-2">{provider?.user?.name || 'Proveedor'}</h1>
              <div className="flex gap-3 mb-3">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ {stats.avgRating || '5.0'}
                </span>
                <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                  {provider?.status === 'ACTIVE' ? '✓ Activo' : '⏳ Pendiente'}
                </span>
              </div>
              <p className="text-purple-100 text-sm">{provider?.type} • {provider?.commune || 'Santiago'}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                        Marcar todo leído
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl">
                            {n.type === 'new_job' ? '🔧' : n.type === 'quote_accepted' ? '✅' : n.type === 'payment_received' ? '💰' : '⭐'}
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-600">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('es-CL')}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={onClose} className="text-white/80 hover:text-white text-3xl font-light">×</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-gray-500 text-sm">Este mes</span>
          </div>
          <p className="text-2xl font-black text-green-600">${(stats.monthEarnings || 250000).toLocaleString('es-CL')}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔧</span>
            <span className="text-gray-500 text-sm">Activos</span>
          </div>
          <p className="text-2xl font-black text-blue-600">{pendingJobs.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📝</span>
            <span className="text-gray-500 text-sm">Cotizaciones</span>
          </div>
          <p className="text-2xl font-black text-purple-600">{pendingQuotes.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⭐</span>
            <span className="text-gray-500 text-sm">Rating</span>
          </div>
          <p className="text-2xl font-black text-yellow-600">{stats.avgRating || '5.0'}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-2 flex gap-2 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Panel', icon: '📊' },
          { id: 'quotes', label: 'Cotizaciones', icon: '📝', badge: pendingQuotes.length },
          { id: 'jobs', label: 'Trabajos', icon: '🔧', badge: pendingJobs.length },
          { id: 'earnings', label: 'Ingresos', icon: '💵' },
          { id: 'profile', label: 'Perfil', icon: '👤' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Quotes */}
            {pendingQuotes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-500">📝</span> Cotizaciones Pendientes
                </h3>
                <div className="space-y-3">
                  {pendingQuotes.slice(0, 5).map(quote => (
                    <div key={quote.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium">{quote.job?.request?.service?.name || 'Servicio'}</p>
                        <p className="text-sm text-gray-500">{quote.job?.request?.vehicle?.make} {quote.job?.request?.vehicle?.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">${quote.totalCost?.toLocaleString('es-CL')}</p>
                        <p className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString('es-CL')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Jobs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔧</span> Trabajos Activos
              </h3>
              {pendingJobs.length > 0 ? (
                <div className="space-y-3">
                  {pendingJobs.slice(0, 5).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div>
                        <p className="font-bold">{job.request?.service?.name}</p>
                        <p className="text-sm text-gray-600">{job.request?.vehicle?.make} {job.request?.vehicle?.model}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                          job.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status === 'CONFIRMED' ? 'Confirmado' : 
                           job.status === 'IN_PROGRESS' ? 'En Progreso' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${job.estimatedCost?.toLocaleString('es-CL')}</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline mt-2">
                          Ver detalles →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl">🔍</span>
                  <p className="mt-2">No hay trabajos activos</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4">💡 Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2">
                  <span>📝</span> Responder cotizaciones
                </button>
                <button className="w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2">
                  <span>📅</span> Ver agenda de hoy
                </button>
                <button className="w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2">
                  <span>💬</span> Mensajes de clientes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-gray-900 mb-4">📊 Rendimiento</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Tasa de completado</span>
                    <span className="font-bold">{stats.completionRate || 95}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.completionRate || 95}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Tiempo de respuesta</span>
                    <span className="font-bold">{stats.responseTime || '< 30 min'}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Total trabajos</span>
                    <span className="font-bold">{stats.completedJobs || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Todas las Cotizaciones</h3>
          {quotes.length > 0 ? (
            <div className="space-y-3">
              {quotes.map(quote => (
                <div key={quote.id} className="flex justify-between items-center p-4 border rounded-xl">
                  <div>
                    <p className="font-medium">{quote.job?.request?.service?.name}</p>
                    <p className="text-sm text-gray-500">{quote.job?.request?.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${quote.totalCost?.toLocaleString('es-CL')}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      quote.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No hay cotizaciones</p>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Todos los Trabajos</h3>
          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="flex justify-between items-center p-4 border rounded-xl">
                  <div>
                    <p className="font-medium">{job.request?.service?.name}</p>
                    <p className="text-sm text-gray-500">{job.request?.vehicle?.make} {job.request?.vehicle?.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${job.estimatedCost?.toLocaleString('es-CL')}</p>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No hay trabajos</p>
          )}
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Resumen de Ingresos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Total ganado</p>
              <p className="text-3xl font-black text-green-600">${(stats.totalEarnings || 1250000).toLocaleString('es-CL')}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Este mes</p>
              <p className="text-3xl font-black text-blue-600">${(stats.monthEarnings || 250000).toLocaleString('es-CL')}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm">Pendiente</p>
              <p className="text-3xl font-black text-purple-600">$0</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Mi Perfil</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                type="text" 
                defaultValue={provider?.user?.name}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                defaultValue={provider?.user?.email}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                type="tel" 
                defaultValue={provider?.phone || ''}
                placeholder="+56 9 83414730"
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
