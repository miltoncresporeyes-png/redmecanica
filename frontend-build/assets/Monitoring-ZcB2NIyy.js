import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { D as Database } from './database-L9gvfuOP.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { C as Cpu } from './cpu-BETWaHh0.js';
import { R as ResponsiveContainer, A as AreaChart, d as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, f as Area } from './vendor-utils-CyilRAHM.js';
import { A as Activity } from './activity-B-e5Nr6m.js';
import { m as motion } from './proxy-CF9ZQatx.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "M10 16h.01", key: "1bzywj" }],
  [
    "path",
    {
      d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "18tbho"
    }
  ],
  ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
  ["path", { d: "M6 16h.01", key: "1pmjb7" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$2);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
];
const Server = createLucideIcon("server", __iconNode);

const Monitoring = () => {
  const [health, setHealth] = reactExports.useState(null);
  const [metrics, setMetrics] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [uptimeHistory, setUptimeHistory] = reactExports.useState([]);
  const fetchMonitoringData = async () => {
    try {
      const [hRes, mRes] = await Promise.all([
        api.get("/monitoring/health"),
        api.get("/monitoring/metrics")
      ]);
      setHealth(hRes.data);
      setMetrics(mRes.data);
      setUptimeHistory((prev) => {
        const newData = [...prev, {
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          memory: Math.round((mRes.data.memory?.rss || 0) / 1024 / 1024)
        }].slice(-10);
        return newData;
      });
    } catch (error) {
      console.error("Error loading monitoring data", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 1e4);
    return () => clearInterval(interval);
  }, []);
  if (loading && !metrics) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-500 font-bold tracking-tight", children: "Cargando telemetría del sistema..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Estado del Sistema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Telemetría y salud de la infraestructura en tiempo real." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" }),
          "En Línea"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchMonitoringData,
            className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HealthCard,
        {
          name: "Base de Datos",
          status: health?.services?.database,
          icon: Database,
          details: "SQLite (Local Dev)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HealthCard,
        {
          name: "Servidor API",
          status: health?.services?.api,
          icon: Server,
          details: `Runtime Node.js | ${metrics?.uptime ? Math.round(metrics.uptime / 60) : 0}m de uptime`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HealthCard,
        {
          name: "Motor de IA",
          status: "UP",
          icon: Cpu,
          details: "Gemini 2.0 Flash (External Proxy)"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-gray-900 tracking-tight", children: "Memoria del Proceso (RSS)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 font-medium", children: "Uso dinámico de recursos en el servidor backend." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { size: 28 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[350px] w-full flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: uptimeHistory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "colorMem", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#F1F5F9" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "time", axisLine: false, tickLine: false, tick: { fontSize: 10, fill: "#94A3B8", fontWeight: 600 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 10, fill: "#94A3B8", fontWeight: 600 }, unit: "MB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: { borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", fontWeight: "bold" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "memory", stroke: "#3B82F6", strokeWidth: 4, fillOpacity: 1, fill: "url(#colorMem)", animationDuration: 1e3 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MetricSummaryCard,
          {
            title: "Carga de Datos",
            value: metrics?.audit_logs_total || 0,
            label: "Registros en Auditoría",
            icon: History,
            color: "blue"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MetricSummaryCard,
          {
            title: "Conexiones",
            value: metrics?.users_total || 0,
            label: "Cuentas Registradas",
            icon: Activity,
            color: "emerald"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A] p-8 rounded-[32px] text-white overflow-hidden relative group mt-auto shadow-2xl shadow-indigo-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]", children: "Metadata de Sistema" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 font-mono text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Node Version:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "v20.11.0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "V8 Heap Limit:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "4.0 GB" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Env Status:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-black tracking-widest", children: "STABLE" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Region:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "South-America" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const HealthCard = ({ name, status, icon: Icon, details }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    whileHover: { y: -8, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)" },
    className: "bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 transition-all group",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
          status === "UP" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        ), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-2 h-2 rounded-full", status === "UP" ? "bg-emerald-500" : "bg-red-500") }),
          status || "OFFLINE"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-gray-900 tracking-tight text-lg", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-1.5 font-bold italic opacity-80", children: details })
    ]
  }
);
const MetricSummaryCard = ({ title, value, label, icon: Icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 group transition-all hover:bg-gray-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transform transition-transform group-hover:scale-110",
    color === "blue" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
  ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 28 }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-gray-900 tracking-tighter", children: value.toLocaleString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-400 opacity-60 uppercase", children: label })
    ] })
  ] })
] }) });
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { Monitoring as default };
