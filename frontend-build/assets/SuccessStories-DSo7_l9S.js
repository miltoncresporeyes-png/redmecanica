import { j as jsxRuntimeExports } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const SuccessStories = ({ onClose, onNavigateToOnboarding }) => {
  const [selectedStory, setSelectedStory] = reactExports.useState(null);
  const stories = [
    {
      name: "Juan Morales",
      business: "Mecánico Móvil JM",
      type: "Mecánico Independiente",
      location: "Providencia, Santiago",
      rating: 4.9,
      services: 320,
      monthlyIncrease: "+280%",
      quote: "RedMecánica transformó mi negocio. Pasé de buscar clientes en la calle a tener una agenda llena todos los días.",
      achievement: "De 10 a 80+ clientes mensuales en 3 meses",
      before: "Hace un año trabajaba como mecánico en un taller donde ganaba $600.000 mensuales. Tenía el sueño de independizarme pero no sabía cómo conseguir clientes.",
      after: "Hoy tengo mi propio negocio móvil con agenda completa. Gano más de $2.000.000 al mes y sigo creciendo. Mis clientes me recomiendan constantemente."
    },
    {
      name: "Carolina Vera",
      business: "Taller Express",
      type: "Taller Certificado",
      location: "La Florida, Santiago",
      rating: 4.8,
      services: 450,
      monthlyIncrease: "+180%",
      quote: "La verificación de RedMecánica nos dio la credibilidad que necesitábamos. Ahora los clientes confían en nosotros desde el primer contacto.",
      achievement: "De taller de barrio a referente en la zona sur",
      before: "Teníamos un taller pequeño con solo clientela del barrio. Los meses eran irregulares y a veces apenas cubríamos costos.",
      after: "Hoy somos el taller mejor calificado de La Florida en RedMecánica. Tuvimos que contratar 3 mecánicos más y ampliar las instalaciones."
    },
    {
      name: "Roberto Silva",
      business: "Grúas Silva Hnos.",
      type: "Servicio de Grúa",
      location: "Maipú, Santiago",
      rating: 5,
      services: 580,
      monthlyIncrease: "+340%",
      quote: "Las emergencias 24/7 de RedMecánica nos mantienen activos día y noche. Es un flujo constante de trabajo.",
      achievement: "De 2 grúas a una flota de 6 vehículos",
      before: "Éramos un servicio de grúa familiar con solo 2 vehículos. Dependíamos de ser llamados por conocidos o accidentes que veíamos en la calle.",
      after: "Compramos 4 grúas más y contratamos 8 operadores. Trabajamos 24/7 con turnos rotativos. RedMecánica es el 80% de nuestros ingresos."
    },
    {
      name: "Miguel Contreras",
      business: "Auto-Diagnóstico MC",
      type: "Diagnóstico Computarizado",
      location: "Las Condes, Santiago",
      rating: 4.9,
      services: 290,
      monthlyIncrease: "+220%",
      quote: "La plataforma me permitió especializarme y cobrar lo que realmente vale mi servicio. Los clientes entienden el valor del diagnóstico profesional.",
      achievement: "De empleado a dueño de su propio negocio especializado",
      before: "Trabajaba en un taller multimarca haciendo de todo un poco. Quería especializarme en diagnóstico computarizado pero no tenía clientes.",
      after: "Hoy soy el prestador de diagnóstico mejor calificado en la zona oriente. Trabajo solo con diagnóstico avanzado y gano el triple que antes."
    },
    {
      name: "Andrea Muñoz",
      business: "Taller Femenino AM",
      type: "Taller Especializado",
      location: "Ñuñoa, Santiago",
      rating: 4.9,
      services: 410,
      monthlyIncrease: "+260%",
      quote: "Como mujer mecánico, RedMecánica me dio la oportunidad de demostrar mi experiencia. Mis clientes valoran la profesionalidad y atención.",
      achievement: "Primer taller especializado en atención a mujeres conductoras",
      before: "Era difícil conseguir clientes que confiaran en una mecánica mujer. Muchos prejuicios en el rubro.",
      after: "Hoy tengo un nicho súper fiel de clientas mujeres que buscan un espacio cómodo y confiable. Mi agenda está llena por semanas."
    },
    {
      name: "Cristián Lagos",
      business: "Mantenimiento Empresarial CL",
      type: "Servicio Corporativo",
      location: "Vitacura, Santiago",
      rating: 4.8,
      services: 950,
      monthlyIncrease: "+420%",
      quote: "RedMecánica me conectó con empresas que necesitan mantención de flotas. Es un mercado que nunca había podido acceder solo.",
      achievement: "De autónomo a prestador corporativo de múltiples empresas",
      before: "Trabajaba con autos particulares uno por uno. Nunca pude acceder a contratos con empresas por falta de plataforma.",
      after: "Hoy mantengo flotas de 5 empresas importantes: 120+ vehículos corporativos bajo contrato mensual. Contraté equipo administrativo y técnico."
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Historias de Éxito" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-gray-500 hover:text-gray-700 text-2xl font-bold",
          "aria-label": "Cerrar",
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-3", children: "Historias Reales de Prestadores Exitosos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg opacity-90 mb-6", children: "Conoce cómo profesionales como tú han transformado sus negocios con RedMecánica" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: "0+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Prestadores Activos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: "0+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Servicios Completados" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white bg-opacity-20 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Garantizado" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: stories.map((story, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer",
        onClick: () => setSelectedStory(story),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 ${index % 6 === 0 ? "bg-blue-600" : index % 6 === 1 ? "bg-purple-600" : index % 6 === 2 ? "bg-green-600" : index % 6 === 3 ? "bg-yellow-600" : index % 6 === 4 ? "bg-pink-600" : "bg-indigo-600"}`, children: story.name.split(" ").map((n) => n[0]).join("") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900", children: story.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: story.business }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: story.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-yellow-500 mr-2", children: [
                "⭐ ",
                story.rating
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500", children: [
                "• ",
                story.services,
                " servicios"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 border border-green-200 rounded px-3 py-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-700", children: story.monthlyIncrease }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-green-600", children: "Aumento mensual" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600 italic mb-4", children: [
            '"',
            story.quote,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow",
              children: "Leer Historia Completa"
            }
          )
        ]
      },
      index
    )) }),
    selectedStory && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setSelectedStory(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto p-8", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4", children: selectedStory.name.split(" ").map((n) => n[0]).join("") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900", children: selectedStory.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: selectedStory.business }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
              selectedStory.type,
              " • ",
              selectedStory.location
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-500 mr-2", children: [
                "⭐ ",
                selectedStory.rating
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-500", children: [
                selectedStory.services,
                " servicios completados"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSelectedStory(null),
            className: "text-gray-500 hover:text-gray-700 text-3xl font-bold",
            children: "×"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900 mb-2", children: "Logro Principal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700", children: selectedStory.achievement }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 bg-white rounded px-4 py-2 inline-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-green-600", children: selectedStory.monthlyIncrease }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600 ml-2", children: "incremento en ingresos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900 mb-3", children: "Su Historia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-red-900 mb-2", children: "❌ Antes de RedMecánica:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700", children: selectedStory.before })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 border-l-4 border-green-400 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-green-900 mb-2", children: "✅ Después de RedMecánica:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700", children: selectedStory.after })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-gray-900 mb-3", children: "Testimonio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-700 italic text-lg", children: [
          '"',
          selectedStory.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 mt-2", children: [
          "— ",
          selectedStory.name,
          ", ",
          selectedStory.business
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onNavigateToOnboarding,
          className: "w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow",
          children: "Comienza Tu Historia de Éxito Hoy"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6 text-center", children: "¿Qué tienen en común todos estos Prestadores exitosos?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "🎯" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 mb-1", children: "Enfoque" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Se especializaron en lo que mejor hacen" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "⭐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 mb-1", children: "Calidad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Mantienen calificaciones altas constantemente" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "💬" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 mb-1", children: "Comunicación" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Responden rápido y son profesionales" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "📈" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-gray-900 mb-1", children: "Consistencia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Usan la plataforma activamente todos los días" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-3", children: "Tu historia de éxito comienza aquí" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg mb-6 opacity-90", children: "Únete a RedMecánica y forma parte de la próxima generación de Prestadores exitosos en Chile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onNavigateToOnboarding,
          className: "bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg",
          children: "Comenzar Mi Historia Ahora"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-4 opacity-75", children: "Plan básico gratuito • Sin permanencia • Soporte 24/7" })
    ] })
  ] });
};

export { SuccessStories as default };
