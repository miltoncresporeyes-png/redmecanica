import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
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
  'electricos': 'electrico'
};

const ServiceCityPage: React.FC = () => {
  const { servicePlural, citySlug } = useParams<{ servicePlural: string; citySlug: string }>();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCertified, setFilterCertified] = useState(false);

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

  const pageTitle = `${serviceInfo.pluralName} en ${communeInfo.name} | RedMecánica`;
  const pageDesc = `¿Buscas ${serviceInfo.pluralName.toLowerCase()} en ${communeInfo.name}? Encuentra los mejores servicios, compara precios, lee reseñas y solicita atención a domicilio o en taller.`;
  const canonicalUrl = `https://redmecanica.cl/${servicePlural}/${citySlug}`;

  const displayedProviders = filterCertified
    ? providers.filter(p => p.emailVerified || p.isVerified || p.trustScore > 70)
    : providers;

  const generateSEOContent = () => {
    const city = communeInfo.name;
    const region = communeInfo.region;

    const contentMap: Record<string, { title: string; paragraphs: string[]; features: string[] }> = {
      'mecanico': {
        title: `Mecánicos a domicilio en ${city}: profesionales certificados cerca de ti`,
        paragraphs: [
          `¿Necesitas un mecánico de confianza en ${city}? En RedMecánica reunimos a los mejores profesionales automotrices de la Región ${region} para ofrecerte servicios de calidad sin que tengas que moverte de tu casa. Ya sea que requieras un cambio de aceite, una reparación de frenos, un diagnóstico computarizado o una mantención completa, nuestros técnicos certificados están listos para atenderte.`,
          `La Región ${region} concentra una de las flotas vehiculares más grandes de Chile, con miles de autos circulando a diario. Mantener tu vehículo en óptimas condiciones no solo alarga su vida útil, sino que garantiza tu seguridad y la de tu familia en la ruta. Por eso, todos los mecánicos registrados en nuestra plataforma pasan por un riguroso proceso de verificación que incluye validación de identidad, certificaciones técnicas, inspección de herramientas y evaluación práctica.`,
          `En ${city}, nuestros servicios de mecánica a domicilio cubren desde mantenciones básicas hasta reparaciones complejas. Recibe hasta 4 cotizaciones en minutos, compara precios, elige al profesional con mejor evaluación y agenda el servicio en el horario que más te convenga. Sin desplazamientos, sin esperas, sin sorpresas.`
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
        title: `Servicios de grúa en ${city}: asistencia 24/7 para tu vehículo`,
        paragraphs: [
          `Quedarse varado en ${city} o en sus alrededores es una experiencia que nadie quiere vivir. Por eso, en RedMecánica disponemos de una red de operadores de grúas profesionales listos para asistirte las 24 horas del día, los 7 días de la semana, incluyendo fines de semana y festivos.`,
          `Nuestros servicios de grúa en la Región ${region} cubren desde rescates en autopistas urbanas hasta traslados entre comunas. Todos nuestros operadores cuentan con seguros de carga vigentes, camillas hidráulicas de plataforma para proteger la transmisión de tu vehículo, y conductores capacitados para maniobrar en espacios reducidos como estacionamientos subterráneos o calles angostas.`,
          `Al solicitar una grúa a través de RedMecánica, recibirás una cotización transparente con tarifa base y costo por kilómetro adicional, sin cargos ocultos. Puedes hacer seguimiento GPS en tiempo real de la unidad que se dirige hacia ti y pagar de forma segura a través de la plataforma una vez completado el servicio.`
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
          `En ${city}, ofrecemos servicio a domicilio para diagnósticos eléctricos y reparaciones menores, o la opción de llevar tu vehículo a talleres especializados para trabajos más complejos como reparación de tableros, cambio de centralitas o instalación de accesorios eléctricos. Todo con precios transparentes y garantía incluida.`
        ],
        features: [
          'Diagnóstico de fallas eléctricas con escáner profesional',
          'Reparación de sistemas de carga: alternador y batería',
          'Solución de cortocircuitos y fallas intermitentes',
          'Reparación y codificación de módulos electrónicos',
          'Instalación de accesorios eléctricos y sensores',
          'Diagnóstico de sistemas Start-Stop y vehículos híbridos'
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
          Usar RedMecánica es muy simple. Solo describe tu problema o necesidad automotriz,
          recibe cotizaciones detalladas de profesionales verificados cerca de {city},
          compara precios, calificaciones y reseñas de otros conductores, y elige al
          profesional que mejor se ajuste a tus necesidades. El pago se realiza solo cuando
          el servicio está completo y estás 100% satisfecho.
        </p>
        <p>
          Todos los servicios realizados a través de nuestra plataforma en {city} incluyen
          garantía mínima de 30 días sobre la mano de obra y los repuestos instalados.
          Además, cada transacción queda registrada con un historial digital que puedes
          consultar en cualquier momento desde tu cuenta.
        </p>
      </div>
    );
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `RedMecánica - ${serviceInfo.pluralName} en ${communeInfo.name}`,
    'description': pageDesc,
    'url': canonicalUrl,
    'telephone': '+56912345678',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': communeInfo.name,
      'addressRegion': communeInfo.region,
      'addressCountry': 'CL'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': communeInfo.latitude,
      'longitude': communeInfo.longitude
    },
    'priceRange': '$$'
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
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link></li>
          <li className="text-gray-300">/</li>
          <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Servicios</Link></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-800 font-semibold">{serviceInfo.pluralName} en {communeInfo.name}</li>
        </ol>
      </nav>

      {/* Hero */}
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
            {serviceInfo.slug === 'grua'
              ? `Asistencia 24/7 en ${communeInfo.name}. Cotiza tu grúa al instante y recibe ayuda sin demora.`
              : `Compara profesionales calificados en ${communeInfo.name}. Cotiza en línea con precios transparentes y garantía incluida.`}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/solicitar?service=${serviceInfo.slug}&commune=${communeInfo.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 shadow-blue-500/10 active:scale-95"
            >
              Solicitar Servicio Ahora
            </Link>
            <a
              href="#prestadores"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-all backdrop-blur"
            >
              Ver Proveedores ({providers.length})
            </a>
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
              <Card className="p-10 text-center border border-dashed border-gray-300 text-gray-500 rounded-2xl">
                <span className="text-4xl block mb-3">{serviceInfo.icon}</span>
                <p className="font-bold text-gray-800 text-lg">
                  Próximamente: {serviceInfo.pluralName} en {communeInfo.name}
                </p>
                <p className="text-sm mt-1 mb-6">
                  Estamos expandiendo nuestra red de profesionales en {communeInfo.name}.
                  Mientras tanto, puedes solicitar un servicio con cobertura extendida
                  o agendar una atención programada.
                </p>
                <Link
                  to="/solicitar"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all inline-block"
                >
                  Solicitar Servicio
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

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-2xl">
            <h3 className="font-bold text-lg text-blue-900 mb-2">Cotizador Express</h3>
            <p className="text-sm text-blue-800/80 mb-6">
              Recibe hasta 4 cotizaciones en menos de 30 minutos de profesionales locales calificados.
            </p>
            <Link
              to={`/solicitar?service=${serviceInfo.slug}`}
              className="w-full text-center block bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md"
            >
              Comenzar Solicitud
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
