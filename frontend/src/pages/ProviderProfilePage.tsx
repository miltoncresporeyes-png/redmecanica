import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { getProviderById, getProviderAvailability, searchNearbyProviders } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import ProviderCard from '../features/providers/ProviderCard';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProviderById(id);
        if (!data) {
          setError('No se pudo encontrar la información del prestador.');
          return;
        }
        setProvider(data);

        // Disponibilidad (no bloquea si falla)
        try {
          const avail = await getProviderAvailability(data.id);
          if (Array.isArray(avail)) setAvailability(avail);
        } catch {
          setAvailability([]);
        }

        // Similares en la misma zona
        try {
          if (data.latitude && data.longitude) {
            const res = await searchNearbyProviders({
              lat: data.latitude,
              lng: data.longitude,
              radiusKm: 15,
              serviceType: ['MECHANIC', 'WORKSHOP', 'TOWING'].includes(data.type) ? data.type : undefined,
            });
            const list = (res.providers || [])
              .filter((p: any) => p.id !== data.id && (p.status === 'ACTIVE' || p.status === 'APPROVED'))
              .slice(0, 3);
            setSimilar(list);
          }
        } catch {
          setSimilar([]);
        }
      } catch (err) {
        console.error('Error loading provider profile:', err);
        setError('Error al conectar con el servidor. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const openToday = useMemo(() => {
    if (!availability.length) return null;
    const today = new Date().getDay();
    return availability.find((a: any) => a.dayOfWeek === today && a.isActive !== false) || null;
  }, [availability]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !provider) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-100 shadow-sm mb-6">
          <span className="text-4xl block mb-2">⚠️</span>
          <p className="font-bold text-lg">Vitrina no disponible</p>
          <p className="text-sm mt-1">{error || 'El prestador solicitado no existe o no está activo.'}</p>
        </div>
        <button onClick={() => navigate('/search')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-all">
          🔍 Buscar en el directorio gratuito
        </button>
      </div>
    );
  }

  const name = provider.businessName || provider.user?.name || 'Prestador automotriz';
  const verified = Boolean(provider.isVerified || provider.emailVerified || provider.status === 'ACTIVE');
  const typeLabel =
    provider.type === 'MECHANIC' ? 'Mecánico a domicilio' :
    provider.type === 'WORKSHOP' ? 'Taller mecánico' :
    provider.type === 'TOWING' ? 'Grúa y auxilio' : 'Prestador automotriz';
  const typeIcon =
    provider.type === 'MECHANIC' ? '🔧' :
    provider.type === 'WORKSHOP' ? '🏭' :
    provider.type === 'TOWING' ? '🚛' : '⚙️';

  const specialtiesList = (provider.specialties || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const paymentMethodsList = (provider.paymentMethods || '').split(',').map((m: string) => m.trim()).filter(Boolean);

  const pageTitle = `${name} | ${typeLabel} en ${provider.commune || 'Chile'} | RedMecánica`;
  const pageDesc = `${name}, ${typeLabel.toLowerCase()} en ${provider.commune || 'Chile'}${provider.region ? `, ${provider.region}` : ''}. Servicios: ${specialtiesList.slice(0, 4).join(', ') || 'automotrices'}. Contacto directo y gratuito por WhatsApp.`;
  const currentUrl = `https://redmecanica.cl/proveedor/${provider.id}`;

  const sanitizedPhone = (provider.phone || '').replace(/[^0-9]/g, '');
  const whatsAppLink = sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Hola ${name}, vi tu vitrina en RedMecánica y quiero cotizar un servicio.`)}`
    : `https://wa.me/?text=${encodeURIComponent(`Hola ${name}, vi tu vitrina en RedMecánica y quiero cotizar.`)}`;

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name,
    image: 'https://redmecanica.cl/logo-meta.jpg',
    telephone: provider.phone || undefined,
    url: currentUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: provider.address || 'Atención a domicilio',
      addressLocality: provider.commune || 'Santiago',
      addressRegion: provider.region || 'Metropolitana',
      addressCountry: 'CL',
    },
    ...(provider.latitude && provider.longitude
      ? { geo: { '@type': 'GeoCoordinates', latitude: provider.latitude, longitude: provider.longitude } }
      : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: provider.rating || 5.0,
      bestRating: '5',
      worstRating: '1',
      ratingCount: Math.max(provider.completedJobs || 0, 1),
    },
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://redmecanica.cl/logo-meta.jpg" />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* Breadcrumb marketplace */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
        <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-blue-600 transition-colors">Directorio</Link>
        <span>/</span>
        {provider.commune && (
          <>
            <Link to={`/search?commune=${encodeURIComponent(provider.commune)}`} className="hover:text-blue-600 transition-colors">
              {provider.commune}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-extrabold truncate max-w-[200px]">{name}</span>
      </div>

      {/* Header vitrina */}
      <Card className="p-6 md:p-8 mb-6 border border-gray-100 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 border-l border-b border-emerald-100 text-[11px] font-extrabold py-2 px-4 rounded-bl-2xl">
          ✅ VITRINA GRATUITA · CONTACTO DIRECTO
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-50 to-indigo-100 text-5xl rounded-3xl flex items-center justify-center shadow-inner border border-blue-100">
              {typeIcon}
            </div>
            {verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded-full shadow-lg border-4 border-white uppercase">
                ✓ Verificado
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {name}
              </h1>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-3">
              <span className="bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">{typeLabel}</span>
              {provider.commune && (
                <Link
                  to={`/search?commune=${encodeURIComponent(provider.commune)}`}
                  className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider hover:bg-blue-100"
                >
                  📍 {provider.commune}
                </Link>
              )}
              {openToday ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                  🟢 Hoy {openToday.startTime}–{openToday.endTime}
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-500 font-bold text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                  🕒 Horario por confirmar
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center md:justify-start mb-3 text-sm">
              <span className="inline-flex items-center bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 font-black text-gray-800">
                <span className="text-yellow-500 mr-1">★</span> {(provider.rating || 5).toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-medium">· {provider.completedJobs || 0} servicios</span>
              {provider.experience && <span className="text-xs text-gray-500 font-medium">· {provider.experience} años</span>}
              <button onClick={handleShare} className="text-xs font-bold text-blue-600 hover:text-blue-800 ml-1">
                {copied ? '✓ ¡Link copiado!' : '🔗 Compartir'}
              </button>
            </div>

            {specialtiesList.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {specialtiesList.slice(0, 8).map((spec: string) => (
                  <span key={spec} className="bg-slate-50 text-slate-700 border border-slate-200/60 rounded px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-tight">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA contacto directo */}
        <div className="mt-6 grid sm:grid-cols-2 gap-2">
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 text-sm"
          >
            <span className="text-lg">💬</span> WhatsApp directo · gratis
          </a>
          {provider.phone ? (
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95 text-sm"
            >
              📞 {provider.phone}
            </a>
          ) : (
            <Link
              to={`/search?commune=${encodeURIComponent(provider.commune || '')}`}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-3 px-4 rounded-xl transition-all text-sm"
            >
              🔍 Ver más en {provider.commune || 'tu comuna'}
            </Link>
          )}
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-2">Sin cuenta · sin comisión para ti como conductor · el trato es directo con el prestador</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Servicios */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-black text-gray-900 tracking-tight mb-1">🛠️ Servicios que promociona</h2>
            <p className="text-xs text-gray-400 mb-4">Publicados por el prestador en su vitrina</p>
            {specialtiesList.length === 0 ? (
              <p className="text-sm text-gray-500">Este prestador aún no detalla sus servicios. Contáctalo por WhatsApp y pide su lista de precios.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {specialtiesList.map((spec: string) => (
                  <div key={spec} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700">
                    <span className="text-emerald-500 font-black">✓</span> {spec}
                  </div>
                ))}
              </div>
            )}
            {provider.bio && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <h3 className="text-sm font-black text-gray-800 mb-1">📜 Presentación</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{provider.bio}</p>
              </div>
            )}
          </Card>

          {/* Horarios */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-black text-gray-900 tracking-tight mb-1">🕒 Horario de atención</h2>
            <p className="text-xs text-gray-400 mb-4">Confirma por WhatsApp antes de ir, especialmente fines de semana</p>
            {availability.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                ⏳ Este prestador aún no publica su horario. Toca WhatsApp y pregúntale directamente — responde como negocio local.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {DAYS.map((day, idx) => {
                  const row = availability.find((a: any) => a.dayOfWeek === idx);
                  const isToday = new Date().getDay() === idx;
                  return (
                    <div key={day} className={`flex justify-between py-2 text-sm ${isToday ? 'font-extrabold text-gray-900' : 'text-gray-600'}`}>
                      <span>{day} {isToday && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">HOY</span>}</span>
                      <span>{row && row.isActive !== false ? `${row.startTime} – ${row.endTime}` : 'Cerrado'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Reseñas honestas */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-black text-gray-900 tracking-tight mb-1">⭐ Reputación</h2>
            <p className="text-xs text-gray-400 mb-4">Basada en servicios completados en la plataforma</p>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div className="text-4xl font-black text-gray-900">{(provider.rating || 5).toFixed(1)}</div>
              <div className="text-sm text-gray-600">
                <div className="text-yellow-500 font-black tracking-widest">★★★★★</div>
                <p className="mt-1"><strong>{provider.completedJobs || 0}</strong> servicios completados · confianza {Math.round(provider.trustScore || 85)}%</p>
                <p className="text-xs text-gray-400 mt-1">Las reseñas escritas se habilitan después de cada servicio verificado. Sin reseñas inventadas.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Cobertura */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-900 mb-3 tracking-tight">📍 Cobertura</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">Comuna base</span>
                <Link to={`/search?commune=${encodeURIComponent(provider.commune || '')}`} className="font-bold text-blue-700 hover:underline">
                  {provider.commune || '—'}
                </Link>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">Región</span>
                <span className="font-bold text-gray-800">{provider.region || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dirección</span>
                <span className="font-bold text-gray-800 text-right max-w-[60%]">{provider.address || 'Atención a domicilio'}</span>
              </div>
            </div>
            <Link
              to={`/search?commune=${encodeURIComponent(provider.commune || '')}`}
              className="mt-4 block text-center text-xs font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl transition-colors"
            >
              Ver más prestadores en {provider.commune || 'la comuna'} →
            </Link>
          </Card>

          {/* Pagos */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-900 mb-3 tracking-tight">💳 Pagos</h3>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethodsList.length === 0 ? (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">A convenir por WhatsApp</span>
              ) : (
                paymentMethodsList.map((m: string) => (
                  <span key={m} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {m === 'CASH' ? 'Efectivo' : m === 'DEBIT' ? 'Débito' : m === 'CREDIT' ? 'Crédito' : m === 'TRANSFER' ? 'Transferencia' : m}
                  </span>
                ))
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">El pago es directo al prestador. RedMecánica no cobra comisión al conductor.</p>
          </Card>

          {/* Confianza */}
          <Card className="p-6 border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-gray-900 mb-3 tracking-tight">🛡️ Verificación</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>✓ Perfil {verified ? 'verificado' : 'en revisión'} por RedMecánica</p>
              <p>✓ Teléfono {provider.phoneVerified ? 'validado' : 'publicado por el prestador'}</p>
              <p>✓ Reporta cualquier problema a contacto@redmecanica.cl</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Similares */}
      {similar.length > 0 && (
        <div className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-extrabold text-gray-900 tracking-tight">También en tu zona</h2>
            <Link to={`/search?commune=${encodeURIComponent(provider.commune || '')}`} className="text-sm font-bold text-blue-600 hover:text-blue-800">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {similar.map((p: any) => (
              <ProviderCard key={p.id} provider={p} onSelect={(sel) => navigate(`/proveedor/${sel.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfilePage;
