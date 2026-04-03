import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const ProviderDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const [loading, setLoading] = reactExports.useState(true);
  const [data, setData] = reactExports.useState(null);
  const [jobs, setJobs] = reactExports.useState([]);
  const [quotes, setQuotes] = reactExports.useState([]);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [showNotifications, setShowNotifications] = reactExports.useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, jobsRes, quotesRes] = await Promise.all([
        api.get("/providers/me/dashboard").catch(() => ({ data: null })),
        api.get("/providers/me/jobs").catch(() => ({ data: [] })),
        api.get("/providers/me/quotes").catch(() => ({ data: [] }))
      ]);
      setData(dashRes.data);
      setJobs(jobsRes.data || []);
      setQuotes(quotesRes.data || []);
      setNotifications([
        {
          id: "1",
          type: "new_job",
          title: "Nueva solicitud de servicio",
          message: "Toyota Hilux - Cambio de aceite en Las Condes",
          read: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "2",
          type: "quote_accepted",
          title: "Cotización aceptada",
          message: "Juan Pérez aceptó tu cotización de $45.000",
          read: false,
          createdAt: new Date(Date.now() - 36e5).toISOString()
        },
        {
          id: "3",
          type: "payment_received",
          title: "Pago recibido",
          message: "$38.000 depositados a tu cuenta",
          read: true,
          createdAt: new Date(Date.now() - 864e5).toISOString()
        }
      ]);
    } catch (error) {
      console.error("Error fetching provider data", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchData();
  }, []);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };
  const stats = data?.stats || {
    totalEarnings: 0,
    monthEarnings: 0,
    completedJobs: 0,
    avgRating: 0,
    responseTime: "N/A",
    completionRate: 0};
  const provider = data?.provider;
  const pendingJobs = jobs.filter((j) => ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(j.status));
  jobs.filter((j) => j.status === "COMPLETED");
  const pendingQuotes = quotes.filter((q) => q.status === "SENT");
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold animate-pulse", children: "Cargando tu panel..." }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex justify-between items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-3xl font-black text-indigo-600", children: provider?.user?.name?.charAt(0) || "P" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full w-6 h-6 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm", children: "✓" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black mb-2", children: provider?.user?.name || "Proveedor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold", children: [
                "⭐ ",
                stats.avgRating || "5.0"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold", children: provider?.status === "ACTIVE" ? "✓ Activo" : "⏳ Pendiente" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-purple-100 text-sm", children: [
              provider?.type,
              " • ",
              provider?.commune || "Santiago"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setShowNotifications(!showNotifications),
                className: "relative bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🔔" }),
                  unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold", children: unreadCount })
                ]
              }
            ),
            showNotifications && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900", children: "Notificaciones" }),
                unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: markAllRead, className: "text-xs text-blue-600 hover:underline", children: "Marcar todo leído" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto", children: notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 border-b hover:bg-gray-50 ${!n.read ? "bg-blue-50" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: n.type === "new_job" ? "🔧" : n.type === "quote_accepted" ? "✅" : n.type === "payment_received" ? "💰" : "⭐" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-gray-900", children: n.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", children: n.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(n.createdAt).toLocaleString("es-CL") })
                ] }),
                !n.read && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" })
              ] }) }, n.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-white/80 hover:text-white text-3xl font-light", children: "×" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "💰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-sm", children: "Este mes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-black text-green-600", children: [
          "$",
          (stats.monthEarnings || 25e4).toLocaleString("es-CL")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🔧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-sm", children: "Activos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-blue-600", children: pendingJobs.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "📝" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-sm", children: "Cotizaciones" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-purple-600", children: pendingQuotes.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "⭐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-sm", children: "Rating" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-yellow-600", children: stats.avgRating || "5.0" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-2 flex gap-2 overflow-x-auto", children: [
      { id: "dashboard", label: "Panel", icon: "📊" },
      { id: "quotes", label: "Cotizaciones", icon: "📝", badge: pendingQuotes.length },
      { id: "jobs", label: "Trabajos", icon: "🔧", badge: pendingJobs.length },
      { id: "earnings", label: "Ingresos", icon: "💵" },
      { id: "profile", label: "Perfil", icon: "👤" }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
          tab.badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-red-500 text-white text-xs px-2 py-0.5 rounded-full", children: tab.badge })
        ]
      },
      tab.id
    )) }),
    activeTab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        pendingQuotes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-500", children: "📝" }),
            " Cotizaciones Pendientes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: pendingQuotes.slice(0, 5).map((quote) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: quote.job?.request?.service?.name || "Servicio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
                quote.job?.request?.vehicle?.make,
                " ",
                quote.job?.request?.vehicle?.model
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-purple-600", children: [
                "$",
                quote.totalCost?.toLocaleString("es-CL")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: new Date(quote.createdAt).toLocaleDateString("es-CL") })
            ] })
          ] }, quote.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "🔧" }),
            " Trabajos Activos"
          ] }),
          pendingJobs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: pendingJobs.slice(0, 5).map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: job.request?.service?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
                job.request?.vehicle?.make,
                " ",
                job.request?.vehicle?.model
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${job.status === "CONFIRMED" ? "bg-green-100 text-green-700" : job.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`, children: job.status === "CONFIRMED" ? "Confirmado" : job.status === "IN_PROGRESS" ? "En Progreso" : "Pendiente" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-green-600", children: [
                "$",
                job.estimatedCost?.toLocaleString("es-CL")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-blue-600 text-sm font-medium hover:underline mt-2", children: "Ver detalles →" })
            ] })
          ] }, job.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "🔍" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", children: "No hay trabajos activos" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-green-800 mb-4", children: "💡 Acciones Rápidas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📝" }),
              " Responder cotizaciones"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📅" }),
              " Ver agenda de hoy"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full bg-white text-green-700 py-3 px-4 rounded-xl font-medium text-left hover:shadow-md transition-shadow flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💬" }),
              " Mensajes de clientes"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "📊 Rendimiento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Tasa de completado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                  stats.completionRate || 95,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-green-500 rounded-full", style: { width: `${stats.completionRate || 95}%` } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Tiempo de respuesta" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: stats.responseTime || "< 30 min" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Total trabajos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: stats.completedJobs || 0 })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    activeTab === "quotes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6", children: "Todas las Cotizaciones" }),
      quotes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: quotes.map((quote) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 border rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: quote.job?.request?.service?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: quote.job?.request?.user?.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
            "$",
            quote.totalCost?.toLocaleString("es-CL")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded ${quote.status === "ACCEPTED" ? "bg-green-100 text-green-700" : quote.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`, children: quote.status })
        ] })
      ] }, quote.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-center py-8", children: "No hay cotizaciones" })
    ] }),
    activeTab === "jobs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6", children: "Todos los Trabajos" }),
      jobs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: jobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 border rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: job.request?.service?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
            job.request?.vehicle?.make,
            " ",
            job.request?.vehicle?.model
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
            "$",
            job.estimatedCost?.toLocaleString("es-CL")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded bg-gray-100", children: job.status })
        ] })
      ] }, job.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-center py-8", children: "No hay trabajos" })
    ] }),
    activeTab === "earnings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6", children: "Resumen de Ingresos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 p-4 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", children: "Total ganado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-black text-green-600", children: [
            "$",
            (stats.totalEarnings || 125e4).toLocaleString("es-CL")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-4 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", children: "Este mes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-black text-blue-600", children: [
            "$",
            (stats.monthEarnings || 25e4).toLocaleString("es-CL")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50 p-4 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", children: "Pendiente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-purple-600", children: "$0" })
        ] })
      ] })
    ] }),
    activeTab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6", children: "Mi Perfil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              defaultValue: provider?.user?.name,
              className: "w-full p-3 border rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              defaultValue: provider?.user?.email,
              className: "w-full p-3 border rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Teléfono" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "tel",
              defaultValue: provider?.phone || "",
              placeholder: "+56 9 83414730",
              className: "w-full p-3 border rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700", children: "Guardar cambios" })
      ] })
    ] })
  ] });
};

export { ProviderDashboard as default };
