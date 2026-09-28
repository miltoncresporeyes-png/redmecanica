import React from 'react';
import { useNavigate } from 'react-router';
import Card from '../../components/common/Card';

interface Provider {
  id: string;
  type: string;
  businessName?: string;
  specialty?: string;
  specialties?: string;
  experience?: string;
  bio?: string;
  rating: number;
  address?: string;
  commune?: string;
  region?: string;
  phone?: string;
  paymentMethods?: string;
  distance?: number;
  isVerified?: boolean;
  emailVerified?: boolean;
  completedJobs?: number;
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
  const verified = Boolean(provider.isVerified || provider.emailVerified);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MECHANIC': return '🔧';
      case 'WORKSHOP': return '🏭';
      case 'TOWING': return '🚛';
      default: return '⚙️';
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
    ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Hola ${provider.businessName || provider.user?.name || 'prestador'}, vi tu perfil en RedMecánica y quiero cotizar.`)}`
    : null;

  return (
    <Card className="card-market p-4 sm:p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <button onClick={goToProfile} className="relative shrink-0 text-left min-h-[44px]" aria-label={`Ver perfil de ${provider.businessName || provider.user?.name || 'prestador'}`}>
          <span className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner" aria-hidden>
            {getTypeIcon(provider.type)}
          </span>
          {verified && (
            <span className="absolute -bottom-2 -left-2 bg-green-500 text-white w-6 h-6 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xs font-black" title="Prestador verificado">
              ✓
            </span>
          )}
        </button>

        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
            <div className="min-w-0 flex-1">
              <button onClick={goToProfile} className="text-left hover:text-blue-700 min-h-[28px]">
                <h3 className="text-gray-900 leading-tight truncate">
                  {provider.businessName || provider.user?.name || 'Prestador automotriz'}
                </h3>
              </button>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                  {getTypeLabel(provider.type)}
                </span>
                {provider.commune && (
                  <span className="badge-commune">
                    📍 {provider.commune}
                  </span>
                )}
                {verified && (
                  <span className="badge-verified">
                    ✓ Verificado
                  </span>
                )}
                {specs.map((spec) => (
                  <span key={spec} className="text-gray-500 text-[10px] font-bold uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <p className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 shrink-0" aria-label={`Calificación ${(provider.rating || 0).toFixed(1)} de 5`}>
              <span className="text-yellow-600 font-bold mr-1" aria-hidden>★</span>
              <span className="text-gray-800 font-bold text-sm">{(provider.rating || 0).toFixed(1)}</span>
              {!!provider.completedJobs && (
                <span className="text-gray-400 text-xs ml-1">({provider.completedJobs})</span>
              )}
            </p>
          </div>

          {provider.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {provider.bio}
            </p>
          )}

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[13px] text-gray-500">
            <span className="truncate">📍 {provider.commune || 'Santiago'}{provider.region ? `, ${provider.region}` : ''}</span>
            {provider.experience && <span>🛠️ {provider.experience} años</span>}
            {provider.distance !== undefined && !Number.isNaN(provider.distance) && (
              <span className="text-green-600 font-bold">⚡ A {provider.distance.toFixed(1)} km</span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 border-t border-gray-50">
            <p className="text-[11px] text-gray-400 font-medium flex-1">✅ Contacto directo y gratuito · sin cuenta</p>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
              {whatsAppLink ? (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-whatsapp !min-h-[40px] !py-2"
                >
                  💬 WhatsApp
                </a>
              ) : provider.phone ? (
                <a
                  href={`tel:${provider.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="btn-whatsapp !min-h-[40px] !py-2"
                >
                  📞 {provider.phone}
                </a>
              ) : null}
              <button
                onClick={goToProfile}
                className="btn-primary !min-h-[40px] !py-2"
              >
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
