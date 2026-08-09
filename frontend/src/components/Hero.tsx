
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
      <div className="relative mb-6 sm:mb-8">
        {/* Capa de Fondo */}
        <div className="absolute inset-0 bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg isolate">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/85 to-slate-900/95" />
          <div className="absolute top-0 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -z-10" />
        </div>

        {/* Capa de Contenido */}
        <div className="relative z-20 max-w-3xl mx-auto text-center py-8 sm:py-10 md:py-12 px-4 text-white">
          {/* Título H1 */}
          <h1 className="font-black mb-2 tracking-tight leading-tight text-2xl sm:text-3xl md:text-4xl">
            Mecánicos en Santiago y Regiones{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              cerca de ti
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="mb-5 text-blue-50/90 text-sm sm:text-base max-w-xl mx-auto">
            Conectamos conductores con{' '}
            <span className="text-white font-semibold">mecánicos, talleres y grúas</span>{' '}
            de Chile. Servicio rápido, confiable y precios transparentes.
          </p>

          {/* Barra de búsqueda Dual */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto mb-5">
            <div className="bg-white rounded-xl p-1 flex flex-col sm:flex-row items-center shadow-lg border border-gray-100 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              
              {/* Campo Servicio */}
              <div className="relative flex-1 w-full px-3 py-2 cursor-text hover:bg-gray-50 rounded-xl transition-colors group">
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => {
                    setServiceQuery(e.target.value);
                    setShowServiceSuggestions(true);
                  }}
                  onFocus={() => setShowServiceSuggestions(true)}
                  placeholder="¿Qué necesitas? Ej: Mecánico, Grúa..."
                  className="w-full text-gray-800 font-medium outline-none bg-transparent placeholder-gray-400 text-sm"
                />
                
                {/* Sugerencias Servicio */}
                {showServiceSuggestions && (
                  <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50 border border-gray-100">
                    <div className="max-h-[260px] overflow-y-auto">
                      {filteredServices.map((category, idx) => (
                        <div key={idx} className="border-b border-gray-50 last:border-b-0">
                          <div className="px-4 py-1.5 bg-gray-50 font-bold text-xs text-gray-400 uppercase tracking-wider sticky top-0">
                            {category.category}
                          </div>
                          {category.items.map((service, serviceIdx) => (
                            <button
                              key={serviceIdx}
                              onClick={() => handleSelectService(service)}
                              className="w-full text-left px-4 py-2 hover:bg-blue-50/80 transition-colors text-gray-700 hover:text-blue-900 font-medium text-sm flex items-center"
                            >
                              {service.replace(/^[^\s]+\s/, '')}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Campo Ubicación */}
              <div className="relative flex-1 w-full px-3 py-2 cursor-text hover:bg-gray-50 rounded-xl transition-colors group">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="¿Dónde estás? Comuna o Región"
                  className="w-full text-gray-800 font-medium outline-none bg-transparent placeholder-gray-400 text-sm"
                />

                {/* Sugerencias Ubicación */}
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 mt-2 w-full sm:w-[280px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50 border border-gray-100">
                    <div className="max-h-[260px] overflow-y-auto p-1">
                      <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Sugerencias</div>
                      {filteredLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50/80 rounded-lg transition-colors text-gray-700 hover:text-blue-900 font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Buscar */}
              <div className="p-1 w-full sm:w-auto">
                <button 
                  onClick={handleSearchClick}
                  className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <span>Buscar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => navigate('/triage')}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 px-6 py-3 rounded-xl font-extrabold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-md text-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-1.947a2.42 2.42 0 0 1 .783-1.786l2.71-2.684a2.25 2.25 0 0 0 0-3.136l-2.713-2.686A2.42 2.42 0 0 1 12 3.864V2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" />
              </svg>
              Auto-Diagnóstico Gratuito
            </button>

            <button 
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto text-blue-100 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl border border-white/10 sm:border-transparent hover:bg-white/5"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ¿Cómo funciona?
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-1 sm:px-0">
        {[
          { 
            icon: <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>, 
            title: 'Mecánicos Certificados', 
            desc: 'Profesionales verificados en terreno',
          },
          { 
            icon: <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>, 
            title: 'Respuesta Rápida', 
            desc: 'Grúas y auxilio en 15 minutos',
          },
          { 
            icon: <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>, 
            title: 'Precios Justos', 
            desc: 'Sin sorpresas, cotización cerrada',
          },
          { 
            icon: <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>, 
            title: '100% Seguro', 
            desc: 'Garantía con depósito protegido',
          }
        ].map((f, idx) => (
          <button 
            key={idx}
            onClick={() => navigate('/search')}
            className="text-center p-3.5 sm:p-5 md:p-6 bg-carbon-fiber text-white rounded-xl sm:rounded-2xl border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block w-full group min-h-[110px] sm:min-h-[140px]"
          >
            <div className="text-yellow-400 mb-2 sm:mb-3 flex justify-center group-hover:scale-110 transition-transform">{f.icon}</div>
            <span className="font-bold mb-1 text-white tracking-tight text-xs sm:text-base block">{f.title}</span>
            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs line-clamp-2">{f.desc}</p>
          </button>
        ))}
      </div>

      {/* Launch Offer */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl" />
        <div className="relative z-10 px-5 sm:px-10 py-7 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
              LANZAMIENTO 2026
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              Primer servicio con <span className="text-yellow-300">20% dcto</span>
            </h2>
            <p className="text-blue-100 text-xs sm:text-base max-w-lg leading-relaxed">
              Los primeros 100 conductores en registrarse obtienen descuento exclusivo de lanzamiento. 
              Sin compromiso, paga solo cuando recibas el servicio.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigate('/solicitar')}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-6 py-3 rounded-xl font-extrabold shadow-lg hover:shadow-yellow-400/30 transition-all text-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Solicitar Servicio
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full sm:w-auto border border-white/30 hover:border-white/50 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm hover:bg-white/10 min-h-[44px] flex items-center justify-center"
            >
              Soy mecánico
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Hero;
