import React, { useState } from 'react';
import { Check, X, Wrench, Settings, Gauge, Warehouse, HelpCircle } from 'lucide-react';
import Card from '../components/common/Card';
import SEO from '../components/SEO';

interface PricingPlansProps {
  onClose?: () => void;
  onSelectPlan?: (planId: string) => void;
  onNavigateToOnboarding?: () => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ onClose, onSelectPlan, onNavigateToOnboarding }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  
  const [isProviderRegistered] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Básico',
      subtitle: 'Para comenzar',
      price: 0,
      priceAnnual: 0,
      color: 'slate',
      icon: <Wrench className="w-8 h-8" />,
      popular: false,
      features: [
        { text: 'Perfil básico en la plataforma', included: true },
        { text: 'Hasta 10 cotizaciones al mes', included: true },
        { text: 'Comisión del 15% por servicio', included: true },
        { text: 'Zona geográfica local', included: true },
        { text: 'Soporte por email', included: true },
        { text: 'Insignia de verificación', included: false },
        { text: 'Posicionamiento prioritario', included: false },
      ],
      limitations: 'Sin compromiso'
    },
    {
      id: 'pro',
      name: 'Profesional',
      subtitle: 'Recomendado',
      price: 14900,
      priceAnnual: 149000, 
      color: 'blue',
      icon: <Settings className="w-8 h-8" />,
      popular: true,
      features: [
        { text: 'Todo lo del plan Básico', included: true },
        { text: 'Cotizaciones ilimitadas', included: true },
        { text: 'Comisión reducida al 10%', included: true },
        { text: 'Insignia de "Verificado"', included: true },
        { text: 'Posicionamiento prioritario', included: true },
        { text: 'Cobertura regional', included: true },
        { text: 'Soporte vía WhatsApp', included: true },
      ],
      limitations: 'Recomendado'
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Para talleres',
      price: 29900,
      priceAnnual: 299000, 
      color: 'indigo',
      icon: <Gauge className="w-8 h-8" />,
      popular: false,
      features: [
        { text: 'Todo lo del plan Profesional', included: true },
        { text: 'Comisión ultra-reducida al 7%', included: true },
        { text: 'Insignia "Premium Élite"', included: true },
        { text: 'Destacado arriba de todos', included: true },
        { text: 'Cobertura nacional', included: true },
        { text: 'Multiusuario (5 cuentas)', included: true },
        { text: 'Gestor de cuenta 1:1', included: true },
      ],
      limitations: 'Máximo alcance'
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      subtitle: 'Cadenas y Flotas',
      price: null,
      priceAnnual: null,
      color: 'emerald',
      icon: <Warehouse className="w-8 h-8" />,
      popular: false,
      features: [
        { text: 'Todo lo del plan Premium', included: true },
        { text: 'Comisión desde el 5%', included: true },
        { text: 'Contrato personalizado', included: true },
        { text: 'Integración vía API/ERP', included: true },
        { text: 'Usuarios ilimitados', included: true },
        { text: 'Soporte 24/7 dedicado', included: true },
        { text: 'Facturación centralizada', included: true },
      ],
      limitations: 'A medida'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    
    if (planId === 'enterprise') {
      window.open('mailto:ventas@redmecanica.cl?subject=Consulta Plan Empresarial', '_blank');
      return;
    }

    if (!isProviderRegistered) {
      localStorage.setItem('selectedPlan', JSON.stringify({ planId, billingCycle }));
      if (onNavigateToOnboarding) {
        onNavigateToOnboarding();
      }
      return;
    }

    if (planId === 'free') {
      alert('¡Genial! Tu plan Básico está activo.');
      onSelectPlan?.(planId);
    } else {
      setSelectedPlanForPayment({ ...plan, billingCycle });
      setShowPaymentModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Planes y Precios para Prestadores | RedMecánica"
        description="Descubre nuestros planes para mecánicos, talleres y grúas. Comienza gratis y haz crecer tu negocio con RedMecánica."
        canonicalUrl="https://redmecanica.cl/pricing"
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Planes diseñados para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Crecimiento</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Sin costos ocultos. Los usuarios buscan gratis, tú solo pagas por la visibilidad y beneficios que elijas.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-400'}`}>Mensual</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors focus:outline-none"
            >
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-blue-600' : 'text-slate-400'}`}>Anual</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
                Ahorra 17%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.price;
            
            return (
              <div 
                key={plan.id}
                className={`relative group bg-white rounded-[2rem] p-1 transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105 z-10' : 'shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-20 whitespace-nowrap">
                    Recomendado
                  </div>
                )}
                
                <div className="bg-white rounded-[1.9rem] p-7 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${
                    plan.color === 'slate' ? 'bg-slate-100 text-slate-600' :
                    plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    plan.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {plan.icon}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm font-medium text-slate-400 mb-6">{plan.subtitle}</p>

                  <div className="mb-8">
                    {displayPrice === null ? (
                      <div className="flex flex-col">
                        <span className="text-3xl font-black text-slate-900">A medida</span>
                        <span className="text-xs text-slate-400">Cotización a medida</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">
                          {displayPrice === 0 ? 'Gratis' : `$${displayPrice.toLocaleString('es-CL')}`}
                        </span>
                        {displayPrice !== 0 && (
                          <span className="text-xs font-bold text-slate-400">/{billingCycle === 'monthly' ? 'mes' : 'año'}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${feature.included ? 'text-slate-600' : 'text-slate-300'}`}>
                          {feature.included ? (
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                          )}
                          <span className="font-medium">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {plan.id === 'enterprise' ? 'Contactar' : plan.id === 'free' ? 'Comenzar' : 'Empezar ahora'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <button className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group">
            <HelpCircle className="w-5 h-5" />
            <span>Ver comparativa completa de beneficios</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        <div className="mt-24 max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-8 px-6">
          {[
            { q: '¿Cuándo se cobra la comisión?', a: 'Solo al finalizar el trabajo exitosamente.' },
            { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin contratos forzosos ni multas.' },
            { q: '¿Hay descuentos para grupos?', a: 'Sí, el Plan Empresarial ofrece precios por volumen.' },
            { q: '¿Los clientes pagan algo?', a: 'No, para los usuarios la app es siempre gratuita.' },
          ].map((item, i) => (
            <div key={i}>
              <h4 className="font-black text-slate-900 mb-2">{item.q}</h4>
              <p className="text-sm text-slate-500 font-medium">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && selectedPlanForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                {selectedPlanForPayment.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900">Activar {selectedPlanForPayment.name}</h3>
              <p className="text-slate-500 font-medium mt-1">
                {selectedPlanForPayment.billingCycle === 'annual' ? 'Suscripción Anual' : 'Suscripción Mensual'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-center border border-slate-100">
              <p className="text-xs uppercase font-black text-slate-400 tracking-wider mb-1">Monto a procesar</p>
              <p className="text-4xl font-black text-slate-900">
                ${(selectedPlanForPayment.billingCycle === 'annual' ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.price).toLocaleString('es-CL')}
              </p>
            </div>

            <button
              onClick={() => {
                const price = selectedPlanForPayment.billingCycle === 'annual' ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.price;
                if (confirm(`Serás redirigido a Webpay para procesar $${price.toLocaleString('es-CL')}. ¿Continuar?`)) {
                  setTimeout(() => {
                    alert('¡Suscripción activada con éxito!');
                    setShowPaymentModal(false);
                    onSelectPlan?.(selectedPlanForPayment.id);
                  }, 1500);
                }
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 mb-3"
            >
              Ir a Pagar
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight">
              💳 Procesado de forma segura vía Webpay Plus
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
