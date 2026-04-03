import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { C as Calendar } from './calendar-zdPyMCKp.js';
import { D as Download } from './download-sbWWPoCo.js';
import { U as Users } from './users-SgEdDFfH.js';
import { T as TrendingUp } from './trending-up-k74f4ASP.js';
import { C as Clock } from './clock-CeH-R9wG.js';
import { C as CircleCheck } from './circle-check-erEt06PR.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { F as Funnel } from './funnel-DJEx6TPD.js';
import { R as ResponsiveContainer, P as PieChart, b as Pie, C as Cell, T as Tooltip, B as BarChart, d as CartesianGrid, X as XAxis, Y as YAxis, e as Bar } from './vendor-utils-CyilRAHM.js';
import { M as MapPin, C as CircleAlert } from './map-pin-C_-eOcPS.js';
import { C as ChevronRight } from './chevron-right-B_LRH53P.js';
import './createLucideIcon-CBunf2tC.js';

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];
const AdminDashboard = () => {
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error loading stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-500 font-medium font-sans", children: "Sincronizando panorama total..." })
    ] });
  }
  const jobDistribution = stats?.jobsByStatus?.map((s) => ({
    name: s.status,
    value: s._count?._all || s._count || 0
  })) || [];
  const topCommunes = stats?.topCommunes?.map((c) => ({
    name: c.commune,
    count: c._count?._all || c._count || 0
  })) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Centro de Control" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Monitoreo en tiempo real de la red RedMecánica." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16 }),
          "Últimos 30 días"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
          "Exportar Reporte"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          title: "Técnicos Activos",
          value: stats?.summary?.totalProviders || 0,
          trend: "+12%",
          icon: Users,
          gradient: "from-blue-600 to-indigo-600",
          subtitle: "Prestadores verificados"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          title: "Tasa Aceptación",
          value: stats?.summary?.acceptanceRate || "0%",
          trend: "+5.4%",
          icon: TrendingUp,
          gradient: "from-emerald-500 to-teal-600",
          subtitle: "Solicitudes concretadas"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          title: "Jobs en Progreso",
          value: stats?.summary?.activeJobsCount || 0,
          trend: "-2",
          icon: Clock,
          gradient: "from-amber-400 to-orange-500",
          subtitle: "En ruta o diagnóstico"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KPICard,
        {
          title: "Satisfacción Promedio",
          value: stats?.summary?.avgRating ? stats.summary.avgRating.toFixed(1) : "0.0",
          trend: "+0.2",
          icon: CircleCheck,
          gradient: "from-purple-500 to-pink-600",
          subtitle: "Calificación de usuarios"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-white p-8 rounded-[32px] shadow-sm border border-gray-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Distribución de Flujo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Estado de todos los servicios históricos." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 hover:bg-gray-50 rounded-lg transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 20, className: "text-gray-400" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: jobDistribution,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 80,
                  outerRadius: 120,
                  paddingAngle: 5,
                  dataKey: "value",
                  children: jobDistribution.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: { borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", fontWeight: "bold" }
                }
              )
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 mt-6", children: jobDistribution.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: COLORS[i % COLORS.length] } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: [
                s.name,
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-900", children: s.value })
            ] }, s.name)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "bg-white p-8 rounded-[32px] shadow-sm border border-gray-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Cobertura Regional" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Top comunas por volumen de técnicos." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 24, className: "text-blue-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topCommunes, layout: "vertical", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#F1F5F9" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", hide: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  dataKey: "name",
                  type: "category",
                  axisLine: false,
                  tickLine: false,
                  width: 100,
                  tick: { fontSize: 11, fontWeight: 700, fill: "#64748B" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  cursor: { fill: "#F8FAFC" },
                  contentStyle: { borderRadius: "16px", border: "none", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "count",
                  radius: [0, 10, 10, 0],
                  barSize: 18,
                  children: topCommunes.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: "#3B82F6", opacity: 1 - index * 0.15 }, `cell-${index}`))
                }
              )
            ] }) }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#0F172A] p-8 md:p-10 rounded-[40px] overflow-hidden relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-blue-500/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -ml-48 -mb-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 36, className: "text-red-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-white text-2xl font-black tracking-tight", children: "Anomalías Detectadas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 mt-1 max-w-md font-medium", children: [
              "Se detectaron ",
              stats?.issues?.cancellations || 0,
              " cancelaciones sospechosas en las últimas 24 horas."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full lg:w-auto px-10 py-5 bg-white text-[#0F172A] rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-95 transition-all group shadow-2xl shadow-white/5", children: [
          "Iniciar Auditoría Manual",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 20, className: "group-hover:translate-x-1 transition-all" })
        ] })
      ] })
    ] })
  ] });
};
const KPICard = ({ title, value, trend, icon: Icon, gradient, subtitle }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    whileHover: { y: -6 },
    className: "bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-full group transition-all hover:shadow-xl hover:shadow-gray-200/50",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110", gradient), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 28 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
          "px-3 py-1.5 rounded-full text-[11px] font-black tracking-tighter shadow-sm",
          trend.startsWith("+") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        ), children: trend })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl font-black text-gray-900 mt-1 tracking-tighter", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-400 mt-2 font-bold italic opacity-80", children: subtitle })
      ] })
    ]
  }
);
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { AdminDashboard as default };
