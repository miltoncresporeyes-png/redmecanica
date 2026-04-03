import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { C as CircleCheck } from './circle-check-erEt06PR.js';
import { T as TrendingUp } from './trending-up-k74f4ASP.js';
import { C as Calendar } from './calendar-zdPyMCKp.js';
import { C as CircleX } from './circle-x-B0Fgqlk1.js';
import './vendor-utils-CyilRAHM.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);

const SubscriptionsAdmin = () => {
  const [subscriptions, setSubscriptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filters, setFilters] = reactExports.useState({ status: "ALL", plan: "" });
  const [pagination, setPagination] = reactExports.useState({ page: 1, totalPages: 1, total: 0 });
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", "15");
      if (filters.status !== "ALL") params.append("status", filters.status);
      if (filters.plan) params.append("plan", filters.plan);
      const response = await api.get(`/admin/subscriptions?${params.toString()}`);
      setSubscriptions(response.data.subscriptions);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchSubscriptions();
  }, [pagination.page, filters.status, filters.plan]);
  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      EXPIRED: "bg-red-50 text-red-700 border-red-200",
      CANCELLED: "bg-gray-50 text-gray-700 border-gray-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200"
    };
    const labels = {
      ACTIVE: "Activa",
      EXPIRED: "Expirada",
      CANCELLED: "Cancelada",
      PENDING: "Pendiente"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status] || styles.PENDING}`, children: labels[status] || status });
  };
  const getPlanBadge = (plan) => {
    const styles = {
      PROFESSIONAL: "bg-purple-50 text-purple-700 border-purple-200",
      YEARLY: "bg-blue-50 text-blue-700 border-blue-200",
      MONTHLY: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[plan] || styles.MONTHLY}`, children: plan });
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatPrice = (amount, currency = "CLP") => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency }).format(amount);
  };
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "ACTIVE").length,
    revenue: subscriptions.filter((s) => s.status === "ACTIVE").reduce((acc, s) => acc + s.amount, 0),
    monthlyRecurring: subscriptions.filter((s) => s.status === "ACTIVE" && s.plan === "MONTHLY").reduce((acc, s) => acc + s.amount, 0)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Gestión de Suscripciones" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Controla y gestiona los planes de los Prestadores." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: fetchSubscriptions,
          className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -4 },
          className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Total Suscripciones" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-gray-900", children: pagination.total })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -4 },
          className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Activas" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-gray-900", children: stats.active })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -4 },
          className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Ingresos Mensuales" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-gray-900", children: formatPrice(stats.monthlyRecurring) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          whileHover: { y: -4 },
          className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-500", children: "Ingresos Totales" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-gray-900", children: formatPrice(stats.revenue) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filters.status,
          onChange: (e) => setFilters({ ...filters, status: e.target.value }),
          className: "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "Todos los estados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACTIVE", children: "Activas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EXPIRED", children: "Expiradas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CANCELLED", children: "Canceladas" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: filters.plan,
          onChange: (e) => setFilters({ ...filters, plan: e.target.value }),
          className: "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos los planes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MONTHLY", children: "Mensual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "YEARLY", children: "Anual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PROFESSIONAL", children: "Profesional" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Proveedor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Estado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Monto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Renovación" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Auto-Renew" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: subscriptions.map((sub, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.tr,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: index * 0.03 },
          className: "hover:bg-gray-50/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-gray-900", children: sub.provider.user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: sub.provider.user.email })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: getPlanBadge(sub.plan) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: getStatusBadge(sub.status) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 font-bold text-gray-900", children: formatPrice(sub.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14, className: "text-gray-400" }),
              formatDate(sub.endDate)
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: sub.autoRenew ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18, className: "text-gray-300" }) })
          ]
        },
        sub.id
      )) })
    ] }) }) })
  ] });
};

export { SubscriptionsAdmin as default };
