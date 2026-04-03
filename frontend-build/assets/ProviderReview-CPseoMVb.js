import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { F as Funnel } from './funnel-DJEx6TPD.js';
import { S as Search } from './search-DEs_2hEI.js';
import { U as UserCheck } from './user-check-SQLMoNFq.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { A as AnimatePresence } from './index-BuLliQpS.js';
import { X } from './x-_bLTi_Zy.js';
import { C as CircleX } from './circle-x-B0Fgqlk1.js';
import { C as CircleCheck } from './circle-check-erEt06PR.js';
import './vendor-utils-CyilRAHM.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9", key: "c1nkhi" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9", key: "h65svq" }]
];
const CirclePause = createLucideIcon("circle-pause", __iconNode$2);

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
      d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      key: "kmsa83"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);

const ProviderReview = () => {
  const [providers, setProviders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedProvider, setSelectedProvider] = reactExports.useState(null);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [filters, setFilters] = reactExports.useState({
    status: "ALL",
    type: "",
    search: ""
  });
  const [pagination, setPagination] = reactExports.useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", "15");
      if (filters.status !== "ALL") params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      const response = await api.get(`/admin/providers?${params.toString()}`);
      setProviders(response.data.providers);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchProviders();
  }, [pagination.page, filters.status, filters.type]);
  const handleAction = async (id, action, reason) => {
    setIsProcessing(true);
    try {
      const endpoint = action === "reactivate" ? `/admin/providers/${id}/reactivate` : `/admin/providers/${id}/${action === "approve" ? "approve" : "suspend"}`;
      await api.post(endpoint, { reason });
      setSelectedProvider(null);
      fetchProviders();
    } catch (error) {
      alert("Error al procesar la solicitud");
    } finally {
      setIsProcessing(false);
    }
  };
  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
      SUSPENDED: "bg-red-50 text-red-700 border-red-200",
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-gray-50 text-gray-700 border-gray-200"
    };
    const labels = {
      ACTIVE: "Activo",
      PENDING: "Pendiente",
      UNDER_REVIEW: "En Revisión",
      SUSPENDED: "Suspendido",
      APPROVED: "Aprobado",
      REJECTED: "Rechazado"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status] || styles.PENDING}`, children: labels[status] || status });
  };
  const getTypeLabel = (type) => {
    const labels = {
      MECHANIC: "Mecánico",
      WORKSHOP: "Taller",
      TOWING: "Grúa",
      INSURANCE: "Seguro"
    };
    return labels[type] || type;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Gestión de Prestadores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Administra y verifica todos los prestadores de servicio." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchProviders,
            className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100", children: [
          pagination.total,
          " Prestadores"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16, className: "text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-600", children: "Filtros:" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filters.status,
          onChange: (e) => setFilters({ ...filters, status: e.target.value }),
          className: "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "Todos los estados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACTIVE", children: "Activos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PENDING", children: "Pendientes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "UNDER_REVIEW", children: "En Revisión" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SUSPENDED", children: "Suspendidos" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filters.type,
          onChange: (e) => setFilters({ ...filters, type: e.target.value }),
          className: "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos los tipos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MECHANIC", children: "Mecánico" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "WORKSHOP", children: "Taller" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "TOWING", children: "Grúa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INSURANCE", children: "Seguro" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por nombre, email, RUT o comuna...",
            value: filters.search,
            onChange: (e) => setFilters({ ...filters, search: e.target.value }),
            className: "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden", children: [
      providers.length === 0 && !loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-20 text-center flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900", children: "No se encontraron Prestadores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-2 font-medium", children: "Intenta ajustar los filtros de búsqueda." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Proveedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Ubicación" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Estado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Rendimiento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Suscripción" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Acciones" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: providers.map((p, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.tr,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: index * 0.03 },
            className: "hover:bg-gray-50/50 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg", children: p.user.name?.charAt(0) || "?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 leading-none", children: p.user.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 font-medium", children: p.user.email })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-md tracking-widest border border-gray-200", children: getTypeLabel(p.type) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 text-sm text-gray-600", children: [
                p.commune || "N/A",
                ", ",
                p.region || ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: getStatusBadge(p.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900", children: p.completedJobs || p._count?.jobs || 0 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-xs ml-1", children: "jobs" })
                ] }),
                p.rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500", children: "★" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-900", children: p.rating.toFixed(1) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: p.subscription ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${p.subscription.plan === "PROFESSIONAL" ? "text-purple-600" : p.subscription.plan === "YEARLY" ? "text-blue-600" : "text-gray-600"}`, children: p.subscription.plan === "PROFESSIONAL" ? "Pro" : p.subscription.plan === "YEARLY" ? "Anual" : "Mensual" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400 text-xs ml-1", children: [
                  "• ",
                  p.subscription.status
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "Sin plan" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setSelectedProvider(p),
                    className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all",
                    title: "Ver detalles",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 })
                  }
                ),
                p.status === "ACTIVE" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleAction(p.id, "suspend"),
                    className: "p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all",
                    title: "Suspender",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { size: 16 })
                  }
                ),
                p.status === "SUSPENDED" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleAction(p.id, "reactivate"),
                    className: "p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all",
                    title: "Reactivar",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 16 })
                  }
                )
              ] }) })
            ]
          },
          p.id
        )) })
      ] }) }),
      pagination.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
          "Página ",
          pagination.page,
          " de ",
          pagination.totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPagination((p) => ({ ...p, page: p.page - 1 })),
              disabled: pagination.page === 1,
              className: "px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50",
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setPagination((p) => ({ ...p, page: p.page + 1 })),
              disabled: pagination.page === pagination.totalPages,
              className: "px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50",
              children: "Siguiente"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedProvider && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        className: "bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg", children: selectedProvider.user.name?.charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black text-gray-900", children: selectedProvider.user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: selectedProvider.user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedProvider(null), className: "p-2 hover:bg-gray-100 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20, className: "text-gray-400" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "RUT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-gray-900 mt-1", children: selectedProvider.rut || "N/A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Teléfono" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-gray-900 mt-1", children: selectedProvider.user.phone || "N/A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Ubicación" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-gray-900 mt-1", children: selectedProvider.commune || "N/A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Jobs Completados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-gray-900 mt-1", children: selectedProvider.completedJobs || 0 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4 border-t border-gray-100", children: [
            selectedProvider.status === "PENDING" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  disabled: isProcessing,
                  onClick: () => handleAction(selectedProvider.id, "reject", "No cumple requisitos"),
                  className: "flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }),
                    "Rechazar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  disabled: isProcessing,
                  onClick: () => handleAction(selectedProvider.id, "approve"),
                  className: "flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
                    isProcessing ? "Procesando..." : "Aprobar"
                  ]
                }
              )
            ] }),
            selectedProvider.status === "ACTIVE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                disabled: isProcessing,
                onClick: () => handleAction(selectedProvider.id, "suspend", "Suspendido por administrador"),
                className: "flex-1 py-3 bg-amber-50 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { size: 16 }),
                  "Suspender Proveedor"
                ]
              }
            ),
            selectedProvider.status === "SUSPENDED" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                disabled: isProcessing,
                onClick: () => handleAction(selectedProvider.id, "reactivate"),
                className: "flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 16 }),
                  "Reactivar Proveedor"
                ]
              }
            )
          ] })
        ] })
      }
    ) }) })
  ] });
};

export { ProviderReview as default };
