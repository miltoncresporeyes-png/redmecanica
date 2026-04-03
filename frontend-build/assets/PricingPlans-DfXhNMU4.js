import { j as jsxRuntimeExports, S as SEO } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { C as Check, G as Gauge } from './gauge-8sug0G49.js';
import { X } from './x-_bLTi_Zy.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { W as Wrench } from './wrench-CBC8eTT0.js';
import './vendor-utils-CyilRAHM.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$2);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11", key: "pb2vm6" }],
  [
    "path",
    {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
      key: "doq5xv"
    }
  ],
  ["path", { d: "M6 13h12", key: "yf64js" }],
  ["path", { d: "M6 17h12", key: "1jwigz" }]
];
const Warehouse = createLucideIcon("warehouse", __iconNode);

const PricingPlans = ({ onClose, onSelectPlan, onNavigateToOnboarding }) => {
  const [billingCycle, setBillingCycle] = reactExports.useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = reactExports.useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = reactExports.useState(null);
  const [isProviderRegistered] = reactExports.useState(false);
  const plans = [
    {
      id: "free",
      name: "Básico",
      subtitle: "Para comenzar",
      price: 0,
      priceAnnual: 0,
      color: "slate",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-8 h-8" }),
      popular: false,
      features: [
        { text: "Perfil básico en la plataforma", included: true },
        { text: "Hasta 10 cotizaciones al mes", included: true },
        { text: "Comisión del 15% por servicio", included: true },
        { text: "Zona geográfica local", included: true },
        { text: "Soporte por email", included: true },
        { text: "Insignia de verificación", included: false },
        { text: "Posicionamiento prioritario", included: false }
      ],
      limitations: "Sin compromiso"
    },
    {
      id: "pro",
      name: "Profesional",
      subtitle: "Recomendado",
      price: 14900,
      priceAnnual: 149e3,
      color: "blue",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-8 h-8" }),
      popular: true,
      features: [
        { text: "Todo lo del plan Básico", included: true },
        { text: "Cotizaciones ilimitadas", included: true },
        { text: "Comisión reducida al 10%", included: true },
        { text: 'Insignia de "Verificado"', included: true },
        { text: "Posicionamiento prioritario", included: true },
        { text: "Cobertura regional", included: true },
        { text: "Soporte vía WhatsApp", included: true }
      ],
      limitations: "Recomendado"
    },
    {
      id: "premium",
      name: "Premium",
      subtitle: "Para talleres",
      price: 29900,
      priceAnnual: 299e3,
      color: "indigo",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-8 h-8" }),
      popular: false,
      features: [
        { text: "Todo lo del plan Profesional", included: true },
        { text: "Comisión ultra-reducida al 7%", included: true },
        { text: 'Insignia "Premium Élite"', included: true },
        { text: "Destacado arriba de todos", included: true },
        { text: "Cobertura nacional", included: true },
        { text: "Multiusuario (5 cuentas)", included: true },
        { text: "Gestor de cuenta 1:1", included: true }
      ],
      limitations: "Máximo alcance"
    },
    {
      id: "enterprise",
      name: "Empresarial",
      subtitle: "Cadenas y Flotas",
      price: null,
      priceAnnual: null,
      color: "emerald",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "w-8 h-8" }),
      popular: false,
      features: [
        { text: "Todo lo del plan Premium", included: true },
        { text: "Comisión desde el 5%", included: true },
        { text: "Contrato personalizado", included: true },
        { text: "Integración vía API/ERP", included: true },
        { text: "Usuarios ilimitados", included: true },
        { text: "Soporte 24/7 dedicado", included: true },
        { text: "Facturación centralizada", included: true }
      ],
      limitations: "A medida"
    }
  ];
  const handleSelectPlan = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    if (planId === "enterprise") {
      window.open("mailto:ventas@redmecanica.cl?subject=Consulta Plan Empresarial", "_blank");
      return;
    }
    if (!isProviderRegistered) {
      localStorage.setItem("selectedPlan", JSON.stringify({ planId, billingCycle }));
      if (onNavigateToOnboarding) {
        onNavigateToOnboarding();
      }
      return;
    }
    if (planId === "free") {
      alert("¡Genial! Tu plan Básico está activo.");
      onSelectPlan?.(planId);
    } else {
      setSelectedPlanForPayment({ ...plan, billingCycle });
      setShowPaymentModal(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SEO,
      {
        title: "Planes y Precios para Prestadores | RedMecánica",
        description: "Descubre nuestros planes para mecánicos, talleres y grúas. Comienza gratis y haz crecer tu negocio con RedMecánica.",
        canonicalUrl: "https://redmecanica.cl/pricing"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight", children: [
          "Planes diseñados para tu ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600", children: "Crecimiento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-slate-600 leading-relaxed", children: "Sin costos ocultos. Los usuarios buscan gratis, tú solo pagas por la visibilidad y beneficios que elijas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${billingCycle === "monthly" ? "text-blue-600" : "text-slate-400"}`, children: "Mensual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly"),
              className: "relative w-14 h-7 bg-slate-200 rounded-full transition-colors focus:outline-none",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform ${billingCycle === "annual" ? "translate-x-7" : "translate-x-0"}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${billingCycle === "annual" ? "text-blue-600" : "text-slate-400"}`, children: "Anual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ring-1 ring-emerald-200", children: "Ahorra 17%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: plans.map((plan) => {
        const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.price;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `relative group bg-white rounded-[2rem] p-1 transition-all duration-300 hover:-translate-y-2 ${plan.popular ? "ring-2 ring-blue-500 shadow-2xl scale-105 z-10" : "shadow-xl"}`,
            children: [
              plan.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-20 whitespace-nowrap", children: "Recomendado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[1.9rem] p-7 flex flex-col h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${plan.color === "slate" ? "bg-slate-100 text-slate-600" : plan.color === "blue" ? "bg-blue-100 text-blue-600" : plan.color === "indigo" ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`, children: plan.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-slate-900 mb-1", children: plan.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-400 mb-6", children: plan.subtitle }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: displayPrice === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-slate-900", children: "A medida" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "Cotización a medida" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-slate-900", children: displayPrice === 0 ? "Gratis" : `$${displayPrice.toLocaleString("es-CL")}` }),
                  displayPrice !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-400", children: [
                    "/",
                    billingCycle === "monthly" ? "mes" : "año"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-8", children: plan.features.map((feature, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex items-start gap-2 text-sm ${feature.included ? "text-slate-600" : "text-slate-300"}`, children: [
                  feature.included ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-emerald-500 mt-0.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-slate-300 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: feature.text })
                ] }, i)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleSelectPlan(plan.id),
                    className: `w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                    children: plan.id === "enterprise" ? "Contactar" : plan.id === "free" ? "Comenzar" : "Empezar ahora"
                  }
                )
              ] })
            ]
          },
          plan.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-24 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ver comparativa completa de beneficios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-24 max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-8 px-6", children: [
        { q: "¿Cuándo se cobra la comisión?", a: "Solo al finalizar el trabajo exitosamente." },
        { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin contratos forzosos ni multas." },
        { q: "¿Hay descuentos para grupos?", a: "Sí, el Plan Empresarial ofrece precios por volumen." },
        { q: "¿Los clientes pagan algo?", a: "No, para los usuarios la app es siempre gratuita." }
      ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-slate-900 mb-2", children: item.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 font-medium", children: item.a })
      ] }, i)) })
    ] }),
    showPaymentModal && selectedPlanForPayment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowPaymentModal(false),
          className: "absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4", children: selectedPlanForPayment.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-black text-slate-900", children: [
          "Activar ",
          selectedPlanForPayment.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 font-medium mt-1", children: selectedPlanForPayment.billingCycle === "annual" ? "Suscripción Anual" : "Suscripción Mensual" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 rounded-2xl p-6 mb-8 text-center border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase font-black text-slate-400 tracking-wider mb-1", children: "Monto a procesar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-black text-slate-900", children: [
          "$",
          (selectedPlanForPayment.billingCycle === "annual" ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.price).toLocaleString("es-CL")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            const price = selectedPlanForPayment.billingCycle === "annual" ? selectedPlanForPayment.priceAnnual : selectedPlanForPayment.price;
            if (confirm(`Serás redirigido a Webpay para procesar $${price.toLocaleString("es-CL")}. ¿Continuar?`)) {
              setTimeout(() => {
                alert("¡Suscripción activada con éxito!");
                setShowPaymentModal(false);
                onSelectPlan?.(selectedPlanForPayment.id);
              }, 1500);
            }
          },
          className: "w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 mb-3",
          children: "Ir a Pagar"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight", children: "💳 Procesado de forma segura vía Webpay Plus" })
    ] }) })
  ] });
};

export { PricingPlans as default };
