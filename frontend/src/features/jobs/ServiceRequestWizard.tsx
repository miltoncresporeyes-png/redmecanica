
import React, { useState, useEffect } from 'react';
import { Service, ServiceRequest, Vehicle } from '../../types';
import { carMakes, vehicleYears } from '../../services/mockData';
import { getServices } from '../../services/api';
import Card from '../../components/common/Card';
import AIAssistant from './AIAssistant';
import VisualEstimator from './VisualEstimator';
import TriageChatbot from './TriageChatbot';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { MARCAS_VEHICULOS, TIPOS_PROBLEMA } from '../../data/autocompleteData';

interface ServiceRequestWizardProps {
  onSubmit: (request: ServiceRequest) => void;
  onCancel: () => void;
  initialMode?: 'list' | 'ai' | 'visual' | 'triage';
}

const ServiceRequestWizard: React.FC<ServiceRequestWizardProps> = ({ onSubmit, onCancel, initialMode = 'list' }) => {
  const [step, setStep] = useState(initialMode === 'list' ? 1 : 2);
  const [vehicle, setVehicle] = useState<Vehicle>({ make: carMakes[0].make, model: carMakes[0].models[0], year: vehicleYears[0] });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [diagnosticMode, setDiagnosticMode] = useState<'list' | 'ai' | 'visual' | 'triage'>(initialMode);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const services = await getServices();
        setAvailableServices(services);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setError("No se pudieron cargar los servicios. Asegúrese de que el backend esté en ejecución.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleVehicleChange = (field: keyof Vehicle, value: string | number) => {
    const newVehicle = { ...vehicle, [field]: value };
    if (field === 'make') {
        const newMake = carMakes.find(m => m.make === value);
        if (newMake) {
            newVehicle.model = newMake.models[0];
        }
    }
    setVehicle(newVehicle);
  };
  
  const handleSelectService = (service: Service) => {
      setSelectedService(service);
      setStep(3);
  }

  const renderPrice = (price: number | [number, number]) => {
    if (Array.isArray(price)) {
      return `Desde ${price[0].toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`;
    }
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">1. Selecciona tu Vehículo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <select value={vehicle.make} onChange={(e) => handleVehicleChange('make', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  {carMakes.map(m => <option key={m.make} value={m.make}>{m.make}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <select value={vehicle.model} onChange={(e) => handleVehicleChange('model', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  {carMakes.find(m => m.make === vehicle.make)?.models.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Año</label>
                <select value={vehicle.year} onChange={(e) => handleVehicleChange('year', parseInt(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  {vehicleYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">2. ¿Qué necesitas?</h2>
             <div className="flex justify-center border-b mb-4 flex-wrap gap-1">
                <button onClick={() => setDiagnosticMode('list')} className={`px-3 py-2 font-semibold text-sm sm:text-base ${diagnosticMode === 'list' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Servicios Comunes</button>
                <button onClick={() => setDiagnosticMode('triage')} className={`px-3 py-2 font-semibold text-sm sm:text-base ${diagnosticMode === 'triage' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Guía de Diagnóstico</button>
                <button onClick={() => setDiagnosticMode('ai')} className={`px-3 py-2 font-semibold text-sm sm:text-base ${diagnosticMode === 'ai' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Consulta IA</button>
                <button onClick={() => setDiagnosticMode('visual')} className={`px-3 py-2 font-semibold text-sm sm:text-base ${diagnosticMode === 'visual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Análisis Foto</button>
            </div>
            {diagnosticMode === 'list' && (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Cargando servicios disponibles...</p>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-red-500 mb-2">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="text-blue-600 underline text-sm"
                            >
                                Recargar página
                            </button>
                        </div>
                    ) : (
                        availableServices.map(service => (
                            <li 
                                key={service.id} 
                                onClick={() => handleSelectService(service)} 
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedService?.id === service.id 
                                    ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200' 
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className={`font-bold ${selectedService?.id === service.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                            {selectedService?.id === service.id && <span className="mr-2">✓</span>}
                                            {service.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{service.description}</p>
                                    </div>
                                    <p className="font-black text-blue-600">{renderPrice(service.price)}</p>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
            {diagnosticMode === 'triage' && (
              <TriageChatbot 
                onServiceSelect={handleSelectService} 
                availableServices={availableServices} 
              />
            )}
            {diagnosticMode === 'ai' && (
              <AIAssistant 
                onServiceSelect={handleSelectService} 
                availableServices={availableServices} 
              />
            )}
            {diagnosticMode === 'visual' && (
              <VisualEstimator 
                onServiceSelect={handleSelectService} 
                availableServices={availableServices} 
              />
            )}
          </div>
        );
      case 3:
        return selectedService && (
             <div>
                <h2 className="text-2xl font-bold mb-4 text-center">3. Confirmar Solicitud</h2>
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div><span className="font-semibold">Vehículo:</span> {vehicle.make} {vehicle.model} {vehicle.year}</div>
                    <div><span className="font-semibold">Servicio:</span> {selectedService.name}</div>
                    <div><span className="font-semibold">Costo Estimado:</span> <span className="text-blue-600 font-bold">{renderPrice(selectedService.price)}</span></div>
                    <p className="text-sm text-gray-500">Un mecánico certificado se pondrá en contacto para confirmar los detalles. Tu pago quedará retenido de forma segura (Escrow) hasta que confirmes la satisfacción con el servicio.</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <div className="p-6">
        {renderStep()}
        <div className="mt-8 flex justify-between">
          <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>
          {step < 3 && (
            <button 
              onClick={() => setStep(step + 1)} 
              className={`px-6 py-2 text-white rounded-lg transition-all ${
                (step === 2 && !selectedService) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={step === 2 && !selectedService}
            >
              Siguiente
            </button>
          )}
          {step === 3 && (
            <button onClick={() => onSubmit({ vehicle, service: selectedService! })} className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
              Confirmar y Buscar Mecánico
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceRequestWizard;
