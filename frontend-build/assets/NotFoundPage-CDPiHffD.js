import { j as jsxRuntimeExports, S as SEO } from './index-DQFChqCe.js';
import { e as useNavigate, L as Link } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const popularLinks = [
    { path: "/solicitar", label: "Solicitar Servicio", icon: "🔧" },
    { path: "/search", label: "Buscar Mecánicos", icon: "🔍" },
    { path: "/triage", label: "Diagnóstico", icon: "🚗" },
    { path: "/faq", label: "Preguntas Frecuentes", icon: "❓" }
  ];
  const handleGoBack = () => {
    navigate(-1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SEO,
      {
        title: "Página No Encontrada | 404",
        description: "Lo sentimos, la página que buscas no existe. Encuentra servicios mecánicos a domicilio en RedMecánica.",
        noIndex: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[70vh] flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-9xl font-black text-gray-200 select-none", children: "404" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl animate-bounce", children: "🔧" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "¡Vaya! Página no encontrada" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-gray-600 mb-8 max-w-md mx-auto", children: "Parece que esta página se ha ido a revisar un motor. Pero no te preocupes, ¡podemos ayudarte a encontrar lo que buscas!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) }),
              "Volver al inicio"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleGoBack,
            className: "inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }),
              "Página anterior"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-2xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "¿Qué estabas buscando?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: popularLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: link.path,
            className: "flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl group-hover:scale-110 transition-transform", children: link.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-700 group-hover:text-blue-600", children: link.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  className: "w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
                }
              )
            ]
          },
          link.path
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-sm text-gray-500", children: [
        "¿Crees que esto es un error? ",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-blue-600 hover:underline font-medium", children: "Contáctanos" })
      ] })
    ] }) })
  ] });
};

export { NotFoundPage as default };
