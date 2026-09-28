import React, { useState } from 'react';
import api from '../../lib/http';
import { formatPrice } from '../../utils/format';

interface SubscriptionPaymentModalProps {
  providerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({ providerId, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'processing' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY' | 'PROFESSIONAL'>('MONTHLY');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = {
    MONTHLY: { name: 'Plan Mensual', price: 15000, description: 'Hasta 20 trabajos al mes' },
    YEARLY: { name: 'Plan Anual', price: 150000, description: 'Hasta 300 trabajos al año (Ahorra 17%)' },
    PROFESSIONAL: { name: 'Plan Profesional', price: 500000, description: 'Trabajos ilimitados + destacado' }
  };

  // Redirige al portal real de Webpay mediante POST con token_ws.
  // Nunca pedimos ni tocamos los datos de tu tarjeta en este sitio.
  const redirectToWebpay = (url: string, token: string) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token_ws';
    input.value = token;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  };

  const handleSelectPlan = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Crear la suscripción pendiente en el backend (real)
      const res = await api.post('/subscriptions', {
        providerId,
        plan: selectedPlan,
        paymentMethod: 'WEBPAY',
        autoRenew: true
      });

      const payment = res.data?.payment;
      if (res.data?.subscription && payment?.url && payment?.token) {
        setStep('processing');
        // 2. Ir al pago real en Webpay
        redirectToWebpay(payment.url, payment.token);
      } else {
        throw new Error('No se pudo inicializar el pago en Webpay.');
      }
    } catch (err: any) {
      console.error(err);
      const status = err.response?.status;
      setError(
        err.response?.data?.error ||
        (status === 503
          ? 'La pasarela de pago no está disponible en este momento. Inténtalo más tarde o escríbenos a contacto@redmecanica.cl.'
          : 'No se pudo iniciar el pago. Inténtalo de nuevo.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] p-6 md:p-8 text-white animate-scaleUp">
        
        {/* Neon Underglow and Corner Accents */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">⚙️</span>
            <span className="text-lg font-black tracking-widest text-green-400">REDMECÁNICA FACTURACIÓN</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 w-8 h-8 rounded-full flex items-center justify-center transition-all font-light"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 rounded-2xl text-red-300 text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: SELECT PLAN */}
        {step === 'plan' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Activar Visibilidad y Plan</h3>
              <p className="text-zinc-400 text-sm">Selecciona tu plan de trabajo de marketplace. Se reactivará de inmediato tu perfil en la plataforma.</p>
            </div>

            <div className="space-y-3">
              {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
                const plan = plans[key];
                const active = selectedPlan === key;
                return (
                  <label 
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`block relative p-5 rounded-2xl border cursor-pointer transition-all ${
                      active 
                        ? 'bg-zinc-900 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                        : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block font-black text-lg text-white">{plan.name}</span>
                        <span className="block text-zinc-400 text-xs mt-1">{plan.description}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xl font-black text-green-400">{formatPrice(plan.price)}</span>
                        <span className="text-zinc-500 text-xs">/período</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleSelectPlan}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black py-4 px-6 rounded-2xl font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></span>
                  Procesando...
                </>
              ) : (
                'Pagar con Webpay'
              )}
            </button>
            <p className="text-xs text-zinc-500 text-center">
              Serás redirigido al portal seguro de Transbank. Nunca te pediremos tu tarjeta aquí.
            </p>
          </div>
        )}

        {/* STEP 2: REDIRECTING TO REAL WEBPAY */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-4xl">🔒</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black">Redirigiendo a Webpay…</h3>
              <p className="text-zinc-500 text-sm">Completarás tu pago en el portal seguro de Transbank. No ingreses tu tarjeta en ningún otro sitio.</p>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT SUCCESS (confirmado por retorno de Webpay) */}
        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-scaleUp">
            <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center text-green-400 text-4xl shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-green-400">Pago recibido</h3>
              <p className="text-zinc-300 text-sm">
                Tu suscripción al {plans[selectedPlan].name} ({formatPrice(plans[selectedPlan].price)} CLP) quedó registrada.
                Revisa el estado en tu panel una vez que Webpay confirme la transacción.
              </p>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full bg-green-500 hover:bg-green-400 text-black py-4 px-6 rounded-2xl font-black transition-colors"
            >
              Regresar al Panel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SubscriptionPaymentModal;
