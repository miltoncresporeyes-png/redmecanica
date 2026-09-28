import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { SEO_SERVICES, SEO_COMMUNES } from '../data/communesData';
import { searchNearbyProviders } from '../services/api';
import ProviderCard from '../features/providers/ProviderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

const SERVICE_PLURAL_MAP: Record<string, string> = {
  'mecanicos': 'mecanico',
  'gruas': 'grua',
  'talleres': 'taller',
  'electricos': 'electrico',
  'vulcanizaciones': 'vulcanizacion',
  'hojalateria': 'hojalateria',
  'climatizacion': 'aire-acondicionado',
  'detailing': 'detailing'
};

const ServiceCityPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCertified, setFilterCertified] = useState(false);

  // La ruta es /<plural>/<ciudad>, ej: /vulcanizaciones/maipu
  const servicePlural = location.pathname.split('/').filter(Boolean)[0];
  const serviceSlug = servicePlural ? SERVICE_PLURAL_MAP[servicePlural] : undefined;
  const serviceInfo = serviceSlug ? SEO_SERVICES[serviceSlug] : undefined;
  const communeInfo = citySlug ? SEO_COMMUNES[citySlug] : undefined;

  useEffect(() => {
    if (!serviceInfo || !communeInfo) {
      navigate('/404', { replace: true });
    }
  }, [serviceInfo, communeInfo, navigate]);

  useEffect(() => {
    if (!serviceInfo || !communeInfo) return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await searchNearbyProviders({
          lat: communeInfo.latitude,
          lng: communeInfo.longitude,
          radiusKm: 15,
          serviceType: serviceInfo.type
        });

        let list = response.providers || [];
        list = list.filter((p: any) => p.status === 'ACTIVE' || p.status === 'APPROVED');
        setProviders(list);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [servicePlural, citySlug]);

  if (!serviceInfo || !communeInfo) {
    return <LoadingSpinner fullScreen />;
  }

  const pageTitle = `${serviceInfo.pluralName} en ${communeInfo.name} | Directorio gratuito RedMecánica`;
  const pageDesc = `¿Buscas ${serviceInfo.pluralName.toLowerCase()} en ${communeInfo.name}? Directorio gratuito: compara vitrinas por comuna, revisa servicios y contacta directo por WhatsApp. Sin cuenta, sin costo.`;
  const canonicalUrl = `https://redmecanica.cl/${servicePlural}/${citySlug}`;

  const displayedProviders = filterCertified
    ? providers.filter(p => p.emailVerified || p.isVerified || p.trustScore > 70)
    : providers;

  const generateSEOContent = () => {
    const city = communeInfo.name;
    const region = communeInfo.region;

    const contentMap: Record<string, { title: string; paragraphs: string[]; features: string[] }> = {
      'mecanico': {
        title: `Mecánicos a domicilio en ${city}: vitrinas verificadas cerca de ti`,
        paragraphs: [
          `¿Necesitas un mecánico de confianza en ${city}? En RedMecánica comparas vitrinas de profesionales automotrices de la Región ${region}: servicios publicados, comuna de cobertura, reputación y contacto directo por WhatsApp.`,
          `La búsqueda es gratuita y sin cuenta. Filtra por especialidad (cambio de aceite, frenos, diagnóstico OBD2, mantención por kilometraje), revisa la experiencia publicada y escríbele directo al prestador que te convenza.`,
          `Todos los perfiles destacados pasan por verificación de identidad en la plataforma. El trato y el pago los coordinas directo con el prestador, sin intermediarios.`
        ],
        features: [
          'Cambio de aceite y filtro con repuestos de calidad certificada',
          'Diagnóstico computarizado con escáner OBD2 profesional',
          'Reparación de frenos: pastillas, discos y líquido de frenos',
          'Mantención preventiva completa según kilometraje',
          'Revisión de suspensión, dirección y sistema de escape',
          'Asistencia en ruta para emergencias mecánicas'
        ]
      },
      'grua': {
        title: `Grúas en ${city}: compara auxilio cercano y contacta directo`,
        paragraphs: [
          `Quedarse varado en ${city} es estresante. En RedMecánica comparas operadores de grúa cercanos con comuna, servicios y teléfono visible para llamar o escribir por WhatsApp de inmediato.`,
          `Filtra en la Región ${region} por tipo de rescate (plataforma, remolque, auxilio con batería o neumático) y revisa la reputación publicada antes de contactar.`,
          `Coordina tarifa y destino directo con el operador por mensaje. La búsqueda en el directorio es gratuita y sin cuenta.`
        ],
        features: [
          'Grúa de plataforma para vehículos automáticos y 4x4',
          'Rescate en autopistas, calles y estacionamientos subterráneos',
          'Traslado a taller, domicilio o concesionario de tu preferencia',
          'Servicio de auxilio vial: carga de batería, cambio de neumático',
          'Cobertura en toda la Región ${region} con respuesta rápida',
          'Operadores con seguro de responsabilidad civil vigente'
        ]
      },
      'taller': {
        title: `Talleres mecánicos en ${city}: expertos certificados para tu vehículo`,
        paragraphs: [
          `Encontrar un taller mecánico de confianza en ${city} puede ser un desafío. En RedMecánica resolvemos ese problema reuniendo a los mejores talleres de la Región ${region}, todos verificados y evaluados por nuestra comunidad de conductores.`,
          `Nuestros talleres asociados en ${city} cuentan con instalaciones equipadas con tecnología de punta para diagnóstico y reparación: escáneres multimarca, elevadores hidráulicos, bancos de inyectores y herramientas especializadas para cada tipo de vehículo. Desde autos urbanos hasta camionetas SUV y vehículos comerciales, cada taller está preparado para ofrecer un servicio profesional con garantía.`,
          `Todos los talleres en RedMecánica pasan por un proceso de verificación que incluye validación de patente municipal, inicio de actividades en SII, seguro de responsabilidad civil y una inspección presencial de sus instalaciones y herramientas. Así garantizamos que tu vehículo quede en las mejores manos.`
        ],
        features: [
          'Diagnóstico computarizado avanzado con escáner profesional',
          'Reparaciones de motor, transmisión y sistema de climatización',
          'Servicio de desabolladura y pintura con garantía',
          'Alineación y balanceo computarizado de precisión',
          'Mantenciones programadas por kilometraje',
          'Repuestos originales y alternativos de alta calidad'
        ]
      },
      'electrico': {
        title: `Eléctricos automotrices en ${city}: especialistas en diagnóstico electrónico`,
        paragraphs: [
          `Los automóviles modernos son verdaderas computadoras sobre ruedas, y cuando falla un sensor, la centralita o el sistema eléctrico, necesitas un especialista que entienda de electrónica automotriz. En RedMecánica conectamos a los conductores de ${city} con los mejores técnicos eléctricos automotrices de la Región ${region}.`,
          `Nuestros especialistas en electricidad automotriz están capacitados para diagnosticar y reparar fallas complejas: desde luces del tablero encendidas y problemas de arranque, hasta cortocircuitos intermitentes, fallas de sensores, y reparación de módulos electrónicos (ECU, BCM, ABS). Cada técnico cuenta con equipos de diagnóstico de última generación y años de experiencia en la industria.`,
          `En ${city}, compara vitrinas con servicios, reputación y contacto directo. Escríbeles por WhatsApp sin crear cuenta y cierra el trato directo con el prestador.`
        ],
        features: [
          'Diagnóstico de fallas eléctricas con escáner profesional',
          'Reparación de sistemas de carga: alternador y batería',
          'Solución de cortocircuitos y fallas intermitentes',
          'Reparación y codificación de módulos electrónicos',
          'Instalación de accesorios eléctricos y sensores',
          'Diagnóstico de sistemas Start-Stop y vehículos híbridos'
        ]
      },
      'vulcanizacion': {
        title: `Vulcanizaciones en ${city}: pinchazos, neumáticos y balanceo cerca de ti`,
        paragraphs: [
          `¿Pinchazo en ${city}? En RedMecánica encuentras vulcanizaciones con atención inmediata, cambio de neumáticos, reparación de llantas, alineación y balanceo. Todo publicado en vitrinas con comuna, servicios y contacto directo.`,
          `Compara prestadores de la Región ${region} por reputación y cercanía. La búsqueda es gratuita y sin cuenta: eliges tu vulca favorita y la contactas por WhatsApp en un toque.`,
          `Muchas vulcanizaciones ofrecen atención a domicilio y rescate en ruta dentro de ${city}. Revisa su cobertura publicada y confirma disponibilidad por mensaje directo.`
        ],
        features: [
          'Reparación de pinchazos y cambio de neumáticos',
          'Alineación y balanceo computarizado',
          'Reparación de llantas y válvulas',
          'Rotación de neumáticos por kilometraje',
          'Atención a domicilio y rescate en ruta',
          'Venta de neumáticos nuevos y usados'
        ]
      },
      'hojalateria': {
        title: `Hojalatería y pintura en ${city}: desabolladura y color exacto`,
        paragraphs: [
          `Un choque o rayón baja el valor de tu auto. En ${city} reunimos talleres de hojalatería y pintura con fotos de trabajos, servicios detallados y contacto directo para cotizar por WhatsApp.`,
          `Compara en la Región ${region} por especialidad (desabolladura sin pintura, pintura al horno, pulido) y reputación verificada. Sin intermediarios: tú hablas directo con el taller.`,
          `Pide siempre fotos del antes/después y garantía escrita de color. Los prestadores destacados publican sus coberturas por comuna.`
        ],
        features: [
          'Desabolladura tradicional y sin pintura (PDR)',
          'Pintura al horno con igualación de color',
          'Reparación de parachoques y focos',
          'Pulido y corrección de pintura',
          'Cuadratura y soldadura',
          'Garantía escrita de taller'
        ]
      },
      'aire-acondicionado': {
        title: `Aire acondicionado vehicular en ${city}: diagnóstico y recarga`,
        paragraphs: [
          `Si tu aire no enfría en ${city}, encuentra especialistas en climatización vehicular con recarga de gas, detección de fugas, cambio de compresor y limpieza de circuito.`,
          `En la Región ${region} compara vitrinas por servicios y reputación, y contacta directo por WhatsApp. La búsqueda es gratuita y sin cuenta.`,
          `Un buen diagnóstico evita recargas innecesarias: pide revisión de presiones y prueba de fugas antes de aprobar el servicio.`
        ],
        features: [
          'Recarga de gas R134a / R1234yf',
          'Detección y reparación de fugas',
          'Cambio de compresor y condensador',
          'Limpieza de circuito y filtro de cabina',
          'Diagnóstico de presiones y sensores',
          'Calefacción y desempañado'
        ]
      },
      'detailing': {
        title: `Detailing y lavado premium en ${city}: estética profesional`,
        paragraphs: [
          `Devuélvele el brillo a tu auto en ${city} con detailing profesional: lavado premium, descontaminado, pulido, cerámico, limpieza interior y restauración de focos.`,
          `Compara en la Región ${region} por portafolio de servicios y reputación. Agenda directo por WhatsApp, sin cuenta ni comisión para ti.`,
          `Para trabajos a domicilio confirma acceso a agua y electricidad en tu mensaje inicial y acelera tu cotización.`
        ],
        features: [
          'Lavado premium y descontaminado férrico',
          'Pulido en 1-3 etapas y sellado cerámico',
          'Limpieza interior profunda y ozono',
          'Restauración de focos y plásticos',
          'Limpieza de motor a vapor',
          'Atención a domicilio y en local'
        ]
      }
    };

    const content = contentMap[serviceInfo.slug] || contentMap['mecanico'];

    return (
      <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {content.title}
        </h2>
        {content.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h3 className="text-xl font-bold text-gray-800">
          Servicios disponibles en {city}
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          {content.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <h3 className="text-xl font-bold text-gray-800">
          ¿Cómo funciona RedMecánica en {city}?
        </h3>
        <p>
          Busca gratis por comuna y categoría, compara vitrinas con servicios,
          reputación y cobertura en {city}, y contacta directo por WhatsApp o teléfono.
          Sin cuenta, sin intermediarios y sin comisión para ti como conductor.
        </p>
        <p>
          ¿Tienes un negocio en {city}? Publica tu vitrina gratis y aparece cuando
          tus vecinos busquen tu categoría. Solo pagas si quieres destacar sobre tu competencia.
        </p>
      </div>
    );
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `RedMecánica - ${serviceInfo.pluralName} en ${communeInfo.name}`,
    description: pageDesc,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: displayedProviders.slice(0, 10).map((p: any, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'AutoRepair',
          name: p.businessName || p.name || p.user?.name || `${serviceInfo.name} en ${communeInfo.name}`,
          url: `https://redmecanica.cl/proveedor/${p.id}`,
          telephone: p.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: p.commune || communeInfo.name,
            addressRegion: p.region || communeInfo.region,
            addressCountry: 'CL',
          },
        },
      })),
    },
  };

  const otherServices = Object.keys(SERVICE_PLURAL_MAP).filter(s => s !== servicePlural);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://redmecanica.cl/hero-seo.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDesc} />
        <meta property="twitter:image" content="https://redmecanica.cl/hero-seo.jpg" />

        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-blue-600 transition-colors min-h-[44px] inline-flex items-center">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li><Link to="/search" className="hover:text-blue-600 transition-colors min-h-[44px] inline-flex items-center">Directorio</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-800 font-semibold">{serviceInfo.pluralName} en {communeInfo.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl p-6 sm:p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white opacity-5 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block bg-emerald-400/15 text-emerald-300 border border-emerald-300/20 text-[11px] sm:text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider mb-4">
            {serviceInfo.icon} Directorio gratuito · {communeInfo.name}
          </span>
          <h1 className="font-heading font-extrabold mb-3 sm:mb-4 leading-tight tracking-tight text-2xl sm:text-4xl md:text-5xl">
            {serviceInfo.pluralName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">en {communeInfo.name}</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed">
            {serviceInfo.slug === 'grua'
              ? `Asistencia en ${communeInfo.name}: compara grúas cercanas y contacta directo por WhatsApp, sin cuenta.`
              : `Compara vitrinas en ${communeInfo.name}: servicios, reputación y contacto directo. Búsqueda 100% gratuita.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#prestadores"
              className="btn-accent"
            >
              Ver vitrinas ({providers.length})
            </a>
            <Link
              to={`/search?commune=${encodeURIComponent(communeInfo.name)}`}
              className="btn-ghost-light"
            >
              🔍 Buscar en el directorio
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 md:p-8 border border-gray-100/80 shadow-md">
            {generateSEOContent()}
          </Card>

          <div id="prestadores" className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {serviceInfo.pluralName} disponibles cerca de {communeInfo.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Mostrando profesionales verificados en la zona
                </p>
              </div>

              <button
                onClick={() => setFilterCertified(!filterCertified)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filterCertified
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                {filterCertified ? 'Solo Destacados' : 'Mostrar Solo Destacados'}
              </button>
            </div>

            {loading ? (
              <div className="py-20"><LoadingSpinner /></div>
            ) : displayedProviders.length === 0 ? (
              <Card className="p-8 sm:p-10 text-center border border-dashed border-gray-300 text-gray-500 rounded-2xl">
                <span className="text-4xl block mb-3">{serviceInfo.icon}</span>
                <p className="font-bold text-gray-800 text-lg">
                  Sé el primero: {serviceInfo.pluralName} en {communeInfo.name}
                </p>
                <p className="text-sm mt-1 mb-6">
                  Aún no hay vitrinas publicadas en {communeInfo.name}.
                  Busca en comunas cercanas o publica tu negocio gratis y aparece aquí primero.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Link
                    to={`/search?commune=${encodeURIComponent(communeInfo.name)}`}
                    className="btn-primary"
                  >
                    🔍 Buscar cerca
                  </Link>
                  <Link
                    to="/unete"
                    className="btn-ghost"
                  >
                    Publicar mi negocio gratis
                  </Link>
                </div>
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

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm rounded-2xl">
            <h3 className="font-bold text-lg text-emerald-900 mb-2">🔍 Directorio gratuito</h3>
            <p className="text-sm text-emerald-800/80 mb-4">
              Filtra por comuna y categoría, compara vitrinas y contacta directo por WhatsApp. Sin cuenta.
            </p>
            <Link
              to={`/search?commune=${encodeURIComponent(communeInfo.name)}`}
              className="btn-whatsapp w-full"
            >
              Explorar directorio
            </Link>
            <Link
              to="/unete"
              className="mt-2 w-full text-center block text-xs font-extrabold text-emerald-700 hover:text-emerald-900 py-2"
            >
              ¿Tienes negocio en {communeInfo.name}? Publícalo gratis →
            </Link>
          </Card>

          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 mb-4 tracking-tight">Datos del Servicio</h3>
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
                <span className="text-gray-500">Servicio:</span>
                <span className="font-bold text-gray-800">{serviceInfo.pluralName}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Cobertura:</span>
                <span className="font-bold text-green-600">Disponible en {communeInfo.name}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 mb-3 tracking-tight">Otros Servicios</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {otherServices.map(s => (
                <Link
                  key={s}
                  to={`/${s}/${citySlug}`}
                  className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg font-bold transition-all border border-gray-100"
                >
                  {SEO_SERVICES[SERVICE_PLURAL_MAP[s]]?.pluralName || s} en {communeInfo.name}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-800 mb-3 tracking-tight">Comunas Cercanas</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.values(SEO_COMMUNES)
                .filter(c => c.slug !== communeInfo.slug && c.region === communeInfo.region)
                .slice(0, 6)
                .map(c => (
                  <Link
                    key={c.slug}
                    to={`/${servicePlural}/${c.slug}`}
                    className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg font-bold transition-all border border-gray-100"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceCityPage;
