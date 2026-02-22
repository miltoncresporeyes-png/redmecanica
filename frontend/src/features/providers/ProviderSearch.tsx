import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import ProviderCard from './ProviderCard';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { REGIONES, COMUNAS_POR_REGION } from '../../data/autocompleteData';
import api from '../../lib/http';
import { searchNearbyProviders, geocodeAddress } from '../../services/api';

const ProviderSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultadosRef = useRef<HTMLDivElement>(null);

  const isEmergency = searchParams.get('emergency') === 'true';

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    commune: searchParams.get('commune') || '',
    type: isEmergency ? 'TOWING' : searchParams.get('type') || '',
    certified: searchParams.get('certified') === 'true',
    radius: '10',
    query: searchParams.get('query') || ''
  });
  const [results, setResults] = useState<any[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
   
  const specialtyOptions = [
    'Mecánica General', 'Electricidad / Electrónica', 'Frenos y Suspensión', 
    'Auxilio y Grúa', 'Hojalatería y Pintura', 'Aire Acondicionado', 'Alineación y Balanceo'
  ];

  // Obtener ubicación del usuario al cargar (solo si no hay error previo)
  useEffect(() => {
    if (navigator.geolocation && !locationError) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Permiso de ubicación denegado. Puedes buscar sin ubicación automática.');
          }
        },
        { maximumAge: 300000 } // Cache location for 5 minutes
      );
    }
  }, [locationError]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Permiso de ubicación denegado.');
          }
        }
      );
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  // Sync with URL params and trigger search
  React.useEffect(() => {
    const emergencyType = searchParams.get('emergency') === 'true' ? 'TOWING' : '';
    const newFilters = {
      region: searchParams.get('region') || '',
      commune: searchParams.get('commune') || '',
      type: emergencyType || searchParams.get('type') || '',
      certified: searchParams.get('certified') === 'true',
      radius: '10',
      query: searchParams.get('query') || ''
    };
    
    setFilters(newFilters);

    if (newFilters.type || newFilters.certified || newFilters.region || newFilters.commune || newFilters.query || searchParams.get('emergency') === 'true') {
       handleSearch(newFilters);
       setTimeout(() => {
         window.scrollTo({ top: 0, behavior: 'smooth' });
       }, 100);
    }
  }, [searchParams]);

  // Scroll a los resultados cuando estos cambian y no está cargando
  React.useEffect(() => {
    if (results.length > 0 && !loading) {
      // Esperar un momento para que el DOM se actualice
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [results, loading]);

  // Obtener comunas según la región seleccionada
  const comunasSugeridas = useMemo(() => {
    if (filters.region && COMUNAS_POR_REGION[filters.region]) {
      return COMUNAS_POR_REGION[filters.region];
    }
    // Si no hay región seleccionada, mostrar todas las comunas
    return Object.values(COMUNAS_POR_REGION).flat() || [];
  }, [filters.region]);

  const handleSearch = async (currentFilters = filters) => {
    setLoading(true);
    setResults([]);
    
    try {
      // Usar ubicación del usuario si está disponible, si no Santiago
      let lat = userLocation?.lat ?? -33.4489;
      let lng = userLocation?.lng ?? -70.6693;
      
      // Validar que lat y lng sean números válidos
      if (isNaN(lat) || isNaN(lng) || lat === undefined || lng === undefined) {
        lat = -33.4489;
        lng = -70.6693;
      }
      
      // Si hay comuna, intentar geocodificar
      if (currentFilters.commune) {
        const location = await geocodeAddress(`${currentFilters.commune}, ${currentFilters.region || 'Chile'}`);
        if (location) {
          lat = location.lat;
          lng = location.lng;
        }
      }

      // Usar el nuevo endpoint de geolocalización
      const searchParams: {
        lat: number;
        lng: number;
        radiusKm: number;
        serviceType?: 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
        availableNow?: boolean;
      } = {
        lat: Number(lat),
        lng: Number(lng),
        radiusKm: parseInt(currentFilters.radius) || 15,
      };
      
      // Solo incluir serviceType si tiene un valor válido
      if (currentFilters.type && ['MECHANIC', 'WORKSHOP', 'TOWING', 'INSURANCE'].includes(currentFilters.type)) {
        searchParams.serviceType = currentFilters.type as 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
      }
      
      // En modo emergencia, buscar solo Prestadores disponibles ahora
      if (isEmergency) {
        searchParams.availableNow = true;
      }
      
      const response = await searchNearbyProviders(searchParams);

      let providers = response.providers || [];
      
      // IMPORTANTE: Solo mostrar Prestadores ACTIVOS
      providers = providers.filter((p: any) => p.status === 'ACTIVE');
      
      setResults(providers);
      
    } catch (error) {
      console.error('Error searching providers:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {isEmergency && (
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-center gap-3">
          <span className="text-2xl">🚨</span>
          <div className="text-center">
            <p className="font-bold text-lg">Emergencias 24/7 - Servicio de Grúa</p>
            <p className="text-sm text-red-100">Conectando con Prestadores disponibles cerca de ti...</p>
          </div>
          <span className="text-2xl">🚨</span>
        </div>
      )}
      <Card className={`p-6 mb-6 ${isEmergency ? 'rounded-t-none' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEmergency ? '🚨 Solicitar Grúa de Emergencia' : 'Buscar Prestadores'}
            </h2>
            {filters.type && !isEmergency && (
              <p className="text-sm text-blue-600 mt-1">
                📍 Filtro activo: {
                  filters.type === 'WORKSHOP' ? 'Talleres certificados' :
                  filters.type === 'TOWING' ? 'Servicios de grúa' :
                  filters.type === 'MECHANIC' ? 'Mecánicos' :
                  filters.type
                }
              </p>
            )}
          </div>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value, commune: '' })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {REGIONES.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
            <AutocompleteInput
              value={filters.commune}
              onChange={(value) => setFilters({ ...filters, commune: value })}
              suggestions={comunasSugeridas}
              placeholder="Ej: Las Condes"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="MECHANIC">Mecánico</option>
              <option value="WORKSHOP">Taller</option>
              <option value="TOWING">Grúa</option>
              <option value="INSURANCE">Aseguradora</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Radio (km)</label>
            <select
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            id="certified-check"
            type="checkbox"
            checked={filters.certified}
            onChange={(e) => setFilters({ ...filters, certified: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mr-2"
          />
          <label htmlFor="certified-check" className="text-sm font-bold text-gray-700 select-none cursor-pointer flex items-center">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full mr-2">VERIFICADO</span>
            Solo mostrar Prestadores certificados
          </label>
        </div>

        {locationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-center justify-between">
            <span>📍 {locationError}</span>
            <button 
              onClick={requestLocation}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Habilitar
            </button>
          </div>
        )}

        {!locationError && !userLocation && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center justify-between">
            <span>📍 ¿Usar tu ubicación actual?</span>
            <button 
              onClick={requestLocation}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sí, usar mi ubicación
            </button>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades (selecciona una o más)</label>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map(spec => (
              <button
                key={spec}
                onClick={() => toggleSpecialty(spec)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedSpecialties.includes(spec)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                {selectedSpecialties.includes(spec) && <span className="mr-1">✓</span>}
                {spec}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Buscando...' : '🔍 Buscar Prestadores'}
        </button>
      </Card>

      <div ref={resultadosRef} className="space-y-4">
        {results.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-10">
            No hay resultados. Intenta ajustar los filtros.
          </p>
        )}
        {results.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
};

export default ProviderSearch;
