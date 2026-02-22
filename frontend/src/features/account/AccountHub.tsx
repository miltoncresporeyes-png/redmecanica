import React, { useState, useEffect } from 'react';
import api from '../../lib/http';

interface AccountHubProps {
  currentUser: any;
  onClose: () => void;
}

const AccountHub: React.FC<AccountHubProps> = ({ currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'vehicles' | 'quotes' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, quotesRes] = await Promise.all([
        api.get(`/users/${currentUser.id}`),
        api.get('/quotes/user/me')
      ]);
      setUserData(userRes.data);
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error("Error fetching account data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
       fetchData();
    }
  }, [currentUser]);

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm('¿Estás seguro de aceptar esta cotización? Esto confirmará el inicio del servicio.')) return;
    try {
      await api.post(`/quotes/${quoteId}/accept`);
      alert('Cotización aceptada exitosamente. El taller ha sido notificado.');
      fetchData();
    } catch (error) {
      console.error("Error accepting quote", error);
      alert('Error al aceptar la cotización');
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const serviceHistory = userData.serviceRequests || [];
  const totalSpent = serviceHistory.filter((s:any) => s.job?.status === 'COMPLETED').reduce((acc:any, item:any) => acc + (item.job?.estimatedCost || 0), 0);
  const avgRating = 5.0; // Placeholder

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-black text-blue-600 border-4 border-white/20">
              {userData.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-black mb-2">{userData.name}</h1>
              <p className="text-blue-100 mb-4 flex items-center gap-2">
                <span>📧</span> {userData.email}
              </p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <div className="text-xs text-blue-100 uppercase tracking-wider">Cliente desde</div>
                  <div className="text-lg font-bold">{new Date(userData.createdAt).getFullYear()}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <div className="text-xs text-blue-100 uppercase tracking-wider">Servicios</div>
                  <div className="text-lg font-bold">{serviceHistory.length}</div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-3xl font-light">×</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="💰" label="Total Invertido" value={`$${totalSpent.toLocaleString()}`} color="blue" trend="+0%" />
        <StatCard icon="⭐" label="Calificación Prom." value={avgRating.toFixed(1)} color="yellow" trend="Excelente" />
        <StatCard icon="🚗" label="Vehículos" value={userData.vehicles.length.toString()} color="green" />
        <StatCard icon="🛡️" label="Garantías Activas" value="1" color="purple" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 p-2 flex gap-2">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'quotes', label: 'Cotizaciones', icon: '📄' },
          { id: 'history', label: 'Historial', icon: '📝' },
          { id: 'vehicles', label: 'Mis Vehículos', icon: '🚗' },
          { id: 'settings', label: 'Configuración', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Actividad Reciente */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <span className="text-blue-500">🕒</span> Solicitudes Recientes
                </h3>
                <div className="space-y-4">
                  {serviceHistory.slice(0, 5).map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">🔧</div>
                        <div>
                          <h4 className="font-bold">{req.service.name}</h4>
                          <p className="text-xs text-slate-500">{req.vehicle.make} {req.vehicle.model} • {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                 <h3 className="text-lg font-black mb-2">¿Necesitas ayuda?</h3>
                 <p className="text-indigo-100 text-sm mb-4">Nuestro equipo técnico está listo para asistirte las 24/7.</p>
                 <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">Contactar Soporte</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black">Cotizaciones Recibidas</h3>
              <p className="text-sm text-slate-500 mt-1">Revisa y acepta las ofertas de los talleres</p>
            </div>
            <div className="p-6 space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium">No has recibido cotizaciones aún.</div>
              ) : (
                quotes.map((quote: any) => (
                  <div key={quote.id} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-300 transition-all bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">🏪</div>
                        <div>
                          <h4 className="font-black text-xl text-slate-800">{quote.provider.user.name}</h4>
                          <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">{quote.job.request.service.name} para {quote.job.request.vehicle.make}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">${quote.totalCost.toLocaleString()}</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Válido hasta: {new Date(quote.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                      <h5 className="text-xs font-black text-slate-400 uppercase mb-2">Diagnóstico del Taller</h5>
                      <p className="text-sm text-slate-700 italic">"{quote.preliminaryDiagnosis}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex gap-4 text-xs font-bold text-slate-500">
                        <span>⏱️ Duración: {quote.estimatedDuration} min</span>
                        <span>🛡️ Garantía: {quote.warranty}</span>
                      </div>
                      <div className="flex gap-2">
                        {quote.status === 'SENT' ? (
                          <>
                            <button className="px-6 py-2 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Rechazar</button>
                            <button 
                              onClick={() => handleAcceptQuote(quote.id)}
                              className="px-6 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                              Aceptar Cotización
                            </button>
                          </>
                        ) : (
                          <span className={`px-4 py-2 rounded-xl font-black uppercase text-xs ${quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {quote.status === 'ACCEPTED' ? 'Aceptada' : 'Rechazada'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Similar updates for history and vehicles tabs... */}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="text-blue-500">🕒</span> Actividad Reciente
              </h3>
              <div className="space-y-4">
                {serviceHistory.slice(0, 3).map((service, idx) => (
                  <div key={service.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      🔧
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800">{service.service}</h4>
                          <p className="text-xs text-slate-500">{service.provider} • {service.vehicle}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">${service.cost.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">{new Date(service.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {service.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < service.rating! ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                          ))}
                          <span className="text-xs text-slate-500 ml-2">Tu calificación</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-bold mb-2">Estado de Cuenta</h3>
                <p className="text-green-100 text-sm mb-4">Todo al día. Sin pagos pendientes.</p>
                <button className="w-full bg-white text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                  Ver Facturas
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span>🎁</span> Programa de Lealtad
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Puntos acumulados</span>
                    <span className="font-bold text-blue-600">1,250 pts</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '62%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500">250 puntos más para tu próximo descuento</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black flex items-center gap-2">
                <span className="text-blue-500">📜</span> Historial Completo de Servicios
              </h3>
              <p className="text-sm text-slate-500 mt-1">Mantén el control de todo el mantenimiento de tus vehículos</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Servicio</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Proveedor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Vehículo</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Costo</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {serviceHistory.map(service => (
                    <tr key={service.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(service.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{service.service}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{service.provider}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{service.vehicle}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-600">${service.cost.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        {service.rating ? (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < service.rating! ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                            ))}
                          </div>
                        ) : (
                          <button className="text-xs text-blue-600 font-bold hover:underline">Calificar</button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          service.status === 'completed' ? 'bg-green-100 text-green-700' :
                          service.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {service.status === 'completed' ? 'Completado' : service.status === 'in-progress' ? 'En Progreso' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleCard 
              make="Toyota"
              model="Hilux"
              year={2022}
              plate="RR-TT-44"
              mileage="45,000 km"
              nextService="Cambio de Aceite en 5,000 km"
            />
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-12 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
              <div className="text-center">
                <div className="text-6xl mb-3">➕</div>
                <h3 className="font-bold text-slate-700">Agregar Vehículo</h3>
                <p className="text-sm text-slate-500 mt-1">Registra otro vehículo</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black mb-6">Configuración de Cuenta</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Nombre</label>
                  <input type="text" defaultValue="Roberto Gómez" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Email</label>
                  <input type="email" defaultValue="cliente.pyme@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Teléfono</label>
                  <input type="tel" defaultValue="+56 9 83414730" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Ciudad</label>
                  <input type="text" defaultValue="Santiago" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}} />
    </div>
  );
};

const StatCard = ({ icon, label, value, color, trend }: { icon: string; label: string; value: string; color: string; trend?: string }) => {
  const colors: any = {
    blue: 'from-blue-500 to-indigo-600',
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600'
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-800 mb-1">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      {trend && <div className="text-xs text-green-600 font-bold mt-2">↗ {trend}</div>}
    </div>
  );
};

const VehicleCard = ({ make, model, year, plate, mileage, nextService }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 text-9xl opacity-5">🚗</div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black mb-1">{make} {model}</h3>
          <p className="text-slate-400">{year} • {plate}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
          <span className="text-xs font-bold">Principal</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">Kilometraje</div>
          <div className="font-bold">{mileage}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="text-xs text-slate-400 mb-1">Próximo Servicio</div>
          <div className="font-bold text-xs">{nextService}</div>
        </div>
      </div>
      <button className="w-full bg-white text-slate-800 py-3 rounded-xl font-bold mt-4 hover:bg-slate-100 transition-colors">
        Ver Detalles
      </button>
    </div>
  </div>
);

export default AccountHub;
