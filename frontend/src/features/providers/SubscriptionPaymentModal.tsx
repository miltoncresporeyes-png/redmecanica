import React, { useState } from 'react';
import api from '../../lib/http';

interface SubscriptionPaymentModalProps {
  providerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({ providerId, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY' | 'PROFESSIONAL'>('MONTHLY');
  const [submitting, setSubmitting] = useState(false);
  const [subId, setSubId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const plans = {
    MONTHLY: { name: 'Plan Mensual', price: 15000, description: 'Hasta 20 trabajos al mes' },
    YEARLY: { name: 'Plan Anual', price: 150000, description: 'Hasta 300 trabajos al año (Ahorra 17%)' },
    PROFESSIONAL: { name: 'Plan Profesional', price: 500000, description: 'Trabajos ilimitados + destacado' }
  };

  const handleSelectPlan = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Crear la suscripción pendiente en el backend
      const res = await api.post('/subscriptions', {
        providerId,
        plan: selectedPlan,
        paymentMethod: 'WEBPAY',
        autoRenew: true
      });

      if (res.data && res.data.subscription) {
        setSubId(res.data.subscription.id);
        setStep('payment');
      } else {
        throw new Error('No se pudo inicializar la suscripción.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar suscripción');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subId) return;

    if (cardNumber.length < 16 || cardExpiry.length < 5 || cardCvv.length < 3 || !cardName) {
      setError('Por favor, rellene todos los campos de tarjeta válidos.');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      // 2. Simular llamada a confirmación de Webpay en el backend
      const res = await api.post('/payments/confirm', {
        subscriptionId: subId,
        paymentMethod: 'webpay',
        token: `mock_token_${Date.now()}`
      });

      if (res.data && res.data.subscription) {
        // 3. Reactivar al proveedor si estaba suspendido
        await api.put(`/providers/${providerId}`, {
          status: 'ACTIVE'
        });

        setStep('success');
      } else {
        throw new Error('Pago rechazado por el banco.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Transacción denegada por Webpay');
      setStep('payment');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
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
                'Confirmar y Continuar al Pago'
              )}
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT FORM (WEBPAY SIMULATOR) */}
        {step === 'payment' && (
          <form onSubmit={handlePay} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2">Pasarela Segura Webpay</h3>
              <p className="text-zinc-400 text-sm">Simula tu pago recurrente de mensualidad con tarjeta de débito/crédito chilena.</p>
            </div>

            {/* Credit Card Graphic */}
            <div className="relative h-44 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 overflow-hidden shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 font-black tracking-widest text-xs">REDMECÁNICA</span>
                <span className="text-green-400 font-bold text-sm tracking-wider">WebpayPlus</span>
              </div>
              
              <div className="space-y-1">
                <span className="block font-mono text-zinc-400 tracking-widest text-lg">
                  {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                </span>
                <div className="flex justify-between font-mono text-xs text-zinc-500">
                  <span>{cardName || 'TITULAR DE LA TARJETA'}</span>
                  <span>{cardExpiry || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1 tracking-wider uppercase">Número de Tarjeta</label>
                <input 
                  type="text" 
                  maxLength={16}
                  placeholder="4507 9821 3412 8790"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1 tracking-wider uppercase">Nombre del Titular</label>
                <input 
                  type="text" 
                  placeholder="Juan Pérez Silva"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 tracking-wider uppercase">Vencimiento (MM/AA)</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.length === 2 && !val.includes('/')) val += '/';
                      setCardExpiry(val);
                    }}
                    className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 tracking-wider uppercase">CVV / CVN</label>
                  <input 
                    type="password" 
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('plan')}
                className="flex-1 bg-zinc-900 border border-zinc-800 text-white py-4 rounded-2xl font-black hover:bg-zinc-800 transition-colors"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 text-black py-4 rounded-2xl font-black hover:from-green-400 hover:to-emerald-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:scale-[1.01]"
              >
                Pagar {formatPrice(plans[selectedPlan].price)} CLP
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROCESSING PAYMENT */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-4xl">💳</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black">Procesando Transacción Segura...</h3>
              <p className="text-zinc-500 text-sm">Estableciendo túnel de encriptación con Webpay (Transbank)...</p>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SUCCESS */}
        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-scaleUp">
            <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center text-green-400 text-4xl shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              ✓
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-green-400">Pago Aprobado</h3>
              <p className="text-zinc-300 text-sm">
                ¡Enhorabuena! Tu cuenta de mecánico ha sido reactivada. Se ha emitido la factura correspondiente y tu perfil ya está visible en las búsquedas geolocalizadas.
              </p>
            </div>

            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-xs font-mono space-y-1.5 text-zinc-400">
              <div className="flex justify-between"><span className="text-zinc-500">ORDEN:</span> <span>RM-SUB-{Date.now().toString().substring(5)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">MÉTODO:</span> <span>WEBPAY RECURRENTE</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">PLAN:</span> <span className="font-bold text-white">{plans[selectedPlan].name}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">TOTAL:</span> <span className="font-bold text-green-400">{formatPrice(plans[selectedPlan].price)} CLP</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">ESTADO:</span> <span className="text-green-500">APROBADO (AUT. 89212)</span></div>
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
