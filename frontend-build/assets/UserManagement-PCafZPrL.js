import { j as jsxRuntimeExports, a as api } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { R as RefreshCw } from './refresh-cw-zT7vZdTa.js';
import { D as Download } from './download-sbWWPoCo.js';
import { S as Search } from './search-DEs_2hEI.js';
import { F as Funnel } from './funnel-DJEx6TPD.js';
import { A as AnimatePresence } from './index-BuLliQpS.js';
import { m as motion } from './proxy-CF9ZQatx.js';
import { c as createLucideIcon } from './createLucideIcon-CBunf2tC.js';
import { C as Clock } from './clock-CeH-R9wG.js';
import { U as UserCheck } from './user-check-SQLMoNFq.js';
import './vendor-utils-CyilRAHM.js';

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode$3);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$2);

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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);

/**
 * @license lucide-react v0.564.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);

const UserManagement = () => {
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchUsers();
  }, []);
  const filteredUsers = users.filter(
    (user) => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "" || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900 tracking-tight", children: "Gestión de Usuarios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mt-1", children: "Control de acceso y perfiles de toda la plataforma." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: fetchUsers,
            className: "p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, className: loading ? "animate-spin" : "" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] rounded-xl text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
          "Exportar CSV"
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
            placeholder: "Buscar por nombre o email...",
            className: "bg-transparent border-none focus:outline-none text-sm w-full",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 w-full md:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex-1 md:flex-none justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 16 }),
        "Rol"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Usuario" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Rol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Actividad" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Registro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredUsers.map((user, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.tr,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.03 },
          className: "group hover:bg-gray-50/50 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform", children: user.name?.charAt(0) || user.email.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black text-gray-900 leading-none", children: user.name || "Usuario Anónimo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-gray-400 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 10 }),
                  user.email
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs",
              user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : user.role === "MECHANIC" ? "bg-orange-100 text-orange-700" : "bg-blue-50 text-blue-700"
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 10 }),
              user.role
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-gray-700 tracking-tight", children: user._count?.serviceRequests || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Solicitudes" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6 text-sm text-gray-500 font-bold tracking-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-gray-300" }),
              new Date(user.createdAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all", title: "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 18 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all", title: "Bloquear", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { size: 18 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[1px] h-4 bg-gray-100 mx-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 18 }) })
            ] }) })
          ]
        },
        user.id
      )) }) })
    ] }) }) })
  ] });
};
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { UserManagement as default };
