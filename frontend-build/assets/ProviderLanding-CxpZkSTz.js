import { j as jsxRuntimeExports, S as SEO } from './index-DQFChqCe.js';
import { e as useNavigate, r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const ProviderLanding = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    commune: "",
    experience: ""
  });
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1e3);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "✅" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-gray-900 mb-4", children: "¡Te contactaremos pronto!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-6", children: "Gracias por interés en RedMecánica. Un agente comercial te contactará en menos de 24 horas para guiarte en el proceso de registro." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 rounded-xl p-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-800 font-medium", children: "📞 ¿Prefieres que te llamemos ahora?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-600 mt-2", children: "+56 9 83414730" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/"),
          className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity",
          children: "Volver al Inicio"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SEO,
      {
        title: "Únete a RedMecánica | Registro de Prestadores",
        description: "¿Eres mecánico, taller o grúa? Únete a RedMecánica y aumenta tus ingresos. Miles de clientes buscando servicios automotrices en Chile.",
        keywords: "trabajar como mecánico, registrarme como taller, ganar dinero mecánico, prestador autos Chile",
        canonicalUrl: "https://redmecanica.cl/unete"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "container mx-auto px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center space-x-2 cursor-pointer",
            onClick: () => navigate("/"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-10 h-10 text-white", viewBox: "0 0 24 24", fill: "currentColor", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "12", r: "3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "6", r: "3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "18", r: "3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 12L18 6M6 12L18 18", stroke: "white", strokeWidth: "2" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white", children: [
                "Red",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-300", children: "Mecánica" })
              ] })
            ]
          }
        ),
        onClose && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-white/80 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "×" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-xs mb-8 shadow-xl shadow-yellow-400/30 animate-bounce-subtle", children: "🚀 LANZAMIENTO - Primeros 50 prestadores sin comisión" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl lg:text-7xl font-black mb-8 leading-[1.05] tracking-tighter drop-shadow-2xl", children: [
            "Convierte tu taller en una",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500", children: "máquina de clientes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl opacity-90 mb-12 max-w-lg leading-relaxed font-medium", children: "Únete a la plataforma de servicios automotrices #1 en Chile. Sin costo de registro, sin permanencia." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 mb-12", children: [
            { icon: "🎯", title: "Clientes garantizados", desc: "Te conectamos con conductores que necesitan servicios", color: "bg-gradient-to-br from-pink-500 to-rose-600" },
            { icon: "💳", title: "Pagos seguros", desc: "Sistema de escrow protege tu dinero", color: "bg-gradient-to-br from-blue-500 to-indigo-600" },
            { icon: "📱", title: "Gestión digital", desc: "Administra todo desde tu panel", color: "bg-gradient-to-br from-slate-700 to-slate-900" }
          ].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 group cursor-default", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`, children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-xl tracking-tight group-hover:text-yellow-300 transition-colors", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-80 text-base leading-snug", children: item.desc })
            ] })
          ] }, idx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-3", children: [
              "from-orange-400 to-pink-500",
              "from-blue-400 to-indigo-500",
              "from-purple-400 to-fuchsia-500"
            ].map((gradient, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 bg-gradient-to-br ${gradient} rounded-full border-2 border-white/50 flex items-center justify-center text-[10px] font-black shadow-lg`, children: i + 1 }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-white/90", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-yellow-400", children: "FASE 1" }),
              " • LANZAMIENTO 2026"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-900", children: "Regístrate ahora" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Completa tus datos y te contactaremos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Nombre completo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  name: "name",
                  required: true,
                  value: formData.name,
                  onChange: handleChange,
                  className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors",
                  placeholder: "Juan Pérez"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Teléfono" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "tel",
                    name: "phone",
                    required: true,
                    value: formData.phone,
                    onChange: handleChange,
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors",
                    placeholder: "+56 9 83414730"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "email",
                    name: "email",
                    required: true,
                    value: formData.email,
                    onChange: handleChange,
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors",
                    placeholder: "tu@email.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Tipo de servicio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    name: "serviceType",
                    required: true,
                    value: formData.serviceType,
                    onChange: handleChange,
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar..." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mechanic", children: "Mecánico" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "workshop", children: "Taller" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "towing", children: "Grúa" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "insurance", children: "Seguro" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Comuna" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    name: "commune",
                    required: true,
                    value: formData.commune,
                    onChange: handleChange,
                    className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar..." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "santiago", children: "Santiago" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "las_condes", children: "Las Condes" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "providencia", children: "Providencia" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "maipu", children: "Maipú" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "puente_alto", children: "Puente Alto" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "la_florida", children: "La Florida" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vitacura", children: "Vitacura" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nunoa", children: "Ñuñoa" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "otro", children: "Otra" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-700 mb-1", children: "Años de experiencia" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  name: "experience",
                  required: true,
                  value: formData.experience,
                  onChange: handleChange,
                  className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "0-1", children: "Menos de 1 año" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1-3", children: "1-3 años" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3-5", children: "3-5 años" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5-10", children: "5-10 años" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10+", children: "Más de 10 años" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-full bg-violet-600 text-white py-4 rounded-xl font-black text-xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" }),
                  "Enviando..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "🚀 Registrarme gratis" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-center text-slate-400 font-bold", children: "Al registrarte aceptas nuestros términos y condiciones" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t border-slate-100 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]", children: "O contáctanos directamente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://wa.me/56983414730",
                  className: "flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-black hover:bg-[#20bd5a] transition-all shadow-xl shadow-green-100 active:scale-95 group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl group-hover:animate-pulse", children: "💬" }),
                    " WhatsApp"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "tel:+56983414730",
                  className: "flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl group-hover:animate-bounce-subtle", children: "📞" }),
                    " Llamar"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      ` } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "container mx-auto px-4 py-12 text-center text-white/60 text-sm border-t border-white/10 mt-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-center items-center gap-6 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:contacto@redmecanica.cl", className: "hover:text-yellow-400 transition-colors flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📧" }),
            " contacto@redmecanica.cl"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/56983414730", target: "_blank", rel: "noopener noreferrer", className: "hover:text-yellow-400 transition-colors flex items-center gap-2 font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💬" }),
            " +56 9 83414730"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026 RedMecánica. La plataforma de servicios automotrices líder en Chile para prestadores y conductores." })
      ] })
    ] })
  ] });
};

export { ProviderLanding as default };
