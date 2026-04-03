import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { S as Search } from './search-DEs_2hEI.js';
import { F as Funnel } from './funnel-DJEx6TPD.js';
import { C as Calendar } from './calendar-zdPyMCKp.js';
import { A as AnimatePresence } from './index-BuLliQpS.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { S as ShieldAlert } from './shield-alert-CEr0fE5L.js';
import { D as Database } from './database-L9gvfuOP.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { C as ChevronRight } from './chevron-right-B_LRH53P.js';
import './vendor-utils-CyilRAHM.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$3);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$2);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("monitor", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);

const AuditLogs = () => {
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/audit");
      setLogs(response.data);
    } catch (error) {
      console.error("Error loading audit logs", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchLogs();
  }, []);
  const filteredLogs = logs.filter(
    (log) => log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.resource.toLowerCase().includes(searchTerm.toLowerCase()) || log.userId && log.userId.includes(searchTerm)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Rastro de Auditoría" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Historial inmutable de acciones realizadas en la plataforma." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: fetchLogs,
          className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por acción, recurso o ID de usuario...",
            className: "bg-transparent border-none focus:outline-none text-sm w-full",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16 }),
          "Acción"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }),
          "Fecha"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest", children: "Suceso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest", children: "Recurso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest", children: "Identidad" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest", children: "Contexto Digital" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-widest", children: "Marca Temporal" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredLogs.map((log, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.tr,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index * 0.05 },
            className: "group hover:bg-blue-50/30 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  log.action.includes("REGISTER") || log.action.includes("CREATE") ? "bg-emerald-100 text-emerald-600" : log.action.includes("LOGIN") ? "bg-blue-100 text-blue-600" : log.action.includes("VIEW") ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 18 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-900 leading-none", children: log.action }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-gray-400 mt-1 font-medium tracking-tight", children: [
                    "ID: ",
                    log.id.split("-")[0],
                    "..."
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 14, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700", children: log.resource }),
                log.resourceId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono", children: [
                  "#",
                  log.resourceId.split("-")[0]
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14, className: "text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-600", children: log.userId || "SISTEMA" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] font-medium text-gray-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12 }),
                  log.ipAddress || "Unknown IP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-medium text-gray-400 max-w-[200px] truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 12 }),
                  log.userAgent || "Unknown Agent"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm text-gray-600 font-medium whitespace-nowrap", children: new Date(log.createdAt).toLocaleString("es-CL", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              }) }) })
            ]
          },
          log.id
        )) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-widest", children: [
          "Mostrando ",
          filteredLogs.length,
          " de ",
          logs.length,
          " registros"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 }) })
        ] })
      ] })
    ] })
  ] });
};
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { AuditLogs as default };
