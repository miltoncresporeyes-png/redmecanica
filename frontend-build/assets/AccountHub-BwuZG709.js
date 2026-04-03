import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const AccountHub = ({ currentUser, onClose }) => {
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [loading, setLoading] = reactExports.useState(true);
  const [userData, setUserData] = reactExports.useState(null);
  const [quotes, setQuotes] = reactExports.useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, quotesRes] = await Promise.all([
        api.get(`/users/${currentUser.id}`),
        api.get("/quotes/user/me")
      ]);
      setUserData(userRes.data);
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error("Error fetching account data", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser]);
  const handleAcceptQuote = async (quoteId) => {
    if (!confirm("¿Estás seguro de aceptar esta cotización? Esto confirmará el inicio del servicio.")) return;
    try {
      await api.post(`/quotes/${quoteId}/accept`);
      alert("Cotización aceptada exitosamente. El taller ha sido notificado.");
      fetchData();
    } catch (error) {
      console.error("Error accepting quote", error);
      alert("Error al aceptar la cotización");
    }
  };
  if (loading || !userData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) });
  }
  const serviceHistory = userData.serviceRequests || [];
  const totalSpent = serviceHistory.filter((s) => s.job?.status === "COMPLETED").reduce((acc, item) => acc + (item.job?.estimatedCost || 0), 0);
  const avgRating = 5;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-black text-blue-600 border-4 border-white/20", children: userData.name?.substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black mb-2", children: userData.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-100 mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📧" }),
              " ",
              userData.email
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-100 uppercase tracking-wider", children: "Cliente desde" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: new Date(userData.createdAt).getFullYear() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-100 uppercase tracking-wider", children: "Servicios" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: serviceHistory.length })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-white/80 hover:text-white text-3xl font-light", children: "×" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "💰", label: "Total Invertido", value: `$${totalSpent.toLocaleString()}`, color: "blue", trend: "+0%" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "⭐", label: "Calificación Prom.", value: avgRating.toFixed(1), color: "yellow", trend: "Excelente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "🚗", label: "Vehículos", value: userData.vehicles.length.toString(), color: "green" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: "🛡️", label: "Garantías Activas", value: "1", color: "purple" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 p-2 flex gap-2", children: [
      { id: "overview", label: "Resumen", icon: "📊" },
      { id: "quotes", label: "Cotizaciones", icon: "📄" },
      { id: "history", label: "Historial", icon: "📝" },
      { id: "vehicles", label: "Mis Vehículos", icon: "🚗" },
      { id: "settings", label: "Configuración", icon: "⚙️" }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:bg-slate-50"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: tab.label })
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "🕒" }),
            " Solicitudes Recientes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: serviceHistory.slice(0, 5).map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600", children: "🔧" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold", children: req.service.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                  req.vehicle.make,
                  " ",
                  req.vehicle.model,
                  " • ",
                  new Date(req.createdAt).toLocaleDateString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase ${req.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`, children: req.status })
          ] }, req.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black mb-2", children: "¿Necesitas ayuda?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-indigo-100 text-sm mb-4", children: "Nuestro equipo técnico está listo para asistirte las 24/7." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all", children: "Contactar Soporte" })
        ] }) })
      ] }),
      activeTab === "quotes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-slate-100 bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black", children: "Cotizaciones Recibidas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Revisa y acepta las ofertas de los talleres" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4", children: quotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-slate-400 font-medium", children: "No has recibido cotizaciones aún." }) : quotes.map((quote) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-300 transition-all bg-white shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl", children: "🏪" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-xl text-slate-800", children: quote.provider.user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 font-bold uppercase tracking-tight", children: [
                  quote.job.request.service.name,
                  " para ",
                  quote.job.request.vehicle.make
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-black text-blue-600", children: [
                "$",
                quote.totalCost.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded", children: [
                "Válido hasta: ",
                new Date(quote.validUntil).toLocaleDateString()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-xs font-black text-slate-400 uppercase mb-2", children: "Diagnóstico del Taller" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700 italic", children: [
              '"',
              quote.preliminaryDiagnosis,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-slate-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs font-bold text-slate-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "⏱️ Duración: ",
                quote.estimatedDuration,
                " min"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "🛡️ Garantía: ",
                quote.warranty
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: quote.status === "SENT" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-6 py-2 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all", children: "Rechazar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleAcceptQuote(quote.id),
                  className: "px-6 py-2 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200",
                  children: "Aceptar Cotización"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-4 py-2 rounded-xl font-black uppercase text-xs ${quote.status === "ACCEPTED" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`, children: quote.status === "ACCEPTED" ? "Aceptada" : "Rechazada" }) })
          ] })
        ] }, quote.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "🕒" }),
            " Actividad Reciente"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: serviceHistory.slice(0, 3).map((service, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0", children: "🔧" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-slate-800", children: service.service }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                    service.provider,
                    " • ",
                    service.vehicle
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold text-blue-600", children: [
                    "$",
                    service.cost.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: new Date(service.date).toLocaleDateString() })
                ] })
              ] }),
              service.rating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${i < service.rating ? "text-yellow-400" : "text-slate-200"}`, children: "★" }, i)),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 ml-2", children: "Tu calificación" })
              ] })
            ] })
          ] }, service.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "✅" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-2", children: "Estado de Cuenta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-100 text-sm mb-4", children: "Todo al día. Sin pagos pendientes." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full bg-white text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors", children: "Ver Facturas" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎁" }),
              " Programa de Lealtad"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Puntos acumulados" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-600", children: "1,250 pts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-500", style: { width: "62%" } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "250 puntos más para tu próximo descuento" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-slate-100 bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "📜" }),
            " Historial Completo de Servicios"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Mantén el control de todo el mantenimiento de tus vehículos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Fecha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Servicio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Proveedor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Vehículo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Costo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase", children: "Estado" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-50", children: serviceHistory.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-blue-50 transition-colors cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-slate-600", children: new Date(service.date).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-800", children: service.service }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-slate-600", children: service.provider }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-slate-600", children: service.vehicle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-blue-600", children: [
              "$",
              service.cost.toLocaleString()
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: service.rating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${i < service.rating ? "text-yellow-400" : "text-slate-200"}`, children: "★" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-blue-600 font-bold hover:underline", children: "Calificar" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${service.status === "completed" ? "bg-green-100 text-green-700" : service.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`, children: service.status === "completed" ? "Completado" : service.status === "in-progress" ? "En Progreso" : "Cancelado" }) })
          ] }, service.id)) })
        ] }) })
      ] }),
      activeTab === "vehicles" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VehicleCard,
          {
            make: "Toyota",
            model: "Hilux",
            year: 2022,
            plate: "RR-TT-44",
            mileage: "45,000 km",
            nextService: "Cambio de Aceite en 5,000 km"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-12 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-3", children: "➕" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-700", children: "Agregar Vehículo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Registra otro vehículo" })
        ] }) })
      ] }),
      activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-8 shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black mb-6", children: "Configuración de Cuenta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-2", children: "Nombre" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", defaultValue: "Roberto Gómez", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-2", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", defaultValue: "cliente.pyme@example.com", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-2", children: "Teléfono" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", defaultValue: "+56 9 83414730", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-2", children: "Ciudad" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", defaultValue: "Santiago", className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200", children: "Guardar Cambios" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      ` } })
  ] });
};
const StatCard = ({ icon, label, value, color, trend }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    yellow: "from-yellow-400 to-orange-500",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-600"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-3xl mb-4 shadow-lg`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-slate-800 mb-1", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: label }),
    trend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-green-600 font-bold mt-2", children: [
      "↗ ",
      trend
    ] })
  ] });
};
const VehicleCard = ({ make, model, year, plate, mileage, nextService }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 text-9xl opacity-5", children: "🚗" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-black mb-1", children: [
          make,
          " ",
          model
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400", children: [
          year,
          " • ",
          plate
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "Principal" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: "Kilometraje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: mileage })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: "Próximo Servicio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs", children: nextService })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full bg-white text-slate-800 py-3 rounded-xl font-bold mt-4 hover:bg-slate-100 transition-colors", children: "Ver Detalles" })
  ] })
] });

export { AccountHub as default };
