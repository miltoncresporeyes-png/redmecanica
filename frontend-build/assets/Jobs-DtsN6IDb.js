import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { S as Search } from './search-DEs_2hEI.js';
import { F as Funnel } from './funnel-DJEx6TPD.js';
import { A as AnimatePresence } from './index-BuLliQpS.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { W as Wrench } from './wrench-CBC8eTT0.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { C as ChevronRight } from './chevron-right-B_LRH53P.js';
import { X } from './x-_bLTi_Zy.js';
import { M as MapPin, C as CircleAlert } from './map-pin-C_-eOcPS.js';
import { C as Clock } from './clock-CeH-R9wG.js';
import { A as Activity } from './activity-B-e5Nr6m.js';
import { C as CircleX } from './circle-x-B0Fgqlk1.js';
import { C as CircleCheck } from './circle-check-erEt06PR.js';
import './vendor-utils-CyilRAHM.js';

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
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
];
const Car = createLucideIcon("car", __iconNode$1);

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
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);

const Jobs = () => {
  const [jobs, setJobs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [selectedJob, setSelectedJob] = reactExports.useState(null);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/jobs");
      setJobs(response.data?.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobTimeline = async (jobId) => {
    try {
      const response = await api.get(`/admin/jobs/${jobId}/timeline`);
      setSelectedJob(response.data);
    } catch (error) {
      console.error("Error fetching timeline", error);
    }
  };
  const filteredJobs = jobs.filter(
    (job) => job.id.toLowerCase().includes(searchTerm.toLowerCase()) || job.status.toLowerCase().includes(searchTerm.toLowerCase()) || job.request?.vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Gestión Operativa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Monitoreo de servicios activos, diagnósticos y finalizaciones." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchJobs,
            className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100", children: [
          jobs.length,
          " Servicios"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar por ID, Patente o Estado...",
            className: "bg-transparent border-none focus:outline-none text-sm w-full",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 w-full md:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16 }),
        "Filtrar"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Servicio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Vehículo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Estado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Asignación" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Flujo" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredJobs.map((job, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.tr,
        {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: index * 0.03 },
          className: "group hover:bg-gray-50/50 transition-all cursor-pointer",
          onClick: () => fetchJobTimeline(job.id),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-gray-900 leading-none", children: job.request?.service?.name || "Servicio General" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1", children: [
                  "ID: #",
                  job.id.substring(0, 8)
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-gray-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { size: 14, className: "text-gray-400" }),
                job.request?.vehicle?.plate || "S/P"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-400 font-medium ml-5", children: [
                job.request?.vehicle?.brand,
                " ",
                job.request?.vehicle?.model
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: job.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500", children: job.provider?.user?.name?.charAt(0) || "T" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-600", children: job.provider?.user?.name || "Técnico Asignado" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 }) }) })
          ]
        },
        job.id
      )) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedJob && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[#0F172A]/90 backdrop-blur-lg flex items-center justify-end p-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { x: 500, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 500, opacity: 0 },
        className: "bg-white w-full max-w-xl h-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 pb-6 flex items-center justify-between border-b border-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]", children: "Auditoría Técnica" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-gray-900 mt-1", children: "Historial del Job" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedJob(null), className: "p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24, className: "text-gray-400" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase", children: "Cliente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800", children: selectedJob.request?.user?.name || "Usuario" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase", children: "Estado Actual" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: selectedJob.status }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-center gap-3 pt-3 border-t border-blue-100/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-gray-500 uppercase tracking-tight", children: [
                  "Comuna: ",
                  selectedJob.request?.commune || "S/E"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 to-gray-100" }),
              selectedJob.events?.length > 0 ? selectedJob.events.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-12", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                  "absolute left-2.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-10 scale-125",
                  i === 0 ? "bg-blue-600 animate-pulse" : "bg-gray-300"
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-blue-600 uppercase tracking-widest", children: event.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400", children: new Date(event.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700 leading-snug", children: event.description }),
                  event.metadata && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-xl font-mono text-[9px] text-gray-400 overflow-x-auto", children: event.metadata })
                ] })
              ] }, event.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-12 text-gray-400 italic text-sm py-4", children: "Iniciando traza técnica..." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 bg-gray-900 text-white rounded-t-[40px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-widest", children: "Resumen Financiero" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20", children: "Validado" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-black text-white tracking-widest", children: [
                  "$ ",
                  selectedJob.totalAmount || "0"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14 }),
                  " Total Consolidado (IVA Incl)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-6 py-3 bg-white text-black rounded-2xl font-black text-xs hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-white/5", children: "Imprimir Reporte" })
            ] })
          ] })
        ]
      }
    ) }) })
  ] });
};
const StatusBadge = ({ status }) => {
  const styles = {
    "SEARCHING": "bg-amber-50 text-amber-700 border-amber-100",
    "ASSIGNED": "bg-blue-50 text-blue-700 border-blue-100",
    "IN_PROGRESS": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "ARRIVED": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "DIAGNOSED": "bg-purple-50 text-purple-700 border-purple-100",
    "FINISHED": "bg-teal-50 text-teal-700 border-teal-100",
    "CANCELLED": "bg-red-50 text-red-700 border-red-100",
    "CLOSED": "bg-gray-50 text-gray-700 border-gray-100"
  };
  const icons = {
    "FINISHED": CircleCheck,
    "CANCELLED": CircleX,
    "DIAGNOSED": Activity,
    "SEARCHING": Clock
  };
  const Icon = icons[status] || CircleAlert;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border shadow-xs transition-transform hover:scale-105 cursor-default",
    styles[status] || "bg-gray-50 text-gray-500 border-gray-200"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 12 }),
    status
  ] });
};
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { Jobs as default };
