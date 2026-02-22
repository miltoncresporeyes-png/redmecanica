import React from 'react';
import { 
  Search, 
  FileText, 
  Users, 
  CheckCircle, 
  Truck, 
  MapPin, 
  ClipboardList, 
  Wrench, 
  Package, 
  Star, 
  XCircle,
  Clock,
  AlertCircle,
  Shield
} from 'lucide-react';

interface JobTimelineProps {
  currentStatus: string;
  showPast?: boolean;
}

const JOB_STATES = [
  { key: 'SEARCHING', label: 'Buscando Proveedor', icon: Search, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { key: 'QUOTING', label: 'Esperando Cotizaciones', icon: FileText, color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
  { key: 'COMPARING_QUOTES', label: 'Comparando Cotizaciones', icon: Users, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
  { key: 'CONFIRMED', label: 'Trabajo Confirmado', icon: CheckCircle, color: 'bg-green-500', bgColor: 'bg-green-50' },
  { key: 'PROVIDER_EN_ROUTE', label: 'Proveedor en Camino', icon: Truck, color: 'bg-orange-500', bgColor: 'bg-orange-50' },
  { key: 'PROVIDER_ARRIVED', label: 'Proveedor ha Llegado', icon: MapPin, color: 'bg-orange-600', bgColor: 'bg-orange-50' },
  { key: 'DIAGNOSING', label: 'Diagnosticando', icon: ClipboardList, color: 'bg-cyan-500', bgColor: 'bg-cyan-50' },
  { key: 'IN_PROGRESS', label: 'Servicio en Progreso', icon: Wrench, color: 'bg-blue-600', bgColor: 'bg-blue-50' },
  { key: 'WORK_COMPLETED', label: 'Trabajo Completado', icon: Package, color: 'bg-teal-500', bgColor: 'bg-teal-50' },
  { key: 'DELIVERED', label: 'Entregado', icon: CheckCircle, color: 'bg-green-600', bgColor: 'bg-green-50' },
  { key: 'REVIEWED', label: 'Evaluado', icon: Star, color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
  { key: 'CLOSED', label: 'Cerrado', icon: Shield, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
];

const ERROR_STATES = [
  { key: 'CANCELLED', label: 'Cancelado', icon: XCircle, color: 'bg-red-500', bgColor: 'bg-red-50' },
  { key: 'DISPUTED', label: 'En Disputa', icon: AlertCircle, color: 'bg-red-600', bgColor: 'bg-red-50' },
  { key: 'REFUNDED', label: 'Reembolsado', icon: Clock, color: 'bg-gray-500', bgColor: 'bg-gray-50' },
];

const JobTimeline: React.FC<JobTimelineProps> = ({ currentStatus, showPast = true }) => {
  const getCurrentStateIndex = () => {
    const index = JOB_STATES.findIndex(s => s.key === currentStatus);
    if (index === -1) {
      const errorIndex = ERROR_STATES.findIndex(s => s.key === currentStatus);
      return errorIndex >= 0 ? -2 : -1;
    }
    return index;
  };

  const currentIndex = getCurrentStateIndex();
  const isErrorState = currentStatus === 'CANCELLED' || currentStatus === 'DISPUTED' || currentStatus === 'REFUNDED';

  const renderTimeline = () => {
    if (isErrorState) {
      const errorState = ERROR_STATES.find(s => s.key === currentStatus);
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <div className={`w-20 h-20 ${errorState?.bgColor} rounded-full flex items-center justify-center mb-4`}>
            {errorState && <errorState.icon className={`w-10 h-10 ${errorState.color.replace('bg-', 'text-')}`} />}
          </div>
          <h3 className={`text-xl font-bold ${errorState?.color.replace('bg-', 'text-')}`}>
            {errorState?.label}
          </h3>
          <p className="text-gray-500 mt-2 text-center">
            Este trabajo ha sido {currentStatus.toLowerCase()}
          </p>
        </div>
      );
    }

    if (currentIndex === -1) {
      return (
        <div className="text-center p-8">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Estado Desconocido</h3>
          <p className="text-gray-500 mt-2">El estado actual no está disponible</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-0">
          {JOB_STATES.map((state, index) => {
            const isCompleted = showPast && index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const Icon = state.icon;

            return (
              <div 
                key={state.key} 
                className={`relative flex items-start gap-4 p-4 ${
                  isCurrent ? 'bg-blue-50 rounded-xl' : ''
                }`}
              >
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? `${state.color} text-white` 
                    : isCurrent 
                      ? `${state.color} text-white ring-4 ring-blue-100 animate-pulse`
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-7 h-7" />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 pt-3">
                  <h4 className={`font-bold ${
                    isCompleted 
                      ? 'text-gray-400' 
                      : isCurrent 
                        ? `${state.color.replace('bg-', 'text-')}`
                        : 'text-gray-400'
                  }`}>
                    {state.label}
                  </h4>
                  {isCurrent && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getStatusDescription(state.key)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusDescription = (status: string): string => {
    const descriptions: Record<string, string> = {
      'SEARCHING': 'Estamos buscando el mejor proveedor para ti...',
      'QUOTING': 'Los Prestadores están preparando sus cotizaciones.',
      'COMPARING_QUOTES': 'Revisa y compara las cotizaciones recibidas.',
      'CONFIRMED': '¡Excelentes noticias! Has aceptado una cotización.',
      'PROVIDER_EN_ROUTE': 'El proveedor está en camino a tu ubicación.',
      'PROVIDER_ARRIVED': 'El proveedor ha llegado a tu ubicación.',
      'DIAGNOSING': 'El proveedor está evaluando el vehículo.',
      'IN_PROGRESS': 'El servicio está siendo realizado.',
      'WORK_COMPLETED': 'El trabajo principal ha sido completado.',
      'DELIVERED': 'El vehículo ha sido entregado.',
      'REVIEWED': 'Gracias por tu evaluación.',
      'CLOSED': 'El trabajo ha sido cerrado exitosamente.',
    };
    return descriptions[status] || '';
  };

  const getStatusSummary = () => {
    if (isErrorState) {
      return null;
    }

    const progress = Math.round((currentIndex / (JOB_STATES.length - 1)) * 100);
    
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso del servicio</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentIndex === 0 && 'Tu solicitud está siendo procesada'}
          {currentIndex > 0 && currentIndex < 6 && 'El proveedor está en camino'}
          {currentIndex >= 6 && currentIndex < 10 && 'El servicio está en progreso'}
          {currentIndex >= 10 && '¡Casi terminamos!'}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {getStatusSummary()}
      {renderTimeline()}
    </div>
  );
};

export default JobTimeline;
