import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Star, Shield, Wrench, Car } from 'lucide-react';
import { getQuotesByJob, acceptQuote, rejectQuote } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

interface Quote {
  id: string;
  providerId: string;
  preliminaryDiagnosis: string;
  serviceItems: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  estimatedDuration: number;
  warranty: string;
  paymentMethods: string;
  status: string;
  validUntil: string;
  provider?: {
    name: string;
    rating: number;
    trustScore: number;
    specialty: string;
    yearsExperience: number;
  };
}

interface QuoteComparisonProps {
  jobId: string;
  onQuoteAccepted: (quote: Quote) => void;
  onCancel: () => void;
}

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ jobId, onQuoteAccepted, onCancel }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadQuotes();
  }, [jobId]);

  const loadQuotes = async () => {
    try {
      const data = await getQuotesByJob(jobId);
      setQuotes(data.filter((q: Quote) => q.status === 'SENT' || q.status === 'ACCEPTED'));
    } catch (error) {
      console.error('Error loading quotes:', error);
      showError('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (quoteId: string) => {
    setAcceptingId(quoteId);
    try {
      const acceptedQuote = await acceptQuote(quoteId);
      showSuccess('¡Cotización aceptada! Te contactaremos pronto.');
      onQuoteAccepted(quotes.find(q => q.id === quoteId)!);
    } catch (error: any) {
      showError(error.response?.data?.error || 'Error al aceptar la cotización');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (quoteId: string) => {
    try {
      await rejectQuote(quoteId);
      showSuccess('Cotización rechazada');
      loadQuotes();
    } catch (error) {
      showError('Error al rechazar la cotización');
    }
  };

  const parseServiceItems = (items: string) => {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-xl">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">Esperando cotizaciones</h3>
        <p className="text-gray-500">Los Prestadores están preparando sus cotizaciones...</p>
        <button
          onClick={loadQuotes}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Compara las Cotizaciones
        </h2>
        <p className="text-gray-500">
          Has recibido {quotes.length} cotización{quotes.length !== 1 ? 'es' : ''}. Elige la mejor opción.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote, index) => (
          <div
            key={quote.id}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
              index === 1 ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-100'
            }`}
          >
            {index === 1 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                Recomendada
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {quote.provider?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{quote.provider?.name || `Proveedor ${index + 1}`}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{quote.provider?.rating?.toFixed(1) || '5.0'}</span>
                      <span className="text-gray-400">•</span>
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">{quote.provider?.trustScore || 100}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wrench className="w-4 h-4" />
                  <span>{quote.provider?.specialty || 'Servicio General'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>{quote.provider?.yearsExperience || 1} años de experiencia</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Diagnóstico:</span> {quote.preliminaryDiagnosis || 'No especificado'}
                </p>

                {parseServiceItems(quote.serviceItems).length > 0 && (
                  <div className="space-y-2 mb-3">
                    {parseServiceItems(quote.serviceItems).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.descripcion}</span>
                        <span className="font-medium">${item.costo?.toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Mano de obra:</span>
                  <span>${quote.laborCost?.toLocaleString('es-CL') || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Repuestos:</span>
                  <span>${quote.partsCost?.toLocaleString('es-CL') || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Tiempo estimado:</span>
                  <span className="font-semibold">{quote.estimatedDuration || 60} min</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Garantía:</span>
                  <span className="font-semibold text-green-600">{quote.warranty || 'Sin garantía'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Formas de pago:</span>
                  <span className="font-semibold">{quote.paymentMethods || 'Efectivo'}</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="text-3xl font-black text-gray-800">${quote.totalCost?.toLocaleString('es-CL')}</span>
                {quote.validUntil && (
                  <p className="text-xs text-orange-500 mt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Válido hasta {new Date(quote.validUntil).toLocaleDateString('es-CL')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleAccept(quote.id)}
                  disabled={acceptingId === quote.id}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {acceptingId === quote.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Aceptar Cotización
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(quote.id)}
                  className="w-full py-2 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default QuoteComparison;
