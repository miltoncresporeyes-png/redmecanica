import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wrench, Warehouse, Truck, Settings, MapPin, Star, BadgeCheck, MessageCircle, Phone, ShieldCheck, Zap } from 'lucide-react';
import Card from '../../components/common/Card';
import LeadQualificationModal from '../../components/common/LeadQualificationModal';
import { trackProviderEvent } from '../../lib/trackProvider';

interface Provider {
  id: string;
  type: string;
  businessName?: string;
  specialty?: string;
  specialties?: string;
  experience?: string | number | null;
  bio?: string;
  rating: number;
  address?: string;
  commune?: string;
  region?: string;
  phone?: string;
  paymentMethods?: string;
  distance?: number;
  isVerified?: boolean;
  status?: string;
  emailVerified?: boolean;
  plan?: string;
  completedJobs?: number;
  name?: string;
  user?: {
    name: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  onSelect?: (provider: Provider) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect }) => {
  const navigate = useNavigate();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const verified = Boolean(provider.isVerified || provider.status === 'APPROVED');

  const TypeIcon = ({ type }: { type: string }) => {
    const cls = 'w-7 h-7 sm:w-9 sm:h-9 text-primary';
    switch (type) {
      case 'MECHANIC': return <Wrench className={cls} aria-hidden="true" />;
      case 'WORKSHOP': return <Warehouse className={cls} aria-hidden="true" />;
      case 'TOWING': return <Truck className={cls} aria-hidden="true" />;
      default: return <Settings className={cls} aria-hidden="true" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MECHANIC': return 'Mecánico';
      case 'WORKSHOP': return 'Taller';
      case 'TOWING': return 'Grúa';
      default: return type;
    }
  };

  const goToProfile = () => {
    if (onSelect) onSelect(provider);
    else navigate(`/proveedor/${provider.id}`);
  };

  const specs = (provider.specialties || provider.specialty || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const sanitizedPhone = (provider.phone || '').replace(/[^0-9]/g, '');
  const whatsAppLink = sanitizedPhone
    ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Hola ${provider.businessName || provider.user?.name || provider.name || 'prestador'}, vi tu perfil en RedMecánica y quiero cotizar.`)}`
    : null;

  return (
    <Card className="card-market p-4 sm:p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <button onClick={goToProfile} className="relative shrink-0 text-left min-h-[44px]" aria-label={`Ver perfil de ${provider.businessName || provider.user?.name || provider.name || 'prestador'}`}>
          <span className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-card flex items-center justify-center" aria-hidden>
            <TypeIcon type={provider.type} />
          </span>
          {verified && (
            <span className="absolute -bottom-2 -left-2 bg-emerald-600 text-white w-6 h-6 rounded-full shadow-lg border-2 border-white flex items-center justify-center" title="Prestador verificado">
              <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          )}
        </button>

        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
            <div className="min-w-0 flex-1">
              <button onClick={goToProfile} className="text-left hover:text-primary min-h-[28px]">
                <h3 className="text-slate-900 leading-tight truncate">
                  {provider.businessName || provider.user?.name || provider.name || 'Prestador automotriz'}
                </h3>
              </button>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="bg-slate-900 text-white text-xs uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                  {getTypeLabel(provider.type)}
                </span>
                {verified && (
                  <span className="badge-verified">
                    <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Verificado
                  </span>
                )}
                {provider.plan && provider.plan !== 'FREE' && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold uppercase px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" aria-hidden="true" /> Destacado
                  </span>
                )}
                {specs.map((spec) => (
                  <span key={spec} className="text-slate-600 text-xs font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <p className="flex items-center bg-amber-50 px-2 py-1 rounded-control border border-amber-100 shrink-0" aria-label={`Calificación ${(provider.rating || 0).toFixed(1)} de 5`}>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" aria-hidden="true" />
              <span className="text-slate-800 font-bold text-sm">{(provider.rating || 0).toFixed(1)}</span>
              {!!provider.completedJobs && (
                <span className="text-slate-500 text-xs ml-1">({provider.completedJobs})</span>
              )}
            </p>
          </div>

          {provider.bio && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
              {provider.bio}
            </p>
          )}

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 truncate"><MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />{provider.commune || 'Santiago'}{provider.region ? `, ${provider.region}` : ''}</span>
            {provider.experience && <span className="inline-flex items-center gap-1.5"><Wrench className="w-4 h-4 text-slate-400" aria-hidden="true" />{provider.experience} años</span>}
            {provider.distance !== undefined && !Number.isNaN(provider.distance) && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold"><Zap className="w-4 h-4" aria-hidden="true" />A {provider.distance.toFixed(1)} km</span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-slate-50">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-1"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />Contacto directo y gratuito · sin cuenta</p>
            <div className="flex flex-col sm:flex-row gap-2">
              {sanitizedPhone ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackProviderEvent(provider.id, 'WHATSAPP');
                    setIsLeadModalOpen(true);
                  }}
                  className="btn-whatsapp !min-h-[40px] !py-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
                </button>
              ) : provider.phone ? (
                <a
                  href={`tel:${provider.phone}`}
                  onClick={(e) => { e.stopPropagation(); trackProviderEvent(provider.id, 'CALL'); }}
                  className="btn-whatsapp !min-h-[40px] !py-2"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" /> {provider.phone}
                </a>
              ) : null}
              <button
                onClick={goToProfile}
                className="btn-cta !min-h-[40px] !py-2"
              >
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {sanitizedPhone && (
        <LeadQualificationModal
          isOpen={isLeadModalOpen}
          onClose={() => setIsLeadModalOpen(false)}
          phonePrestador={sanitizedPhone}
          nombrePrestador={provider.businessName || provider.user?.name || provider.name || 'Prestador automotriz'}
          comunaSugerida={provider.commune}
        />
      )}
    </Card>
  );
};

export default ProviderCard;
