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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
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
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 mb-4" aria-label="Migas de pan">
        <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
        <span aria-hidden="true">/</span>
        <Link to="/search" className="hover:text-blue-600 transition-colors">Directorio</Link>
        <span aria-hidden="true">/</span>
        {provider.commune && (
          <>
            <Link to={`/search?commune=${encodeURIComponent(provider.commune)}`} className="hover:text-blue-600 transition-colors">
              {provider.commune}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-slate-900 font-bold truncate max-w-[200px]">{name}</span>
      </div>

      {/* Header vitrina */}
      <Card className="p-6 md:p-8 mb-6 shadow-md overflow-hidden">
        <p className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold py-1.5 px-3 rounded-full mb-5">
          <CircleCheck className="w-4 h-4" aria-hidden="true" /> Vitrina gratuita · contacto directo
        </p>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-blue-50 text-primary rounded-card flex items-center justify-center border border-blue-100">
              <TypeIcon className="w-11 h-11" />
            </div>
            {verified && (
              <div className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border-4 border-white">
                <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Verificado
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
              <h1 className="text-slate-900">
                {name}
              </h1>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-3">
              <span className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded uppercase tracking-wider">{typeLabel}</span>
              {provider.commune && (
                <Link
                  to={`/search?commune=${encodeURIComponent(provider.commune)}`}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 font-bold text-xs px-2.5 py-1 rounded hover:bg-blue-100"
                >
                  <MapPin className="w-3 h-3" aria-hidden="true" /> {provider.commune}
                </Link>
              )}
              {openToday ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold text-xs px-2.5 py-1 rounded">
                  <Clock className="w-3 h-3" aria-hidden="true" /> Hoy {openToday.startTime}–{openToday.endTime}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-bold text-xs px-2.5 py-1 rounded">
                  <Clock className="w-3 h-3" aria-hidden="true" /> Horario por confirmar
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center md:justify-start mb-3 text-sm">
              {hasRating ? (
                <span className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {provider.rating.toFixed(1)}
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Nuevo en RedMecánica</span>
              )}
              <span className="text-xs text-slate-600 font-medium">{provider.completedJobs || 0} servicios</span>
              {provider.experience && <span className="text-xs text-slate-600 font-medium">{provider.experience} años de experiencia</span>}
              <button onClick={handleShare} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-blue-800 min-h-[32px]">
                {copied ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Link copiado</> : <><Share2 className="w-3.5 h-3.5" aria-hidden="true" /> Compartir</>}
              </button>
            </div>

            {specialtiesList.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {specialtiesList.slice(0, 8).map((spec: string) => (
                  <span key={spec} className="bg-slate-50 text-slate-700 border border-slate-200 rounded px-2.5 py-0.5 text-xs font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA contacto directo con pre-calificación */}
        <div className="mt-6 grid sm:grid-cols-2 gap-2">
          {provider.phone ? (
            <button
              type="button"
              onClick={() => { trackProviderEvent(provider.id, 'WHATSAPP'); setIsLeadModalOpen(true); }}
              className="btn-whatsapp"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" /> Contactar por WhatsApp
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="btn bg-slate-200 text-slate-600 cursor-not-allowed"
            >
              Sin WhatsApp disponible
            </button>
          )}
          {provider.phone ? (
            <a
              onClick={() => trackProviderEvent(provider.id, 'CALL')}
              href={`tel:${provider.phone}`}
              className="btn-dark"
            >
              <Phone className="w-4 h-4" aria-hidden="true" /> {provider.phone}
            </a>
          ) : (
            <Link
              to={`/search?commune=${encodeURIComponent(provider.commune || '')}`}
              className="btn-ghost"
            >
              <Search className="w-4 h-4" aria-hidden="true" /> Ver más en {provider.commune || 'tu comuna'}
            </Link>
          )}
        </div>
        <p className="text-center text-xs text-slate-500 mt-3">Sin cuenta · sin comisión para ti como conductor · el trato es directo con el prestador</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Servicios */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg text-slate-900 mb-1 flex items-center gap-2"><Hammer className="w-5 h-5 text-primary" aria-hidden="true" /> Servicios que promociona</h2>
            <p className="text-xs text-slate-400 mb-4">Publicados por el prestador en su vitrina</p>
            {specialtiesList.length === 0 ? (
              <p className="text-sm text-slate-500">Este prestador aún no detalla sus servicios. Contáctalo por WhatsApp y pide su lista de precios.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {specialtiesList.map((spec: string) => (
                  <div key={spec} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-control px-3 py-2.5 text-sm font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" /> {spec}
                  </div>
                ))}
              </div>
            )}
            {provider.bio && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <h3 className="text-sm text-slate-900 mb-1 flex items-center gap-2"><ScrollText className="w-4 h-4 text-primary" aria-hidden="true" /> Presentación</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{provider.bio}</p>
              </div>
            )}
          </Card>

          {/* Horarios */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg text-slate-900 mb-1 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" aria-hidden="true" /> Horario de atención</h2>
            <p className="text-xs text-slate-400 mb-4">Confirma por WhatsApp antes de ir, especialmente fines de semana</p>
            {availability.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-control p-4 text-sm text-amber-800">
                Este prestador aún no publica su horario. Toca WhatsApp y pregúntale directamente — responde como negocio local.
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {DAYS.map((day, idx) => {
                  const row = availability.find((a: any) => a.dayOfWeek === idx);
                  const isToday = new Date().getDay() === idx;
                  return (
                    <div key={day} className={`flex justify-between py-2 text-sm ${isToday ? 'font-extrabold text-slate-900' : 'text-slate-600'}`}>
                      <span>{day} {isToday && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1">Hoy</span>}</span>
                      <span>{row && row.isActive !== false ? `${row.startTime} – ${row.endTime}` : 'Cerrado'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Reseñas honestas */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg text-slate-900 mb-1 flex items-center gap-2"><Star className="w-5 h-5 text-primary" aria-hidden="true" /> Reputación</h2>
            <p className="text-xs text-slate-400 mb-4">Basada en servicios completados en la plataforma</p>
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
                Este prestador aún no tiene calificaciones. Se publican solo después de servicios completados en la plataforma.
              </div>
            )}
            <p className="text-xs text-slate-500 mt-3">Las reseñas escritas se habilitan después de cada servicio verificado. Sin reseñas inventadas.</p>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Cobertura */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-slate-900 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" aria-hidden="true" /> Cobertura</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Comuna base</span>
                <Link to={`/search?commune=${encodeURIComponent(provider.commune || '')}`} className="font-bold text-blue-700 hover:underline">
                  {provider.commune || '—'}
                </Link>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Región</span>
                <span className="font-bold text-slate-800">{provider.region || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dirección</span>
                <span className="font-bold text-slate-800 text-right max-w-[60%]">{provider.address || 'Atención a domicilio'}</span>
              </div>
            </div>
            <Link
              to={`/search?commune=${encodeURIComponent(provider.commune || '')}`}
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-control transition-colors"
            >
              Ver más prestadores en {provider.commune || 'la comuna'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Card>

          {/* Pagos */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-slate-900 mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" aria-hidden="true" /> Pagos</h3>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethodsList.length === 0 ? (
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">A convenir por WhatsApp</span>
              ) : (
                paymentMethodsList.map((m: string) => (
                  <span key={m} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {m === 'CASH' ? 'Efectivo' : m === 'DEBIT' ? 'Débito' : m === 'CREDIT' ? 'Crédito' : m === 'TRANSFER' ? 'Transferencia' : m}
                  </span>
                ))
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">El pago es directo al prestador. RedMecánica no cobra comisión al conductor.</p>
          </Card>

          {/* Confianza */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-slate-900 mb-3 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" /> Verificación</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                {verified ? <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" /> : <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />}
                {verified ? 'Perfil verificado por RedMecánica' : 'Perfil aún sin verificar por RedMecánica'}
              </li>
              <li className="flex items-start gap-2">
                {provider.phoneVerified ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" /> : <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />}
                {provider.phoneVerified ? 'Teléfono validado' : 'Teléfono publicado por el prestador'}
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                Reporta cualquier problema a contacto@redmecanica.cl
              </li>
            </ul>
          </Card>
        </div>
      </div>

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
