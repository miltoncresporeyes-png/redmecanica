import React from 'react';
import Card from '../../components/common/Card';

interface Provider {
  id: string;
  type: string;
  businessName?: string; // Nombre de la empresa o taller
  specialty?: string; 
  specialties?: string; // Comma-separated list
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
  user?: {
    name: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  onSelect?: (provider: Provider) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onSelect }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MECHANIC': return '🔧';
      case 'WORKSHOP': return '🏭';
      case 'TOWING': return '🚛';
      case 'INSURANCE': return '🛡️';
      default: return '⚙️';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MECHANIC': return 'Mecánico';
      case 'WORKSHOP': return 'Taller';
      case 'TOWING': return 'Grúa';
      case 'INSURANCE': return 'Aseguradora';
      default: return type;
    }
  };

  return (
    <Card className="p-5 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden" onClick={() => onSelect?.(provider)}>
      <div className="flex flex-col md:flex-row items-start gap-5">
        {/* Avatar / Icon Section */}
        <div className="relative">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            {getTypeIcon(provider.type)}
          </div>
          {provider.isVerified && (
            <div className="absolute -bottom-2 -left-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-4 border-white title='Proveedor Verificado'">
              <span className="text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
            <div>
              <h3 className="font-extrabold text-xl text-gray-900 leading-tight">
                {provider.businessName || provider.user?.name || 'Prestador de Servicio'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                  {getTypeLabel(provider.type)}
                </span>
                <div className="flex flex-wrap gap-1 items-center">
                  {(provider.specialties || provider.specialty || '').split(',').map((spec, idx) => (
                    <span 
                      key={idx} 
                      className="text-gray-500 text-[10px] font-bold uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
              <span className="text-yellow-600 font-bold mr-1">★</span>
              <span className="text-gray-800 font-bold text-sm">{provider.rating.toFixed(1)}</span>
            </div>
          </div>
          
          {provider.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {provider.bio}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2 opacity-70">📍</span>
              <span className="truncate">{provider.commune || 'Santiago'}, {provider.region || 'Metropolitana'}</span>
            </div>
            {provider.experience && (
              <div className="flex items-center text-sm text-gray-700 font-medium">
                <span className="mr-2 opacity-70">📅</span>
                <span>{provider.experience} años de trayectoria</span>
              </div>
            )}
            {provider.phone && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2 opacity-70">📞</span>
                <span>{provider.phone}</span>
              </div>
            )}
            {provider.distance !== undefined && (
              <div className="flex items-center text-sm text-green-600 font-bold">
                <span className="mr-2">⚡</span>
                <span>A {provider.distance.toFixed(1)} km de ti</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <div className="flex flex-wrap gap-1.5">
              {(provider.paymentMethods || '').split(',').map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-tighter"
                >
                  {method === 'CASH' ? 'Efectivo' : 
                   method === 'DEBIT' ? 'Débito' : 
                   method === 'CREDIT' ? 'Crédito' : 
                   'Transferencia'}
                </span>
              ))}
            </div>
            
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
              Ver Cotización
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
