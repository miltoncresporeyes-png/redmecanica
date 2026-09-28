import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Card from '../../components/common/Card';
import ProviderCard from './ProviderCard';
import AdBanner from '../../components/common/AdBanner';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { REGIONES, COMUNAS_POR_REGION } from '../../data/autocompleteData';
import { MARKETPLACE_CATEGORIES, getCategoryBySlug, normalizeText } from '../../data/marketplace';
import { searchNearbyProviders, geocodeAddress } from '../../services/api';

const ALL_COMUNAS: string[] = Array.from(
  new Set(Object.values(COMUNAS_POR_REGION).flat())
).sort((a, b) => a.localeCompare(b, 'es'));

const ProviderSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultadosRef = useRef<HTMLDivElement>(null);

  const categorySlug = searchParams.get('category') || '';
  const activeCategory = getCategoryBySlug(categorySlug);

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    commune: searchParams.get('commune') || '',
    category: categorySlug,
    type: searchParams.get('type') || '',
    certified: searchParams.get('certified') === 'true',
    radius: searchParams.get('radius') || '15',
    query: searchParams.get('query') || ''
  });
  const [results, setResults] = useState<any[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const comunasSugeridas = useMemo(() => {
    if (filters.region && COMUNAS_POR_REGION[filters.region]) {
      return COMUNAS_POR_REGION[filters.region];
    }
    return ALL_COMUNAS;
  }, [filters.region]);

  const resolveServiceType = useCallback((catSlug: string, legacyType: string) => {
    const cat = getCategoryBySlug(catSlug);
    if (cat?.backendType) return cat.backendType;
    if (legacyType && ['MECHANIC', 'WORKSHOP', 'TOWING', 'INSURANCE'].includes(legacyType)) return legacyType;
    return undefined;
  }, []);

  const handleSearch = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setSearched(true);
    try {
      let lat = userLocation?.lat ?? -33.4489;
      let lng = userLocation?.lng ?? -70.6693;

      if (currentFilters.commune) {
        try {
          const location = await geocodeAddress(`${currentFilters.commune}, ${currentFilters.region || 'Chile'}`);
          if (location) {
            lat = location.lat;
            lng = location.lng;
          }
        } catch {
          // fallback a ubicación por defecto
        }
      }

      const serviceType = resolveServiceType(currentFilters.category, currentFilters.type);

      const response = await searchNearbyProviders({
        lat: Number(lat),
        lng: Number(lng),
        radiusKm: parseInt(currentFilters.radius) || 15,
        ...(serviceType ? { serviceType: serviceType as 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE' } : {}),
      });

      let providers = (response.providers || []).filter((p: any) => p.status === 'ACTIVE' || p.status === 'APPROVED');

      // Filtro local marketplace: comuna + categoría + texto libre
      const communeNorm = normalizeText(currentFilters.commune);
      const queryNorm = normalizeText(currentFilters.query);
      const cat = getCategoryBySlug(currentFilters.category);
      const catKeywords = (cat?.keywords || []).map(normalizeText);

      const scored = providers.map((p: any) => {
        const pCommune = normalizeText(p.commune);
        const pBio = normalizeText(`${p.businessName || ''} ${p.specialties || ''} ${p.specialty || ''} ${p.bio || ''}`);
        let score = 0;

        // Comuna exacta primero
        if (communeNorm) {
          if (pCommune === communeNorm) score += 100;
          else if (pCommune.includes(communeNorm) || communeNorm.includes(pCommune)) score += 60;
          else if (pCommune) score -= 20;
        }

        // Categoría por keywords
        if (cat && catKeywords.length > 0) {
          const hit = catKeywords.some((k) => k && pBio.includes(k));
          if (hit) score += 40;
        }

        // Texto libre
        if (queryNorm) {
          const tokens = queryNorm.split(/\s+/).filter((t) => t.length > 2);
          const hits = tokens.filter((t) => pBio.includes(t)).length;
          score += hits * 15;
          // si no matchea nada del query y hay query, penalizar
          if (tokens.length > 0 && hits === 0) score -= 50;
        }

        if (p.isVerified || p.emailVerified) score += 10;
        score += Math.min(p.rating || 0, 5);

        return { p, score };
      });

      // Si hay comuna o query/categoría, exigir un mínimo de relevancia; si no, mostrar todo ordenado
      const hasIntent = Boolean(communeNorm || queryNorm || currentFilters.category);
      let filtered = scored
        .filter(({ score }) => (hasIntent ? score > 0 : true))
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p);

      if (currentFilters.certified) {
        filtered = filtered.filter((p: any) => p.isVerified || p.emailVerified || (p.trustScore || 0) > 70);
      }

      setTotalFound(providers.length);
      setResults(filtered);
    } catch (error) {
      console.error('Error searching providers:', error);
      setResults([]);
      setTotalFound(0);
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation, resolveServiceType]);

  // Sincronizar URL -> filtros -> búsqueda automática
  useEffect(() => {
    const next = {
      region: searchParams.get('region') || '',
      commune: searchParams.get('commune') || '',
      category: searchParams.get('category') || '',
      type: searchParams.get('type') || '',
      certified: searchParams.get('certified') === 'true',
      radius: searchParams.get('radius') || '15',
      query: searchParams.get('query') || ''
    };
    setFilters(next);
    handleSearch(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (results.length > 0 && !loading && searched) {
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [results, loading, searched]);

  const updateUrl = (next = filters) => {
    const params = new URLSearchParams();
    if (next.query) params.set('query', next.query);
    if (next.commune) params.set('commune', next.commune);
    if (next.region) params.set('region', next.region);
    if (next.category) params.set('category', next.category);
    if (next.type) params.set('type', next.type);
    if (next.certified) params.set('certified', 'true');
    if (next.radius && next.radius !== '15') params.set('radius', next.radius);
    setSearchParams(params, { replace: true });
  };

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    updateUrl();
    handleSearch();
  };

  const clearFilters = () => {
    const cleared = { region: '', commune: '', category: '', type: '', certified: false, radius: '15', query: '' };
    setFilters(cleared);
    setSearchParams({}, { replace: true });
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="section-head text-center sm:text-left">
        <p className="badge-free mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
          DIRECTORIO GRATUITO · SIN CUENTA · CONTACTO DIRECTO
        </p>
        <h1 className="text-gray-900">
          {activeCategory ? `${activeCategory.plural}` : 'Directorio de prestadores automotrices'}
          {filters.commune && <span className="text-blue-600"> en {filters.commune}</span>}
        </h1>
        <p className="section-sub mt-1">
          Busca por <strong>comuna y categoría</strong>, compara perfiles y contacta por WhatsApp sin intermediarios.
          {totalFound > 0 && searched && ` · ${results.length} resultado${results.length === 1 ? '' : 's'} en tu zona.`}
        </p>
      </div>

      <Card className="card-market p-4 sm:p-6 mb-5 sm:mb-6">
        <form onSubmit={onSubmit}>
          {/* Buscador principal: qué + dónde */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-2 sm:gap-3 mb-4">
            <div>
              <label htmlFor="search-query" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">¿Qué necesitas?</label>
              <input
                id="search-query"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Ej: cambio de aceite, pinchazo, grúa, frenos…"
                className="input-market"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Comuna</label>
              <AutocompleteInput
                value={filters.commune}
                onChange={(value) => setFilters({ ...filters, commune: value })}
                suggestions={comunasSugeridas}
                placeholder="Ej: Maipú, Las Condes, Temuco…"
                className="input-market"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto"
              >
                {loading ? 'Buscando…' : '🔍 Buscar gratis'}
              </button>
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categoría</label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: '', type: '' })}
                className={`chip ${!filters.category && !filters.type ? 'chip-active' : 'chip-idle'}`}
                aria-pressed={!filters.category && !filters.type}
              >
                Todas
              </button>
              {MARKETPLACE_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setFilters({ ...filters, category: cat.slug, type: '' })}
                  className={`chip ${filters.category === cat.slug ? 'chip-active' : 'chip-idle'}`}
                  title={cat.shortDesc}
                  aria-pressed={filters.category === cat.slug}
                >
                  <span aria-hidden>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros secundarios */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Región</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value, commune: '' })}
                className="input-market bg-gray-50"
              >
                <option value="">Todas</option>
                {REGIONES.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo (clásico)</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value, category: '' })}
                className="input-market bg-gray-50"
              >
                <option value="">Todos</option>
                <option value="MECHANIC">Mecánico</option>
                <option value="WORKSHOP">Taller</option>
                <option value="TOWING">Grúa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Radio</label>
              <select
                value={filters.radius}
                onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
                className="input-market bg-gray-50"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="15">15 km</option>
                <option value="30">30 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-3 min-h-[44px]">
              <input
                type="checkbox"
                checked={filters.certified}
                onChange={(e) => setFilters({ ...filters, certified: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span><span className="badge-verified mr-1 !px-1.5">✓</span>Solo verificados</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              💡 Tip: escribe tu <strong>comuna</strong> para ordenar prestadores cercanos primero. No necesitas crear cuenta.
            </p>
            <div className="flex gap-1">
              <button type="button" onClick={clearFilters} className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 min-h-[44px]">
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    );
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 min-h-[44px]"
              >
                📍 Usar mi ubicación
              </button>
            </div>
          </div>
        </form>
      </Card>

      <div ref={resultadosRef} className="space-y-3 sm:space-y-4" aria-live="polite">
        {!searched && results.length === 0 && !loading && (
          <div className="card-market text-center p-8 sm:p-10 border-dashed">
            <div className="text-4xl mb-2" aria-hidden>🔍</div>
            <p className="font-bold text-gray-800">Busca prestadores en tu comuna</p>
            <p className="section-sub mt-1 mb-4">Es gratis y sin cuenta. Prueba con tu comuna + una categoría.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Maipú', 'Puente Alto', 'Temuco', 'Viña del Mar'].map((c) => (
                <button key={c} onClick={() => navigate(`/search?commune=${encodeURIComponent(c)}`)} className="chip chip-idle">
                  📍 {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {loading && (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" aria-hidden />
            <p className="text-sm text-gray-500 font-medium">Buscando prestadores en tu zona…</p>
          </div>
        )}
        {searched && !loading && results.length === 0 && (
          <div className="card-market text-center p-8 sm:p-10">
            <div className="text-4xl mb-2" aria-hidden>📭</div>
            <p className="font-bold text-gray-800">Aún no hay prestadores publicados{filters.commune ? ` en ${filters.commune}` : ''}</p>
            <p className="section-sub mt-1 mb-4">
              Prueba ampliando el radio, quitando filtros o buscando en una comuna cercana.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Ver todos los prestadores
            </button>
          </div>
        )}
        {results.map((provider, index) => (
          <React.Fragment key={provider.id}>
            <ProviderCard provider={provider} onSelect={(p) => navigate(`/proveedor/${p.id}`)} />
            {(index + 1) % 4 === 3 && <AdBanner className="my-4" />}
          </React.Fragment>
        ))}
      </div>

      {/* CTA prestadores */}
      <div className="mt-6 sm:mt-8 bg-slate-900 rounded-2xl p-6 text-center text-white">
        <p className="font-extrabold">¿Eres prestador automotriz{filters.commune ? ` en ${filters.commune}` : ''}?</p>
        <p className="text-sm text-slate-300 mt-1 mb-4">Publica tus servicios gratis y aparece en este directorio cuando busquen en tu comuna.</p>
        <button onClick={() => navigate('/unete')} className="btn-accent">
          Publicar mi negocio gratis
        </button>
      </div>
    </div>
  );
};

export default ProviderSearch;
