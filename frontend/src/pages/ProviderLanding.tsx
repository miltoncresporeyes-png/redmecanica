import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface ProviderLandingProps {
  onClose?: () => void;
}

const ProviderLanding: React.FC<ProviderLandingProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    commune: '',
    experience: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">¡Te contactaremos pronto!</h2>
          <p className="text-gray-600 mb-6">
            Gracias por interés en RedMecánica. Un agente comercial te contactará en menos de 24 horas para guiarte en el proceso de registro.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium">
              📞 ¿Prefieres que te llamemos ahora?
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">+56 9 83414730</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Únete a RedMecánica | Registro de Prestadores"
        description="¿Eres mecánico, taller o grúa? Únete a RedMecánica y aumenta tus ingresos. Miles de clientes buscando servicios automotrices en Chile."
        keywords="trabajar como mecánico, registrarme como taller, ganar dinero mecánico, prestador autos Chile"
        canonicalUrl="https://redmecanica.cl/unete"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
              <path d="M6 12L18 6M6 12L18 18" stroke="white" strokeWidth="2" />
            </svg>
            <h1 className="text-2xl font-bold text-white">
              Red<span className="text-yellow-300">Mecánica</span>
            </h1>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <span className="text-3xl">&times;</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Value Proposition */}
          <div className="text-white relative z-10">
            <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-xs mb-8 shadow-xl shadow-yellow-400/30 animate-bounce-subtle">
              🚀 LANZAMIENTO - Primeros 50 prestadores sin comisión
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tighter drop-shadow-2xl">
              Convierte tu taller en una<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">máquina de clientes</span>
            </h1>
            <p className="text-xl opacity-90 mb-12 max-w-lg leading-relaxed font-medium">
              Únete a la plataforma de servicios automotrices #1 en Chile. 
              Sin costo de registro, sin permanencia.
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                { icon: '🎯', title: 'Clientes garantizados', desc: 'Te conectamos con conductores que necesitan servicios', color: 'bg-gradient-to-br from-pink-500 to-rose-600' },
                { icon: '💳', title: 'Pagos seguros', desc: 'Sistema de escrow protege tu dinero', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
                { icon: '📱', title: 'Gestión digital', desc: 'Administra todo desde tu panel', color: 'bg-gradient-to-br from-slate-700 to-slate-900' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-5 group cursor-default">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tight group-hover:text-yellow-300 transition-colors">{item.title}</h3>
                    <p className="opacity-80 text-base leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl">
              <div className="flex -space-x-3">
                {[
                  'from-orange-400 to-pink-500',
                  'from-blue-400 to-indigo-500',
                  'from-purple-400 to-fuchsia-500'
                ].map((gradient, i) => (
                  <div key={i} className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full border-2 border-white/50 flex items-center justify-center text-[10px] font-black shadow-lg`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-base font-bold text-white/90">
                <span className="font-black text-yellow-400">FASE 1</span> • LANZAMIENTO 2026
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Regístrate ahora</h2>
              <p className="text-gray-500">Completa tus datos y te contactaremos</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="+56 9 83414730"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de servicio</label>
                  <select
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="mechanic">Mecánico</option>
                    <option value="workshop">Taller</option>
                    <option value="towing">Grúa</option>
                    <option value="insurance">Seguro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Comuna</label>
                  <select
                    name="commune"
                    required
                    value={formData.commune}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="santiago">Santiago</option>
                    <option value="las_condes">Las Condes</option>
                    <option value="providencia">Providencia</option>
                    <option value="maipu">Maipú</option>
                    <option value="puente_alto">Puente Alto</option>
                    <option value="la_florida">La Florida</option>
                    <option value="vitacura">Vitacura</option>
                    <option value="nunoa">Ñuñoa</option>
                    <option value="otro">Otra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Años de experiencia</label>
                <select
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="0-1">Menos de 1 año</option>
                  <option value="1-3">1-3 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="5-10">5-10 años</option>
                  <option value="10+">Más de 10 años</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-4 rounded-xl font-black text-xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    🚀 Registrarme gratis
                  </>
                )}
              </button>

              <p className="text-[10px] uppercase tracking-widest text-center text-slate-400 font-bold">
                Al registrarte aceptas nuestros términos y condiciones
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">O contáctanos directamente</p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://wa.me/56983414730" 
                  className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#20bd5a] transition-all shadow-xl shadow-green-100 active:scale-95 group"
                >
                  <span className="text-2xl group-hover:animate-pulse">💬</span> WhatsApp
                </a>
                <a 
                  href="tel:+56983414730" 
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group"
                >
                  <span className="text-2xl group-hover:animate-bounce-subtle">📞</span> Llamar
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}} />

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-white/60 text-sm border-t border-white/10 mt-12">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
          <a href="mailto:contacto@redmecanica.cl" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
            <span>📧</span> contacto@redmecanica.cl
          </a>
          <a href="https://wa.me/56983414730" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors flex items-center gap-2 font-bold">
            <span>💬</span> +56 9 83414730
          </a>
        </div>
        <p>© 2026 RedMecánica. La plataforma de servicios automotrices líder en Chile para prestadores y conductores.</p>
      </footer>
    </div>
    </>
  );
};

export default ProviderLanding;
