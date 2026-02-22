import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionPlans, createSubscription, SubscriptionPlan } from '../../services/api';

interface PricingPlansProps {
  providerId: string;
  currentPlan?: string;
  onPlanSelected?: (planId: string) => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ providerId, currentPlan, onPlanSelected }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      setError('Error al cargar los planes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!providerId) {
      navigate('/login?redirect=/pricing');
      return;
    }

    setProcessing(planId);
    try {
      const result = await createSubscription({
        providerId,
        plan: planId as 'MONTHLY' | 'YEARLY' | 'PROFESSIONAL',
        paymentMethod: 'WEBPAY',
        autoRenew: true,
      });

      if (result.paymentRequired && result.subscription) {
        onPlanSelected?.(planId);
        alert(`Plan ${plans[planId]?.name} seleccionado. ID de suscripción: ${result.subscription.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al seleccionar el plan');
    } finally {
      setProcessing(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const planEntries = Object.entries(plans);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Elige tu plan de trabajo
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comienza a recibir clientes ahora mismo. Todos los planes incluyen perfil verificado y acceso a nuestra plataforma.
        </p>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {planEntries.map(([planId, plan]) => {
          const isCurrentPlan = currentPlan === planId;
          const isYearly = planId === 'YEARLY';
          const savings = planId === 'MONTHLY' ? Math.round((plan.price * 12 - 150000) / 1000) * 1000 : 0;

          return (
            <div
              key={planId}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                isYearly ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {isYearly && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Mejor valor
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  {planId !== 'PROFESSIONAL' && (
                    <span className="text-gray-500">/{planId === 'MONTHLY' ? 'mes' : 'año'}</span>
                  )}
                </div>

                {isYearly && savings > 0 && (
                  <div className="mb-4 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                    Ahorras {formatPrice(savings)} al año
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isCurrentPlan || processing === planId}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isYearly
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {processing === planId ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Procesando...
                    </span>
                  ) : isCurrentPlan ? (
                    'Plan actual'
                  ) : (
                    'Seleccionar plan'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          ¿Necesitas algo personalizado?{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPlans;
