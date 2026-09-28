import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import SEO from './SEO';
import { localBusinessSchema, webSiteSchema } from '../data/seoSchemas';
import { MARKETPLACE_CATEGORIES, POPULAR_COMUNAS, normalizeText } from '../data/marketplace';
import { COMUNAS_POR_REGION } from '../data/autocompleteData';

const ALL_COMUNAS: string[] = Array.from(
  new Set(Object.values(COMUNAS_POR_REGION).flat())
).sort((a, b) => a.localeCompare(b, 'es'));

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredCategories = useMemo(() => {
    const q = normalizeText(serviceQuery);
    if (!q) return MARKETPLACE_CATEGORIES;
    return MARKETPLACE_CATEGORIES.filter((c) =>
      normalizeText(`${c.label} ${c.plural} ${c.keywords.join(' ')}`).includes(q)
    );
  }, [serviceQuery]);

  const filteredLocations = useMemo(() => {
    const q = normalizeText(locationQuery);
    if (!q) return ALL_COMUNAS.slice(0, 12);
    return ALL_COMUNAS.filter((c) => normalizeText(c).includes(q)).slice(0, 12);
  }, [locationQuery]);

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

  const handleSelectCategory = (slug: string, label: string) => {
    setSelectedCategory(slug);
    setServiceQuery(label);
    setShowServiceSuggestions(false);
  };

  const handleSelectLocation = (location: string) => {
    setLocationQuery(location);
    setShowLocationSuggestions(false);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (serviceQuery && !selectedCategory) params.set('query', serviceQuery);
    if (serviceQuery && selectedCategory) params.set('query', serviceQuery);
    if (locationQuery) params.set('commune', locationQuery);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategoryCard = (slug: string) => {
    navigate(`/search?category=${encodeURIComponent(slug)}${locationQuery ? `&commune=${encodeURIComponent(locationQuery)}` : ''}`);
  };

  return (
    <>
      <SEO
        title="RedMecánica — Marketplace automotriz de Chile | Busca prestadores en tu comuna gratis"
        description="Directorio gratuito de prestadores automotrices en Chile: mecánicos, talleres, grúas, vulcanizaciones, electricidad, hojalatería y más. Busca por comuna, compara perfiles y contacta directo por WhatsApp. Sin cuenta, sin costo."
        keywords="marketplace automotriz Chile, buscar mecánico por comuna, talleres en mi comuna, grúas Chile, vulcanización, eléctrico automotriz, directorio automotriz gratuito"
        canonicalUrl="https://redmecanica.cl/"
        schema={[localBusinessSchema, webSiteSchema]}
      />
      <div className="relative">
        {/* Hero Principal — Marketplace */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg isolate">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/85 to-slate-900/95" />
            <div className="absolute top-0 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -z-10" />
          </div>

          <div className="relative z-20 max-w-3xl mx-auto text-center py-8 sm:py-10 md:py-12 px-4 text-white">
            <p className="inline-flex items-center gap-2 bg-emerald-400/15 text-emerald-300 border border-emerald-300/20 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
              MARKETPLACE · BÚSQUEDA 100% GRATUITA · SIN CUENTA
            </p>
            <h1 className="mb-2 text-white">
              Prestadores automotrices{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                en tu comuna
              </span>
            </h1>

            <p className="mb-5 text-blue-50/90 text-sm sm:text-base max-w-xl mx-auto">
              El directorio donde <span className="text-white font-semibold">talleres, mecánicos, grúas, vulcas y más</span> promocionan
              sus servicios. Tú buscas gratis, comparas y contactas directo.
            </p>

            {/* Barra de búsqueda Servicio + Comuna */}
            <div ref={searchContainerRef} className="relative max-w-2xl mx-auto mb-4">
              <div className="bg-white rounded-xl p-1 flex flex-col sm:flex-row items-center shadow-lg border border-gray-100 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                {/* Campo Servicio / Categoría */}
                <div className="relative flex-1 w-full px-3 py-2 cursor-text hover:bg-gray-50 rounded-xl transition-colors group">
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => {
                      setServiceQuery(e.target.value);
                      setSelectedCategory('');
                      setShowServiceSuggestions(true);
                    }}
                    onFocus={() => setShowServiceSuggestions(true)}
                    placeholder="¿Qué buscas? Ej: vulcanización, grúa, frenos…"
                    className="w-full text-gray-800 font-medium outline-none bg-transparent placeholder-gray-400 text-sm"
                    aria-label="Buscar servicio automotriz"
                  />

                  {showServiceSuggestions && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50 border border-gray-100 text-left">
                      <div className="max-h-[260px] overflow-y-auto p-1">
                        <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Categorías</div>
                        {filteredCategories.length === 0 && (
                          <p className="px-3 py-2 text-sm text-gray-500">Sin coincidencias. Prueba con “mecánico” o “grúa”.</p>
                        )}
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => handleSelectCategory(cat.slug, cat.label)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50/80 rounded-lg transition-colors text-gray-700 hover:text-blue-900 font-medium text-sm flex items-center gap-2"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span>
                              <span className="block font-semibold">{cat.label}</span>
                              <span className="block text-xs text-gray-400 font-normal">{cat.shortDesc}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Campo Comuna */}
                <div className="relative flex-1 w-full px-3 py-2 cursor-text hover:bg-gray-50 rounded-xl transition-colors group">
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    placeholder="¿En qué comuna? Ej: Maipú"
                    className="w-full text-gray-800 font-medium outline-none bg-transparent placeholder-gray-400 text-sm"
                    aria-label="Buscar por comuna"
                  />

                  {showLocationSuggestions && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-[280px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50 border border-gray-100 text-left">
                      <div className="max-h-[260px] overflow-y-auto p-1">
                        <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Comunas</div>
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
                    className="btn-primary w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <span>Buscar gratis</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comunas populares */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              <span className="text-xs text-blue-100/70 font-medium">Populares:</span>
              {POPULAR_COMUNAS.slice(0, 6).map((comuna) => (
                <button
                  key={comuna}
                  onClick={() => navigate(`/search?commune=${encodeURIComponent(comuna)}`)}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/15 text-white px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  {comuna}
                </button>
              ))}
            </div>

            {/* Botones de acción marketplace */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/search')}
                className="btn-accent w-full sm:w-auto"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Explorar directorio
              </button>

              <button
                onClick={() => navigate('/unete')}
                className="btn-ghost-light w-full sm:w-auto"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Publica tus servicios gratis
              </button>
            </div>
          </div>
        </div>

        {/* Categorías del marketplace */}
        <div className="mb-6 sm:mb-8 max-w-6xl mx-auto px-1 sm:px-0">
          <div className="section-head flex items-end justify-between gap-2">
            <div>
              <h2 className="section-title">Explora por categoría</h2>
              <p className="section-sub">Toca una categoría para ver prestadores. Sin cuenta, sin costo.</p>
            </div>
            <button onClick={() => navigate('/search')} className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 shrink-0 min-h-[44px] px-2">
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryCard(cat.slug)}
                className="card-market text-left p-3.5 sm:p-4 hover:-translate-y-0.5 group min-h-[110px]"
              >
                <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform inline-block" aria-hidden>{cat.icon}</span>
                <span className="font-bold text-gray-900 text-xs sm:text-sm block leading-tight">{cat.label}</span>
                <span className="text-gray-400 text-[11px] sm:text-xs block mt-0.5 line-clamp-2">{cat.shortDesc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pilares marketplace */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-6xl mx-auto px-1 sm:px-0">
          {[
            {
              icon: '🔍',
              title: 'Búsqueda gratuita',
              desc: 'Busca por comuna y categoría sin pagar ni registrarte',
            },
            {
              icon: '📍',
              title: 'Cerca de ti',
              desc: 'Prestadores ordenados por tu comuna primero',
            },
            {
              icon: '💬',
              title: 'Contacto directo',
              desc: 'WhatsApp y teléfono visibles, sin intermediarios',
            },
            {
              icon: '⭐',
              title: 'Perfiles con reseñas',
              desc: 'Compara reputación, servicios y cobertura',
            },
          ].map((f, idx) => (
            <div
              key={idx}
              className="text-center p-3.5 sm:p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg w-full min-h-[110px]"
            >
              <div className="text-2xl mb-1.5" aria-hidden>{f.icon}</div>
              <span className="font-bold mb-1 text-white tracking-tight text-xs sm:text-sm block">{f.title}</span>
              <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs line-clamp-2">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Banner prestadores */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-2xl" aria-hidden />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl" aria-hidden />
          <div className="relative z-10 px-5 sm:px-10 py-7 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center md:text-left">
              <p className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
                PARA PRESTADORES · VITRINA GRATUITA
              </p>
              <h2 className="font-heading text-xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                ¿Tienes taller, vulca o grúa? <span className="text-yellow-300">Promociona tus servicios</span>
              </h2>
              <p className="text-blue-100 text-xs sm:text-base max-w-lg leading-relaxed">
                Crea tu perfil público con tus servicios, comuna de cobertura y contacto directo.
                Los conductores te encuentran gratis en el directorio.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => navigate('/unete')}
                className="btn-accent w-full sm:w-auto"
              >
                Publicar mi negocio
              </button>
              <button
                onClick={() => navigate('/benefits')}
                className="btn-ghost-light w-full sm:w-auto"
              >
                Ver beneficios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
