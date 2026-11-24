import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { getProviderById, getProviderAvailability, searchNearbyProviders } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import ProviderCard from '../features/providers/ProviderCard';
import StickyWhatsAppButton from '../components/common/StickyWhatsAppButton';
import LeadQualificationModal from '../components/common/LeadQualificationModal';
import { trackProviderEvent } from '../lib/trackProvider';
import { Wrench, Warehouse, Truck, Settings, MapPin, Star, BadgeCheck, MessageCircle, Phone, Search, Share2, Check, Clock, CreditCard, ShieldCheck, TriangleAlert, ArrowRight, ScrollText, Hammer, CircleCheck } from 'lucide-react';

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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

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
    trackProviderEvent(id, 'VIEW');
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
        <div className="bg-red-50 text-red-800 p-6 rounded-card border border-red-100 shadow-sm mb-6">
          <TriangleAlert className="w-10 h-10 mx-auto mb-2" aria-hidden="true" />
          <p className="font-bold text-lg">Vitrina no disponible</p>
          <p className="text-sm mt-1">{error || 'El prestador solicitado no existe o no está activo.'}</p>
        </div>
        <button onClick={() => navigate('/search')} className="btn-primary">
          <Search className="w-4 h-4" aria-hidden="true" /> Buscar en el directorio gratuito
        </button>
      </div>
    );
  }

  const name = provider.businessName || provider.user?.name || 'Prestador automotriz';
  // Solo cuenta como verificado un prestador aprobado por el equipo (no cualquier cuenta activa).
  const verified = Boolean(provider.isVerified || provider.status === 'APPROVED');
  const hasRating = (provider.completedJobs || 0) > 0 && (provider.rating || 0) > 0;
  const typeLabel =
    provider.type === 'MECHANIC' ? 'Mecánico a domicilio' :
    provider.type === 'WORKSHOP' ? 'Taller mecánico' :
    provider.type === 'TOWING' ? 'Grúa y auxilio' : 'Prestador automotriz';
  const TypeIcon = ({ className }: { className?: string }) => {
    switch (provider.type) {
      case 'MECHANIC': return <Wrench className={className} aria-hidden="true" />;
      case 'WORKSHOP': return <Warehouse className={className} aria-hidden="true" />;
      case 'TOWING': return <Truck className={className} aria-hidden="true" />;
      default: return <Settings className={className} aria-hidden="true" />;
    }
  };

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
    // Solo con calificaciones reales: no se declara rating inventado en datos estructurados.
    ...(hasRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: provider.rating,
            bestRating: '5',
            worstRating: '1',
            ratingCount: provider.completedJobs,
          },
        }
      : {}),
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
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5 pb-24 md:pb-8">
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

      {/* Migas (una linea, compactas) */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-600 mb-3" aria-label="Migas de pan">
        <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to="/search" className="hover:text-blue-600 transition-colors">Directorio</Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-bold truncate max-w-[220px]">{name}</span>
      </nav>

      {/* Vitrina: todo lo esencial en una sola vista (sin scroll en escritorio). Lo demas queda debajo. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 items-start">
        {/* Columna principal: quien es y que ofrece */}
        <Card className="lg:col-span-2 p-5 md:p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-primary rounded-card flex items-center justify-center border border-blue-100">
                <TypeIcon className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              {verified && (
                <div className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow border-2 border-white">
                  <BadgeCheck className="w-3 h-3" aria-hidden="true" /> Verificado
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-slate-900 !text-2xl sm:!text-3xl leading-tight">{name}</h1>
              {provider.plan && provider.plan !== 'FREE' && (
                <span className="inline-flex items-center gap-1 mt-1.5 bg-amber-100 text-amber-900 text-xs font-bold uppercase px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" aria-hidden="true" /> {provider.plan === 'PROFESSIONAL' ? 'Premium' : 'Destacado'}
                </span>
              )}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="bg-slate-900 text-white font-bold text-[11px] px-2 py-0.5 rounded uppercase tracking-wider">{typeLabel}</span>
                {provider.commune && (
                  <Link to={`/search?commune=${encodeURIComponent(provider.commune)}`} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 font-bold text-xs px-2 py-0.5 rounded hover:bg-blue-100">
                    <MapPin className="w-3 h-3" aria-hidden="true" /> {provider.commune}
                  </Link>
                )}
                {hasRating ? (
                  <span className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold text-xs text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" /> {provider.rating.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Nuevo en RedMecánica</span>
                )}
                <span className="text-xs text-slate-600 font-medium">{provider.completedJobs || 0} servicios</span>
                {provider.experience && <span className="text-xs text-slate-600 font-medium">· {provider.experience} años de experiencia</span>}
                <button onClick={handleShare} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-800 min-h-[32px] ml-auto">
                  {copied ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Copiado</> : <><Share2 className="w-3.5 h-3.5" aria-hidden="true" /> Compartir</>}
                </button>
              </div>
            </div>
          </div>

          {provider.bio && (
            <div className="mt-4">
              <h2 className="text-sm text-slate-900 mb-1 flex items-center gap-1.5"><ScrollText className="w-4 h-4 text-primary" aria-hidden="true" /> Presentación</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">{provider.bio}</p>
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-sm text-slate-900 mb-2 flex items-center gap-1.5"><Hammer className="w-4 h-4 text-primary" aria-hidden="true" /> Servicios que promociona</h2>
            {specialtiesList.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no detalla sus servicios. Contáctalo por WhatsApp y pide su lista de precios.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {specialtiesList.slice(0, 14).map((spec: string) => (
                  <span key={spec} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-control px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Cobertura</h3>
              <p className="text-slate-800 font-semibold">{provider.commune || '—'}{provider.region ? `, ${provider.region}` : ''}</p>
              <p className="text-slate-600 text-xs">{provider.address || 'Atención a domicilio'}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" aria-hidden="true" /> Pagos</h3>
              <div className="flex flex-wrap gap-1">
                {paymentMethodsList.length === 0 ? (
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">A convenir por WhatsApp</span>
                ) : (
                  paymentMethodsList.map((m: string) => (
                    <span key={m} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {m === 'CASH' ? 'Efectivo' : m === 'DEBIT' ? 'Débito' : m === 'CREDIT' ? 'Crédito' : m === 'TRANSFER' ? 'Transferencia' : m}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Columna de contacto: la accion principal siempre a la vista */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <Card className="p-5 shadow-md border-emerald-100">
            <p className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-bold py-1 px-2.5 rounded-full mb-3">
              <CircleCheck className="w-3.5 h-3.5" aria-hidden="true" /> Vitrina gratuita · contacto directo
            </p>
            <div className="grid gap-2">
              {provider.phone ? (
                <button type="button" onClick={() => { trackProviderEvent(provider.id, 'WHATSAPP'); setIsLeadModalOpen(true); }} className="btn-whatsapp">
                  <MessageCircle className="w-5 h-5" aria-hidden="true" /> Contactar por WhatsApp
                </button>
              ) : (
                <button type="button" disabled className="btn bg-slate-200 text-slate-600 cursor-not-allowed">Sin WhatsApp disponible</button>
              )}
              {provider.phone ? (
                <a onClick={() => trackProviderEvent(provider.id, 'CALL')} href={`tel:${provider.phone}`} className="btn-dark">
                  <Phone className="w-4 h-4" aria-hidden="true" /> {provider.phone}
                </a>
              ) : (
                <Link to={`/search?commune=${encodeURIComponent(provider.commune || '')}`} className="btn-ghost">
                  <Search className="w-4 h-4" aria-hidden="true" /> Ver más en {provider.commune || 'tu comuna'}
                </Link>
              )}
            </div>
            <p className="text-center text-[11px] text-slate-500 mt-2.5">Sin cuenta · sin comisión para ti · trato directo con el prestador</p>
            <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold mt-2 pt-2 border-t border-slate-100 text-slate-600">
              {verified
                ? <><BadgeCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Verificado por RedMecánica</>
                : <><ShieldCheck className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" /> Aún sin verificar por RedMecánica</>}
            </p>
          </Card>

          <Card className="p-4 shadow-sm">
            <details className="group">
              <summary className="flex items-center justify-between gap-2 cursor-pointer list-none min-h-[36px]">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><Clock className="w-4 h-4 text-primary" aria-hidden="true" /> Horario</span>
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  {openToday ? `Hoy ${openToday.startTime}–${openToday.endTime}` : availability.length ? 'Hoy cerrado' : 'Por confirmar'}
                  <span className="text-primary group-open:rotate-90 transition-transform" aria-hidden="true">›</span>
                </span>
              </summary>
              {availability.length === 0 ? (
                <p className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-control p-3">Aún no publica su horario. Pregúntale por WhatsApp.</p>
              ) : (
                <div className="mt-2 divide-y divide-slate-50">
                  {DAYS.map((day, idx) => {
                    const row = availability.find((a: any) => a.dayOfWeek === idx);
                    const isToday = new Date().getDay() === idx;
                    return (
                      <div key={day} className={`flex justify-between py-1.5 text-xs ${isToday ? 'font-extrabold text-slate-900' : 'text-slate-600'}`}>
                        <span>{day}{isToday && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1">Hoy</span>}</span>
                        <span>{row && row.isActive !== false ? `${row.startTime} – ${row.endTime}` : 'Cerrado'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </details>
          </Card>

        </div>
      </div>

      {/* Reputación: debajo del primer pantallazo (se extiende solo porque rompe la reseña) */}
      <Card className="p-5 shadow-sm mt-5">
        <h2 className="text-base text-slate-900 mb-1 flex items-center gap-2"><Star className="w-5 h-5 text-primary" aria-hidden="true" /> Reputación</h2>
        <p className="text-xs text-slate-500 mb-3">Basada en servicios completados en la plataforma. Sin reseñas inventadas.</p>
        {hasRating ? (
          <div className="flex items-center gap-4 bg-slate-50 rounded-control p-4">
            <div className="text-4xl font-black text-slate-900">{provider.rating.toFixed(1)}</div>
            <div className="text-sm text-slate-600">
              <div className="flex gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(provider.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <p className="mt-1"><strong>{provider.completedJobs}</strong> servicios completados{provider.trustScore > 0 ? ` · confianza ${Math.round(provider.trustScore)}%` : ''}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-control p-4 text-sm text-slate-600">
            Este prestador aún no tiene calificaciones. Se publican solo después de servicios completados. Reporta cualquier problema a contacto@redmecanica.cl
          </div>
        )}
      </Card>

      {/* Similares */}
      {similar.length > 0 && (
        <div className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-slate-900">También en tu zona</h2>
            <Link to={`/search?commune=${encodeURIComponent(provider.commune || '')}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-blue-800">
              Ver todos <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-4">
            {similar.map((p: any) => (
              <ProviderCard key={p.id} provider={p} onSelect={(sel) => navigate(`/proveedor/${sel.id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* Botón flotante móvil para contacto de urgencia */}
      <StickyWhatsAppButton
        providerId={provider.id}
        phone={provider.phone}
        providerName={name}
        commune={provider.commune}
      />

      {/* Modal Wizard de Pre-calificación de Leads */}
      {provider.phone && (
        <LeadQualificationModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          phonePrestador={provider.phone}
          nombrePrestador={name}
          comunaSugerida={provider.commune}
        />
      )}
    </div>
  );
};

export default ProviderProfilePage;
