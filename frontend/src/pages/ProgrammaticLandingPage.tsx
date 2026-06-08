import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO_SERVICES, SEO_COMMUNES } from '../data/communesData';
import { searchNearbyProviders } from '../services/api';
import ProviderCard from '../features/providers/ProviderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

const ProgrammaticLandingPage: React.FC = () => {
  const { seoSlug } = useParams<{ seoSlug: string }>();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCertified, setFilterCertified] = useState(false);

  // 1. Validar y parsear el slug (ej: grua-en-maipu o mecanico-en-santiago)
  const parseSlug = (slug: string | undefined) => {
    if (!slug) return null;
    const match = slug.match(/^([a-z-]+)-en-([a-z-]+)$/);
    if (!match) return null;

    const serviceSlug = match[1];
    const communeSlug = match[2];

    const serviceInfo = SEO_SERVICES[serviceSlug];
    const communeInfo = SEO_COMMUNES[communeSlug];

    if (!serviceInfo || !communeInfo) return null;

    return { serviceInfo, communeInfo };
  };

  const parsed = parseSlug(seoSlug);

  // Redirigir a 404 si el slug no es válido
  useEffect(() => {
    if (!parsed) {
      navigate('/404', { replace: true });
    }
  }, [parsed, navigate]);

  // 2. Cargar proveedores de la comuna
  useEffect(() => {
    if (!parsed) return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await searchNearbyProviders({
          lat: parsed.communeInfo.latitude,
          lng: parsed.communeInfo.longitude,
          radiusKm: 15,
          serviceType: parsed.serviceInfo.type
        });

        let list = response.providers || [];
        
        // Si el servicio es "eléctrico", filtramos por la especialidad en el cliente
        if (parsed.serviceInfo.slug === 'electrico') {
          // Buscamos prestadores mecánicos que tengan la especialidad eléctrica
          // Nota: ya buscamos por MECHANICAL en serviceType, ahora refinamos
        }

        // Solo mostrar proveedores aprobados/activos
        list = list.filter((p: any) => p.status === 'ACTIVE' || p.status === 'APPROVED');
        setProviders(list);
      } catch (error) {
        console.error('Error fetching programmatic SEO providers:', error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [seoSlug]);

  if (!parsed) {
    return <LoadingSpinner fullScreen />;
  }

  const { serviceInfo, communeInfo } = parsed;
  const pageTitle = `Servicios de ${serviceInfo.name} en ${communeInfo.name} | RedMecánica`;
  const pageDesc = `¿Buscas un ${serviceInfo.name.toLowerCase()} en ${communeInfo.name}? Encuentra profesionales recomendados, compara precios, calificaciones y solicita tu servicio a domicilio o en taller hoy mismo.`;
  const currentUrl = `https://redmecanica.cl/${seoSlug}`;

  // Filtrado dinámico en frontend
  const displayedProviders = filterCertified 
    ? providers.filter(p => p.emailVerified || p.isVerified || p.trustScore > 70)
    : providers;

  // 3. Generador de contenido dinámico > 400 palabras para cumplir con SEO semántico
  const generateSEOContent = () => {
    const serviceLower = serviceInfo.name.toLowerCase();
    const city = communeInfo.name;
    const region = communeInfo.region;

    return (
      <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          ¿Por qué contratar un {serviceLower} en {city} a través de RedMecánica?
        </h2>
        <p>
          Encontrar un <strong>{serviceLower} en {city}</strong> confiable y calificado ya no tiene por qué ser una tarea estresante o arriesgada para su presupuesto. En la Región {region === 'Metropolitana' ? 'Metropolitana' : region}, el flujo de vehículos y el desgaste diario por la congestión vehicular o autopistas de alta velocidad exigen un mantenimiento riguroso y una respuesta rápida ante emergencias automotrices. RedMecánica nace precisamente con el objetivo de solucionar esta dificultad, centralizando a los profesionales mecánicos más reputados de la comuna en una sola plataforma transparente y segura.
        </p>
        <p>
          Nuestra red local en <strong>{city}</strong> incluye expertos especializados en una amplia gama de marcas de vehículos, desde modelos de uso diario como Chevrolet, Suzuki, Toyota y Hyundai, hasta marcas de alta gama y utilitarios comerciales. Al solicitar tu cotización o servicio con nosotros, garantizas que tu auto estará en manos de expertos verificados que dominan las técnicas de diagnóstico de vanguardia, reduciendo tiempos de espera y garantizando repuestos de alta calidad.
        </p>

        <h3 className="text-xl font-bold text-gray-800">
          Servicios integrales y a domicilio disponibles en {city}
        </h3>
        <p>
          Nuestros prestadores autorizados ofrecen soluciones flexibles adaptadas a tu ritmo de vida. Ya sea que necesites asistencia directamente en tu domicilio, tu lugar de trabajo o rescate en la vía pública de {city}, contamos con la cobertura perfecta para ti. Los principales servicios solicitados en nuestra plataforma incluyen:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Mantenciones Preventivas:</strong> Cambios de aceite de motor y filtros, afinamiento completo, revisión de fluidos clave y puesta a punto integral para pasar sin inconvenientes la revisión técnica.</li>
          <li><strong>Reparaciones del Sistema de Frenos:</strong> Reemplazo urgente de pastillas de freno, rectificado de discos deteriorados, inspección del líquido hidráulico y reparación del módulo ABS.</li>
          <li><strong>Diagnóstico Electrónico Avanzado:</strong> Escaneo computarizado para identificar códigos de falla en el tablero (luz de Check Engine), solución de cortocircuitos y cambio de baterías a domicilio en minutos.</li>
          <li><strong>Asistencia en Ruta y Rescate:</strong> Traslado en grúa en caso de pane mecánica extrema o colisión, recarga de batería rápida, y cambio de neumáticos de repuesto en ruta.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800">
          Precios transparentes y presupuesto sin sorpresas
        </h3>
        <p>
          Uno de los mayores temores al llevar el auto al taller o llamar a un técnico particular es el sobreprecio inesperado o los diagnósticos erróneos. En RedMecánica terminamos con la incertidumbre implementando un <strong>sistema de cotizaciones transparente y estandarizado</strong>. Cuando solicitas un servicio en {city}, recibes presupuestos desglosados que dividen claramente el costo de la mano de obra del valor de los repuestos necesarios. De este modo, puedes evaluar, comparar y decidir con total tranquilidad basándote en precios reales y en las valoraciones de otros conductores que ya han utilizado el servicio.
        </p>
        <p>
          Además, todos los trabajos realizados a través de nuestra plataforma cuentan con un historial digital de trazabilidad que eleva el valor de reventa de tu auto y asegura un seguimiento posterior si decides renovar alguna mantención. La seguridad de tu vehículo y tu tranquilidad en las calles de {city} es nuestra prioridad número uno.
        </p>
      </div>
    );
  };

  // Schema LocalBusiness dinámico
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `RedMecánica - ${serviceInfo.pluralName} en ${communeInfo.name}`,
    "description": pageDesc,
    "url": currentUrl,
    "telephone": "+56912345678",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": communeInfo.name,
      "addressRegion": communeInfo.region,
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": communeInfo.latitude,
      "longitude": communeInfo.longitude
    },
    "priceRange": "$$"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://redmecanica.cl/hero-seo.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDesc} />
        <meta property="twitter:image" content="https://redmecanica.cl/hero-seo.jpg" />

        {/* Marcado Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>

      {/* Hero Premium Section */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block bg-blue-600/30 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider mb-4">
            {serviceInfo.icon} {serviceInfo.name} Profesional
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            Los mejores <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{serviceInfo.pluralName}</span> en {communeInfo.name}
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Compara talleres calificados, mecánicos móviles y servicios de urgencia en tu zona. Cotiza en línea con precios transparentes y 100% garantizados.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/solicitar?service=${serviceInfo.slug}&commune=${communeInfo.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 shadow-blue-500/10 active:scale-95"
            >
              🚀 Solicitar Servicio Ahora
            </Link>
            <a
              href="#prestadores"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-all backdrop-blur"
            >
              🔍 Ver Proveedores ({providers.length})
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Dynamic SEO Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 md:p-8 border border-gray-100/80 shadow-md">
            {generateSEOContent()}
          </Card>

          {/* Prestadores Section */}
          <div id="prestadores" className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Especialistas de {serviceInfo.name} disponibles cerca de {communeInfo.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Mostrando profesionales verificados en un radio de 15 km
                </p>
              </div>

              {/* Simple Filter Toggle */}
              <button
                onClick={() => setFilterCertified(!filterCertified)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filterCertified
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                {filterCertified ? '✓ Solo Destacados' : '🌟 Mostrar Solo Destacados'}
              </button>
            </div>

            {loading ? (
              <div className="py-20">
                <LoadingSpinner />
              </div>
            ) : displayedProviders.length === 0 ? (
              <Card className="p-10 text-center border border-dashed border-gray-300 text-gray-500 rounded-2xl">
                <span className="text-4xl block mb-3">📍</span>
                <p className="font-bold text-gray-800 text-lg">No encontramos mecánicos registrados en esta zona aún</p>
                <p className="text-sm mt-1 mb-6">
                  ¡Pero no te preocupes! Tenemos mecánicos de cobertura extendida listos para asistirte.
                </p>
                <Link
                  to="/solicitar"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700"
                >
                  Pedir Diagnóstico Remoto
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {displayedProviders.map((provider) => (
                  <ProviderCard 
                    key={provider.id} 
                    provider={{
                      ...provider,
                      user: { name: provider.name || provider.user?.name || 'Proveedor' }
                    }} 
                    onSelect={(p) => navigate(`/proveedor/${p.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sidebar / CTA & Quick Info */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-2xl">
            <h3 className="font-bold text-lg text-blue-900 mb-2">⚡ Cotizador Express</h3>
            <p className="text-sm text-blue-800/80 mb-6">
              Recibe hasta 4 cotizaciones en menos de 30 minutos de expertos mecánicos locales calificados.
            </p>
            <Link
              to={`/solicitar?service=${serviceInfo.slug}`}
              className="w-full text-center block bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md"
            >
              Comenzar Solicitud 💬
            </Link>
          </Card>

          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 mb-4 tracking-tight">💡 Datos del Servicio en {communeInfo.name}</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Comuna:</span>
                <span className="font-bold text-gray-800">{communeInfo.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Región:</span>
                <span className="font-bold text-gray-800">{communeInfo.region}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Categoría SEO:</span>
                <span className="font-bold text-gray-800">{serviceInfo.pluralName}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Radio de Cobertura:</span>
                <span className="font-bold text-green-600">Completa en {communeInfo.name}</span>
              </div>
            </div>
          </Card>

          {/* Quick links to nearby communes for programatic interlinking */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 mb-3 tracking-tight">📍 Comunas Cercanas</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.values(SEO_COMMUNES)
                .filter(c => c.slug !== communeInfo.slug && c.region === communeInfo.region)
                .slice(0, 5)
                .map(c => (
                  <Link
                    key={c.slug}
                    to={`/${serviceInfo.slug}-en-${c.slug}`}
                    className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg font-bold transition-all border border-gray-100"
                  >
                    {serviceInfo.name} en {c.name}
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgrammaticLandingPage;
