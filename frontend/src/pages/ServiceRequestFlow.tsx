import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  createJob, 
  getProviders, 
  getServices, 
  createQuote, 
  getQuotesByJob,
  acceptQuote,
  createPayment,
  getPaymentMethods 
} from '../services/api';
import { Service, Vehicle } from '../types';
import TriageChatbot from '../features/jobs/TriageChatbot';
import SEO from '../components/SEO';
import { useSuccessToast, useErrorToast, useInfoToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { carMakes, vehicleYears } from '../services/mockData';

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const ServiceRequestFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const showInfo = useInfoToast();
  const confirm = useConfirm();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  
  const [vehicle, setVehicle] = useState<Vehicle>({ 
    make: carMakes[0].make, 
    model: carMakes[0].models[0], 
    year: vehicleYears[0],
    licensePlate: ''
  });
  
  const [problemDescription, setProblemDescription] = useState('');
  const [job, setJob] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('webpay');

  useEffect(() => {
    const init = async () => {
      await loadServices();
      loadPaymentMethods();
      
      // Auto-seleccionar servicio si viene en la URL
      const serviceId = searchParams.get('serviceId');
      if (serviceId) {
        // Buscamos el servicio en la lista cargada (necesitamos usar el scope de la función o esperar a que services cambie)
        // Pero dado que loadServices actualiza el estado, usaremos un efecto separado o manejaremos el resultado directamente.
      }
    };
    init();
  }, []);

  // Efecto separado para manejar la pre-selección una vez cargados los servicios
  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Si ya tenemos servicio, podríamos saltar al paso de búsqueda de prestadores, 
        // pero mejor dejar que el usuario confirme su vehículo primero.
      }
    }
  }, [services, searchParams]);

  // Show success toast when reaching step 5
  useEffect(() => {
    if (step === 5) {
      showSuccess('🎉 ¡Solicitud completada! Te contactaremos pronto.');
    }
  }, [step]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
      showError('No pudimos cargar los servicios. Intenta recargar la página.');
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleSearchProviders = async () => {
    if (!selectedService) {
      showError('Por favor selecciona un servicio primero');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        lat: '-33.4489',
        lng: '-70.6693',
        radius: '15'
      };
      
      const data = await getProviders(params);
      setProviders(data.slice(0, 5));
      setStep(2);
      showSuccess(`✅ Encontramos ${data.length} Prestadores cercanos`);
    } catch (err) {
      setError('Error al buscar Prestadores');
      showError('❌ No pudimos buscar Prestadores. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = async (provider: any) => {
    const shouldProceed = await confirm({
      title: '¿Solicitar cotización?',
      message: `¿Quieres solicitar una cotización a ${provider.user?.name || 'este prestador'}?`,
      confirmText: 'Solicitar',
      cancelText: 'Cancelar',
      confirmVariant: 'primary',
      icon: 'info'
    });
    
    if (shouldProceed) {
      setSelectedProvider(provider);
      handleRequestQuote(provider);
    }
  };

  const handleRequestQuote = async (provider: any) => {
    setLoading(true);
    setError(null);
    try {
      if (!job && selectedService) {
        const jobData = await createJob({
          serviceId: selectedService.id,
          problemDescription: problemDescription || `Solicitud de servicio: ${selectedService.name}`
        });
        setJob(jobData);
      }
      
      const quoteData = await createQuote({
        jobId: job?.id || 'demo-job',
        providerId: provider.id,
        preliminaryDiagnosis: problemDescription,
        totalCost: selectedService.price,
        estimatedDuration: 60,
        warranty: '30 días'
      });
      
      setQuotes([quoteData]);
      setStep(3);
      showSuccess('✅ ¡Cotización recibida! Revisa los detalles.');
    } catch (err) {
      setError('Error al solicitar cotización');
      showError('❌ No pudimos solicitar la cotización. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quote: any) => {
    const shouldAccept = await confirm({
      title: '¿Aceptar cotización?',
      message: `¿Confirmas que quieres aceptar esta cotización de ${selectedService?.price?.toLocaleString('es-CL')}?`,
      confirmText: 'Aceptar',
      cancelText: 'Revisar',
      confirmVariant: 'primary',
      icon: 'info'
    });
    
    if (shouldAccept) {
      setSelectedQuote(quote);
      setStep(4);
      showSuccess('✅ Cotización aceptada. Procede al pago.');
    }
  };

  const handlePayment = async () => {
    const shouldPay = await confirm({
      title: '¿Confirmar pago?',
      message: `Vas a pagar ${selectedService?.price?.toLocaleString('es-CL')} que será retenido en escrow hasta que recibas el servicio.`,
      confirmText: 'Pagar',
      cancelText: 'Cancelar',
      confirmVariant: 'primary',
      icon: 'info'
    });

    if (!shouldPay) return;

    setLoading(true);
    setError(null);

    try {
      if (!job && selectedService) {
        const jobData = await createJob({
          serviceId: selectedService.id,
          problemDescription: problemDescription || `Solicitud de servicio: ${selectedService.name}`
        });
        setJob(jobData);
      }

      const paymentData = await createPayment({
        jobId: job?.id || 'demo-job',
        amount: selectedService?.price || 0,
        paymentMethod: selectedPaymentMethod
      });

      if (paymentData.token && selectedPaymentMethod === 'webpay') {
        showSuccess(`✅ Pago procesado. Token: ${paymentData.token.substring(0, 8)}...`);
      } else {
        showSuccess('✅ ¡Pago completado exitosamente!');
      }

      setStep(5);
    } catch (err) {
      setError('Error al procesar pago');
      showError('❌ No pudimos procesar el pago. Verifica tus datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const shouldCancel = await confirm({
      title: '¿Cancelar solicitud?',
      message: '¿Estás seguro de que quieres cancelar? Perderás todo el progreso.',
      confirmText: 'Sí, cancelar',
      cancelText: 'Continuar',
      confirmVariant: 'secondary',
      icon: 'warning'
    });

    if (shouldCancel) {
      showInfo('Solicitud cancelada');
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Paso 1 de 5</span>
              <h2 className="text-2xl font-bold mt-3">¿Qué servicio necesitas?</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu vehículo</label>
              <div className="grid grid-cols-3 gap-3">
                <select 
                  value={vehicle.make}
                  onChange={(e) => {
                    const make = carMakes.find(m => m.make === e.target.value);
                    setVehicle({ ...vehicle, make: e.target.value, model: make?.models[0] || '' });
                  }}
                  className="p-3 border rounded-lg"
                >
                  {carMakes.map(m => <option key={m.make} value={m.make}>{m.make}</option>)}
                </select>
                <select 
                  value={vehicle.model}
                  onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                  className="p-3 border rounded-lg"
                >
                  {carMakes.find(m => m.make === vehicle.make)?.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={vehicle.year}
                  onChange={(e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) })}
                  className="p-3 border rounded-lg"
                >
                  {vehicleYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona un servicio</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                      <p className="font-bold text-blue-600">
                        ${service.price?.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe el problema (opcional)</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Ej: Ruido al frenar, no parte el auto, perdida de aceite..."
                className="w-full p-3 border rounded-lg"
                rows={3}
              />
            </div>

            <button
              onClick={handleSearchProviders}
              disabled={!selectedService || loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold disabled:opacity-50"
            >
              {loading ? 'Buscando Prestadores...' : 'Buscar Prestadores'}
            </button>

            <button
              onClick={handleCancel}
              className="w-full text-gray-500 py-3 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Paso 2 de 5</span>
              <h2 className="text-2xl font-bold mt-3">Elige un proveedor</h2>
              <p className="text-gray-500 text-sm mt-1">Selecciona un proveedor para recibir su cotización</p>
            </div>

            <div className="space-y-3">
              {providers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay Prestadores disponibles en este momento</p>
                  <button onClick={() => setStep(1)} className="text-blue-600 underline">
                    Volver a seleccionar servicio
                  </button>
                </div>
              ) : (
                providers.map(provider => (
                  <div
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider)}
                    className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{provider.user?.name || 'Prestador'}</p>
                        <p className="text-sm text-gray-500">{provider.type} • {provider.commune}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500">⭐ {provider.rating || '5.0'}</span>
                          <span className="text-green-600 text-sm">✓ Verificado</span>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Solicitar Cotización
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setStep(1)} className="text-gray-500 underline">
                ← Volver
              </button>
              <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors">
                Cancelar solicitud
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Paso 3 de 5</span>
              <h2 className="text-2xl font-bold mt-3">Cotización recibida</h2>
            </div>

            {quotes.length > 0 ? (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-lg">{selectedProvider?.user?.name}</p>
                    <p className="text-gray-500">{selectedProvider?.type}</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${selectedService?.price?.toLocaleString('es-CL')}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Servicio:</span>
                    <span>{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiempo estimado:</span>
                    <span>60 minutos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Garantía:</span>
                    <span>30 días</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptQuote(quotes[0])}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-4"
                >
                  Aceptar Cotización
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Esperando cotización...</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => setStep(2)} className="text-gray-500 underline">
                ← Volver
              </button>
              <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors">
                Cancelar solicitud
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Paso 4 de 5</span>
              <h2 className="text-2xl font-bold mt-3">Método de pago</h2>
              <p className="text-gray-500 text-sm mt-1">El pago será retenido hasta que confirmes el servicio</p>
            </div>

            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <span className="text-green-600 font-bold">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                🔒 Tu dinero estará protegido en escrow hasta que confirmes que el servicio fue completado a tu satisfacción.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold disabled:opacity-50"
            >
              {loading ? 'Procesando...' : `Pagar $${selectedService?.price?.toLocaleString('es-CL')}`}
            </button>

            <div className="flex flex-col gap-3">
              <button onClick={() => setStep(3)} className="text-gray-500 underline">
                ← Volver
              </button>
              <button onClick={handleCancel} className="text-red-500 hover:text-red-700 transition-colors">
                Cancelar solicitud
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h2>
            <p className="text-gray-500 mb-6">
              El proveedor {selectedProvider?.user?.name} ha sido notificado.<br/>
              Te contactará pronto para confirmar los detalles.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
              <p className="font-medium mb-2">Resumen:</p>
              <div className="text-sm space-y-1">
                <p><span className="text-gray-500">Servicio:</span> {selectedService?.name}</p>
                <p><span className="text-gray-500">Prestador:</span> {selectedProvider?.user?.name}</p>
                <p><span className="text-gray-500">Monto:</span> ${selectedService?.price?.toLocaleString('es-CL')}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              Volver al inicio
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="Solicitar Servicio Mecánico | Cotiza Gratis"
        description="Solicita servicios mecánicos a domicilio en Chile. Cotiza gratis, compara precios y contrata profesionales verificados con garantía."
        keywords="solicitar mecánico, cotizar servicio auto, mecánico a domicilio Chile"
        canonicalUrl="https://redmecanica.cl/solicitar"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-gray-900">Solicitar Servicio</h1>
            <p className="text-gray-500">Conecta con los mejores profesionales</p>
          </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {renderStep()}
        </div>
        </div>
      </div>
    </>
  );
};

export default ServiceRequestFlow;
