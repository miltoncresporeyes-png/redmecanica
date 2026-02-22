
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { localBusinessSchema, webSiteSchema } from '../data/seoSchemas';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Lista amplia de servicios predefinidos
  const predefinedServices = [
    { category: 'Emergencias', items: [
      '🚨 Emergencia - Servicio de Grúa',
      '🔋 Batería Descargada',
      '🛞 Pinchazo de Neumático',
      '🔥 Sobrecalentamiento del Motor'
    ]},
    { category: 'Mantención', items: [
      '🛢️ Cambio de Aceite y Filtros',
      '🔧 Revisión Técnica',
      '⚙️ Afinamiento de Motor',
      '🛞 Rotación y Balanceo de Neumáticos',
      '🔩 Cambio de Pastillas de Freno',
      '💨 Recarga de Aire Acondicionado'
    ]},
    { category: 'Reparaciones', items: [
      '🔧 Reparación de Motor',
      '⚙️ Reparación de Transmisión',
      '🔩 Cambio de Embrague',
      '🛡️ Reparación de Suspensión',
      '💡 Sistema Eléctrico',
      '🔊 Escape y Silenciador'
    ]},
    { category: 'Diagnóstico', items: [
      '📊 Escaneo de Computadora (OBD2)',
      '🔍 Diagnóstico General',
      '⚠️ Revisión de Luz Check Engine',
      '🔧 Inspección Pre-compra'
    ]},
    { category: 'Talleres', items: [
      '🏭 Taller Mecánico General',
      '🔧 Taller de Frenos',
      '🛞 Vulcanización',
      '🎨 Hojalatería y Pintura',
      '💨 Taller de Aire Acondicionado'
    ]}
  ];

  // Filtrar servicios basados en búsqueda
  const filteredServices = serviceQuery.length > 0
    ? predefinedServices.map(category => ({
        category: category.category,
        items: category.items.filter(item => 
          item.toLowerCase().includes(serviceQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : predefinedServices;

  // Datos de comunas (aplanados para búsqueda simple)
  // En una app real, esto se importaría de data/autocompleteData
  const comunas = [
    // Región Metropolitana
    'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 
    'Vitacura', 'Lo Barnechea', 'Macul', 'Peñalolén', 'San Joaquín', 'La Reina', 'Quinta Normal', 
    'Recoleta', 'Independencia', 'Estación Central', 'Pudahuel', 'Quilicura', 'Renca', 
    'Cerro Navia', 'Lo Prado', 'Cerrillos', 'Pedro Aguirre Cerda', 'San Miguel', 'Lo Espejo', 
    'San Ramón', 'La Cisterna', 'La Granja', 'San Bernardo', 'El Bosque', 'Padre Hurtado', 
    'Peñaflor', 'Talagante', 'Melipilla', 'Colina', 'Lampa', 'Quilicura', 'Paine', 'Buin',
    // Valparaíso y alrededores
    'Viña del Mar', 'Valparaíso', 'Quilpué', 'Villa Alemana', 'Concón', 'San Antonio', 
    'Quillota', 'San Felipe', 'Los Andes', 'Limache',
    // Norte
    'Arica', 'Iquique', 'Antofagasta', 'Calama', 'Copiapó', 'La Serena', 'Coquimbo',
    // Centro Sur
    'Rancagua', 'Talca', 'Curicó', 'Chillán', 'Concepción', 'Talcahuano', 'Chiguayante', 
    'San Pedro de la Paz', 'Los Ángeles', 'Temuco', 'Valdivia', 'Osorno', 'Puerto Montt', 
    'Coyhaique', 'Punta Arenas'
  ];

  const filteredLocations = locationQuery.length > 0 
    ? comunas.filter(c => c.toLowerCase().includes(locationQuery.toLowerCase()))
    : comunas;

  // Cerrar sugerencias si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowServiceSuggestions(false);
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectService = (service: string) => {
    setServiceQuery(service);
    setShowServiceSuggestions(false);
  };

  const handleSelectLocation = (location: string) => {
    setLocationQuery(location);
    setShowLocationSuggestions(false);
  };

  const handleSearchClick = () => {
    const type = serviceQuery.toLowerCase().includes('grúa') ? 'TOWING' : undefined;
    let url = `/search?query=${encodeURIComponent(serviceQuery)}&commune=${encodeURIComponent(locationQuery)}`;
    if (type) url += `&type=${type}`;
    navigate(url);
  };

  return (
    <>
      <SEO
        title="RedMecánica - Mecánicos a Domicilio en Chile | Servicios Automotrices"
        description="Conectamos conductores con mecánicos certificados, talleres y grúas. Servicios automotrices a domicilio en Chile. Cotiza gratis y paga seguro con escrow."
        keywords="mecánico a domicilio, taller mecánico Chile, servicios automotrices, grúa 24 horas, reparación de autos, diagnóstico vehicular"
        canonicalUrl="https://redmecanica.cl/"
        schema={[localBusinessSchema, webSiteSchema]}
      />
      <div className="relative">
      {/* Hero Principal */}
      <div className="relative mb-12 group/hero">
        {/* Capa de Fondo (Aísla el redondeado y el recorte) */}
        <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl isolate">
          {/* Imagen de fondo con efecto parallax sutil */}
          <div 
            className="absolute inset-0 -z-20 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover/hero:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop')"
            }}
          />
          
          {/* Overlay de Degradado */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95" />
          
          {/* Luces decorativas */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        </div>

        {/* Capa de Contenido (Sin overflow-hidden para permitir que el dropdown 'flote') */}
        <div className="relative z-20 max-w-4xl mx-auto text-center py-24 px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
            Asistencia Mecánica <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Inteligente</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-50 font-medium leading-[1.8] drop-shadow-md max-w-2xl mx-auto">
            Conectamos conductores con los mejores <span className="text-white font-bold">mecánicos, talleres y grúas</span> de Chile.<br className="hidden md:block"/>
            Servicio rápido, confiable y con precios transparentes.
          </p>

          {/* Barra de búsqueda Dual (Estilo Airbnb/Uber) */}
          <div ref={searchContainerRef} className="relative max-w-4xl mx-auto mb-10">
            <div className="bg-white rounded-full p-2 flex flex-col md:flex-row items-center shadow-2xl transition-all hover:shadow-blue-900/20 border border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Campo Servicio */}
              <div className="relative flex-1 w-full px-6 py-3 cursor-text hover:bg-gray-50 rounded-full transition-colors group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-blue-600">¿Qué necesitas?</label>
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => {
                    setServiceQuery(e.target.value);
                    setShowServiceSuggestions(true);
                  }}
                  onFocus={() => setShowServiceSuggestions(true)}
                  placeholder="Ej: Mecánico, Grúa, Batería..."
                  className="w-full text-gray-800 text-lg font-semibold outline-none bg-transparent placeholder-gray-300"
                />
                
                {/* Sugerencias Servicio */}
                {showServiceSuggestions && (
                  <div className="absolute top-full left-0 mt-4 w-full md:w-[350px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredServices.map((category, idx) => (
                        <div key={idx} className="border-b border-gray-50 last:border-b-0">
                          <div className="px-5 py-2 bg-gray-50/50 font-bold text-xs text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm">
                            {category.category}
                          </div>
                          {category.items.map((service, serviceIdx) => (
                            <button
                              key={serviceIdx}
                              onClick={() => handleSelectService(service)}
                              className="w-full text-left px-5 py-3 hover:bg-blue-50/80 transition-colors text-gray-700 hover:text-blue-900 font-semibold flex items-center group/item text-sm active:bg-blue-100"
                            >
                              <span className="opacity-0 group-hover/item:opacity-100 -ml-3 mr-2 text-blue-600 transition-all duration-300">➜</span>
                              {service.replace(/^[^\s]+\s/, '')} {/* Remove emoji for cleaner list if needed, or keep it */}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Campo Ubicación */}
              <div className="relative flex-1 w-full px-6 py-3 cursor-text hover:bg-gray-50 rounded-full transition-colors group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5 group-hover:text-blue-600">¿Dónde estás?</label>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="Comuna o Región"
                  className="w-full text-gray-800 text-lg font-semibold outline-none bg-transparent placeholder-gray-300"
                />

                {/* Sugerencias Ubicación */}
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 mt-4 w-full md:w-[300px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Sugerencias</div>
                      {filteredLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50/80 rounded-xl transition-colors text-gray-700 hover:text-blue-900 font-semibold flex items-center gap-3 active:bg-blue-100"
                        >
                          <span className="text-gray-400 w-5 h-5">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                          </span>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Buscar */}
              <div className="p-2 w-full md:w-auto">
                <button 
                  onClick={handleSearchClick}
                  className="w-full md:w-auto bg-blue-600 text-white p-4 md:px-8 md:py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </span>
                  <span className="md:hidden">Buscar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          {/* Acciones Secundarias Limpias */}
          <div className="flex flex-col items-center gap-6">
            
            <button 
              onClick={() => navigate('/triage')}
              className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-8 py-3 rounded-full text-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-yellow-400/30 flex items-center hover:-translate-y-0.5"
            >
              <span className="mr-2 text-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-1.947a2.42 2.42 0 0 1 .783-1.786l2.71-2.684a2.25 2.25 0 0 0 0-3.136l-2.713-2.686A2.42 2.42 0 0 1 12 3.864V2M12 2v1.947a2.42 2.42 0 0 0-.783 1.786l-2.71 2.684a2.25 2.25 0 0 1 0 3.136l2.713 2.686A2.42 2.42 0 0 0 12 16.053V18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 4.5h3" />
                </svg>
              </span> 
              <span>¿No sabes qué tiene tu auto? <span className="underline decoration-blue-900/30 underline-offset-2">Auto-Diagnóstico</span></span>
              <span className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">➜</span>
            </button>

            {/* Enlace Sutil - Cómo funciona */}
            <button 
              onClick={() => navigate('/how-it-works')}
              className="text-blue-200 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 hover:underline underline-offset-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Entiende cómo funciona RedMecánica
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          { 
            icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>, 
            title: 'Mecánicos Certificados', 
            desc: 'Profesionales verificados a tu ubicación' 
          },
          { 
            icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>, 
            title: 'Respuesta Rápida', 
            desc: 'Atención en menos de 15 minutos' 
          },
          { 
            icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, 
            title: 'Precios Justos', 
            desc: 'Sin sorpresas, cotización previa' 
          },
          { 
            icon: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>, 
            title: '100% Seguro', 
            desc: 'Prestadores con seguro y garantía' 
          }
        ].map((f, idx) => (
          <button 
            key={idx}
            onClick={() => navigate('/search')}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 block w-full group"
          >
            <div className="text-blue-600 mb-4 flex justify-center group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default Hero;