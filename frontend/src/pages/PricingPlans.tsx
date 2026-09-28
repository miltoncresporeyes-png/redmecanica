import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Check, X, Wrench, Star, Rocket, Warehouse, HelpCircle, CreditCard, Loader2, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../app/providers';
import { createSubscription } from '../services/api';
import LoginModal from '../features/auth/LoginModal';
import { POPULAR_COMUNAS } from '../data/marketplace';

interface PricingPlansProps {
  onClose?: void;
  onSelectPlan?: (planId: string) => void;
  onNavigateToOnboarding?: () => void;
}

// Precios alineados con el backend (SUBSCRIPTION_PLANS):
// MONTHLY $15.000 · YEARLY $150.000 · PROFESSIONAL $500.000
const plans = [
  {
    id: 'free',
    name: 'Vitrina Gratis',
    subtitle: 'Para aparecer en tu comuna',
    priceMonthly: 0,
    priceAnnual: 0,
    backendPlan: null as null,
    color: 'slate',
    icon: <Wrench className="w-8 h-8" />,
    popular: false,
    cta: 'Publicar mi vitrina',
    features: [
      { text: 'Vitrina pública con tus servicios', included: true },
      { text: 'Apareces en tu comuna base', included: true },
      { text: 'Contacto directo por WhatsApp', included: true },
      { text: 'Sin comisión por contacto', included: true },
      { text: 'Soporte por email', included: true },
      { text: 'Insignia "Verificado"', included: false },
      { text: 'Primeros lugares del directorio', included: false },
    ],
  },
  {
    id: 'destacado',
    name: 'Destacado',
    subtitle: 'Para llenar tu agenda',
    priceMonthly: 15000,
    priceAnnual: 150000,
    backendPlan: 'MONTHLY',
    backendPlanAnnual: 'YEARLY',
    color: 'blue',
    icon: <Star className="w-8 h-8" />,
    popular: true,
    cta: 'Destacar mi negocio',
    features: [
      { text: 'Todo lo de Vitrina Gratis', included: true },
      { text: 'Primeros lugares en tu comuna', included: true },
      { text: 'Insignia "Verificado"', included: true },
      { text: 'Hasta 3 comunas de cobertura', included: true },
      { text: 'Estadísticas de visitas y contactos', included: true },
      { text: 'Sin comisión por contacto', included: true },
      { text: 'Soporte vía WhatsApp', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Taller Premium',
    subtitle: 'Facturación anual',
    priceMonthly: 500000,
    priceAnnual: 500000,
    annualOnly: true,
    backendPlan: 'PROFESSIONAL',
    backendPlanAnnual: 'PROFESSIONAL',
    color: 'indigo',
    icon: <Rocket className="w-8 h-8" />,
    popular: false,
    cta: 'Ir a Premium',
    features: [
      { text: 'Todo lo del plan Destacado', included: true },
      { text: 'Cobertura regional y nacional', included: true },
      { text: 'Insignia "Premium"', included: true },
      { text: 'Multiusuario (5 cuentas)', included: true },
      { text: 'Dashboard con analytics', included: true },
      { text: 'Gestor de cuenta dedicado', included: true },
      { text: 'API para tu sistema', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    subtitle: 'Cadenas y flotas',
    priceMonthly: null,
    priceAnnual: null,
    backendPlan: null as null,
    color: 'emerald',
    icon: <Warehouse className="w-8 h-8" />,
    popular: false,
    cta: 'Contactar',
    features: [
      { text: 'Todo lo del plan Premium', included: true },
      { text: 'Contrato personalizado', included: true },
      { text: 'Múltiples sucursales y comunas', included: true },
      { text: 'Integración con tu ERP', included: true },
      { text: 'Usuarios ilimitados', included: true },
      { text: 'Facturación centralizada', included: true },
      { text: 'Soporte dedicado', included: true },
    ],
  },
];

const PricingPlans: React.FC<PricingPlansProps> = ({ onSelectPlan, onNavigateToOnboarding }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'MERCADOPAGO' | 'WEBPAY'>('WEBPAY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<'client' | 'provider'>('provider');
  // Distingue qué eres: prestador que se promociona o conductor que busca
  const [role, setRole] = useState<'provider' | 'driver'>('provider');

  const goOnboarding = () => {
    if (onNavigateToOnboarding) onNavigateToOnboarding();
    else navigate('/onboarding');
  };

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (planId === 'enterprise') {
      window.open('mailto:ventas@redmecanica.cl?subject=Consulta Plan Empresarial RedMecánica', '_blank');
      return;
    }

    if (planId === 'free') {
      // La vitrina gratuita se crea con el registro real, sin pagos ni trucos
      goOnboarding();
      onSelectPlan?.(planId);
      return;
    }

    if (!user?.id) {
      setLoginRole('provider');
      setShowLoginModal(true);
      return;
    }

    setSelectedPlanForPayment({ ...plan, billingCycle });
    setPaymentMethod('WEBPAY');
    setError(null);
    setShowPaymentModal(true);
  };

  // Redirección real a Webpay (POST con token_ws). Mercado Pago usa initPoint (GET).
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

  const handleProcessPayment = async () => {
    if (!selectedPlanForPayment || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const userData = user as any;
      const providerId = userData.serviceProvider?.id;
      if (!providerId) {
        setError('Aún no tienes vitrina creada. Publícala gratis primero y luego destaca tu negocio.');
        setLoading(false);
        return;
      }

      const backendPlan =
        selectedPlanForPayment.billingCycle === 'annual'
          ? selectedPlanForPayment.backendPlanAnnual
          : selectedPlanForPayment.backendPlan;

      if (!backendPlan) {
        setError('Plan no válido para pago en línea.');
        setLoading(false);
        return;
      }

      const result = await createSubscription({
        providerId,
        plan: backendPlan,
        paymentMethod,
        autoRenew: true,
      });

      if (result.paymentRequired && result.payment) {
        if (paymentMethod === 'MERCADOPAGO' && result.payment.initPoint) {
          window.location.href = result.payment.initPoint;
        } else if (paymentMethod === 'WEBPAY' && result.payment.url && result.payment.token) {
          redirectToWebpay(result.payment.url, result.payment.token);
        } else {
          setError('No se pudo generar el enlace de pago. Intenta nuevamente.');
          setLoading(false);
        }
      } else {
        setError('La suscripción quedó pendiente. Revisa tu panel para continuar con el pago.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const status = err.response?.status;
      setError(
        err.response?.data?.error ||
          (status === 503
            ? 'La pasarela no está disponible ahora. Inténtalo más tarde o escríbenos a contacto@redmecanica.cl.'
            : 'Error al procesar el pago. Intenta nuevamente.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Precios para prestadores | Publica gratis y destaca en tu comuna"
        description="Vitrina gratuita para talleres, mecánicos, grúas y vulcas. Sin comisión por contacto. Planes de destacado desde $15.000/mes. Conductores buscan gratis."
        canonicalUrl="https://redmecanica.cl/pricing"
      />

      <div className="max-w-7xl mx-auto">
        {/* Hero + selector de rol */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h1 className="mb-4">
            {role === 'provider' ? (
              <>Publica gratis. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Destaca</span> cuando quieras.</>
            ) : (
              <>Para ti, conductor: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">todo gratis.</span></>
            )}
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-lg">
            {role === 'provider' ? (
              <>Tu vitrina, tu comuna y tu WhatsApp directo — <strong>siempre gratis y sin comisión por contacto</strong>.
              Paga solo si quieres aparecer primero y llegar a más conductores.</>
            ) : (
              <>Buscar, comparar vitrinas verificadas y contactar por WhatsApp <strong>nunca te costará nada</strong>.
              Crea tu cuenta gratis para guardar tus vehículos y tu historial.</>
            )}
          </p>

          {/* ¿Qué eres? */}
          <div className="mt-8 bg-white border border-slate-200 p-1.5 rounded-2xl inline-flex w-full sm:w-auto shadow-sm" role="tablist" aria-label="Elige tu rol">
            <button
              role="tab"
              aria-selected={role === 'provider'}
              onClick={() => setRole('provider')}
              className={`flex-1 sm:flex-none sm:px-8 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                role === 'provider' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span aria-hidden>🔧</span> Soy prestador
            </button>
            <button
              role="tab"
              aria-selected={role === 'driver'}
              onClick={() => setRole('driver')}
              className={`flex-1 sm:flex-none sm:px-8 py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                role === 'driver' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span aria-hidden>🚗</span> Busco un servicio
            </button>
          </div>

          {role === 'provider' && (
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-400'}`}>Mensual</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors min-h-[28px]"
              role="switch"
              aria-checked={billingCycle === 'annual'}
              aria-label="Cambiar ciclo de facturación"
            >
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-blue-600' : 'text-slate-400'}`}>Anual</span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
              Ahorra 17%
            </span>
          </div>
          )}
        </div>

        {role === 'driver' ? (
        /* Vista conductor: cuenta gratuita */
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            <div className="card-market p-6 sm:p-8 border-2 border-emerald-200">
              <p className="badge-free mb-3"> sin cuenta · sin costo </p>
              <h2 className="section-title mb-2">Buscar y contactar</h2>
              <p className="section-sub mb-5">No necesitas registrarte para usar el directorio.</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Directorio por comuna y categoría',
                  'Vitrinas con insignia de verificación',
                  'Reputación y servicios publicados',
                  'WhatsApp y teléfono directos',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/search')} className="btn-primary w-full">
                🔍 Buscar ahora gratis
              </button>
            </div>

            <div className="card-market p-6 sm:p-8 ring-2 ring-emerald-500 relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                Recomendado
              </span>
              <p className="badge-free mb-3"> cuenta gratis </p>
              <h2 className="section-title mb-2">Mi cuenta de conductor</h2>
              <p className="section-sub mb-5">Guarda todo lo tuyo en un solo lugar. Gratis para siempre.</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Tus vehículos guardados',
                  'Historial de contactos y servicios',
                  'Tus cotizaciones en un panel',
                  'Alertas de prestadores en tu comuna',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              {user?.id ? (
                <button onClick={() => navigate('/profile')} className="btn-primary w-full">
                  Ir a mi cuenta
                </button>
              ) : (
                <button
                  onClick={() => { setLoginRole('client'); setShowLoginModal(true); }}
                  className="w-full py-3.5 rounded-xl font-black text-sm min-h-[44px] bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg transition-all"
                >
                  Crear cuenta gratis
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {POPULAR_COMUNAS.slice(0, 8).map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/search?commune=${encodeURIComponent(c)}`)}
                className="chip chip-idle"
              >
                📍 {c}
              </button>
            ))}
          </div>
        </div>
        ) : (
        <>
        {/* Planes prestadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {plans.map((plan) => {
            const displayPrice =
              billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-1 transition-all duration-300 flex flex-col justify-between ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-2xl z-10 md:scale-105' : 'shadow-lg border border-slate-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                    El que más eligen
                  </div>
                )}

                <div className="bg-white rounded-xl p-6 sm:p-7 flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 ${
                      plan.color === 'slate' ? 'bg-slate-100 text-slate-600' :
                      plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {plan.icon}
                    </div>

                    <h2 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{plan.name}</h2>
                    <p className="text-xs sm:text-sm font-medium text-slate-400 mb-5">{plan.subtitle}</p>

                    <div className="mb-6">
                      {displayPrice === null ? (
                        <div className="flex flex-col">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">A medida</span>
                          <span className="text-xs text-slate-400">Cotización personalizada</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            {displayPrice === 0 ? 'Gratis' : `$${displayPrice.toLocaleString('es-CL')}`}
                          </span>
                          {displayPrice !== 0 && (
                            <span className="text-xs font-bold text-slate-400">
                              /{(plan as any).annualOnly ? 'año' : billingCycle === 'monthly' ? 'mes' : 'año'}
                            </span>
                          )}
                        </div>
                      )}
                      {(plan as any).annualOnly && (
                        <p className="text-[11px] text-slate-400 mt-1">Facturación anual única</p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-start gap-2 text-xs sm:text-sm ${feature.included ? 'text-slate-600' : 'text-slate-300'}`}>
                          {feature.included ? (
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                          )}
                          <span className="font-medium leading-snug">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3.5 rounded-xl font-black text-sm transition-all min-h-[44px] flex items-center justify-center ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confianza */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-500">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-2">🚫 Sin comisión por contacto</span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-2">🔒 Pago seguro Webpay / Mercado Pago</span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-2">↩️ Cancela cuando quieras</span>
        </div>

        {/* FAQ prestadores */}
        <div className="mt-14 sm:mt-20">
          <h2 className="section-title text-center mb-2">Preguntas frecuentes</h2>
          <p className="section-sub text-center mb-8">Sin letra chica: así funciona el modelo</p>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-8 px-2 sm:px-6">
            {[
              { q: '¿Cobran comisión por cada trabajo?', a: 'No. El contacto es directo entre tú y el conductor. Solo pagas tu plan de visibilidad, nunca un % por servicio.' },
              { q: '¿Qué obtengo con la vitrina gratuita?', a: 'Tu perfil público, aparición en tu comuna base y contacto directo por WhatsApp. Gratis para siempre.' },
              { q: '¿Qué significa "Verificado"?', a: 'Validamos tu identidad y datos del negocio. La insignia aumenta la confianza y tus contactos.' },
              { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. Los planes mensuales se cancelan sin multas y tu vitrina gratuita sigue activa.' },
              { q: '¿Los conductores pagan algo?', a: 'Nunca. Buscar, comparar y contactar es 100% gratis y sin cuenta para ellos.' },
              { q: '¿Cómo destaco en más comunas?', a: 'Con Destacado cubres hasta 3 comunas; con Premium, tu región completa y todo Chile.' },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-black text-slate-900 mb-2 text-sm sm:text-base">{item.q}</h3>
                <p className="text-sm text-slate-500 font-medium">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link to="/benefits" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors min-h-[44px]">
            <HelpCircle className="w-5 h-5" />
            <span>Ver comparativa completa de beneficios</span>
          </Link>
        </div>
        </>
        )}
      </div>

      {/* Modal de Pago real */}
      {showPaymentModal && selectedPlanForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <button
              onClick={() => { setShowPaymentModal(false); setError(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                {selectedPlanForPayment.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900">Activar {selectedPlanForPayment.name}</h3>
              <p className="text-slate-500 font-medium mt-1 text-sm">
                {selectedPlanForPayment.billingCycle === 'annual' ? 'Suscripción Anual' : 'Suscripción Mensual'} · Sin comisión por contacto
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-center border border-slate-100">
              <p className="text-xs uppercase font-black text-slate-400 tracking-wider mb-1">Monto a procesar</p>
              <p className="text-4xl font-black text-slate-900">
                ${(selectedPlanForPayment.billingCycle === 'annual' ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.priceMonthly).toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedPlanForPayment.billingCycle === 'annual' ? 'Cobro anual único' : 'Cobro mensual recurrente'}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Método de pago</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('WEBPAY')}
                  className={`p-4 rounded-xl border-2 transition-all text-center min-h-[44px] ${
                    paymentMethod === 'WEBPAY'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1" aria-hidden>💳</div>
                  <p className="text-xs font-black text-slate-700">Webpay</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Portal seguro Transbank</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('MERCADOPAGO')}
                  className={`p-4 rounded-xl border-2 transition-all text-center min-h-[44px] ${
                    paymentMethod === 'MERCADOPAGO'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1" aria-hidden>💙</div>
                  <p className="text-xs font-black text-slate-700">Mercado Pago</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Tarjeta, transferencia</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm font-bold border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleProcessPayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando pago seguro…
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pagar ${((selectedPlanForPayment.billingCycle === 'annual' ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.priceMonthly)).toLocaleString('es-CL')}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              <Shield className="w-3 h-3" />
              <span>Serás redirigido al portal seguro · nunca pedimos tu tarjeta aquí</span>
            </div>
          </div>
        </div>
      )}

      <LoginModal
        key={loginRole}
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
        }}
        defaultMode="register"
        defaultRole={loginRole}
      />
    </div>
  );
};

export default PricingPlans;
