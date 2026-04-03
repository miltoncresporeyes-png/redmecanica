import { b as getServices, j as jsxRuntimeExports } from './index-DQFChqCe.js';
import { e as useNavigate, r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const triageTree = {
  start: {
    id: "start",
    text: "¿Cuál es el síntoma principal que notas en tu vehículo?",
    options: [
      { text: "Ruidos extraños", nextQuestionId: "ruidos" },
      { text: "Pérdida de potencia o tirones", nextQuestionId: "potencia" },
      { text: "Humo o fugas de líquidos", nextQuestionId: "fugas" },
      { text: "Problemas al frenar o dirección", nextQuestionId: "frenos_direccion" },
      { text: "Luces encendidas en el tablero", nextQuestionId: "tablero" },
      { text: "No arranca / Falla eléctrica", nextQuestionId: "electrico" }
    ]
  },
  ruidos: {
    id: "ruidos",
    text: "¿Cuándo escuchas el ruido principalmente?",
    options: [
      { text: "Al frenar (chirrido o roce metálico)", resultServiceId: "frenos", resultAnalysis: "Probable desgaste de pastillas o discos de freno. Es vital revisarlo por seguridad." },
      { text: "Al girar el volante", nextQuestionId: "ruidos_giro" },
      { text: "Al pasar por baches (golpeteo)", resultServiceId: "suspension", resultAnalysis: "Indica desgaste en amortiguadores, bujes o terminales de dirección." },
      { text: "Proveniente del motor al estar detenido", resultServiceId: "motor", resultAnalysis: "Puede ser una correa suelta o problema interno del motor. Requiere diagnóstico mecánico." }
    ]
  },
  ruidos_giro: {
    id: "ruidos_giro",
    text: '¿Es un "clac-clac" rítmico solo al doblar?',
    options: [
      { text: "Sí, suena rítmico", resultServiceId: "transmision", resultAnalysis: "Probable falla en la junta homocinética (semieje)." },
      { text: "No, es un zumbido constante", resultServiceId: "suspension", resultAnalysis: "Indica un rodamiento de masa (rodamiento de rueda) defectuoso." }
    ]
  },
  potencia: {
    id: "potencia",
    text: '¿El auto tironea o se siente "pesado"?',
    options: [
      { text: "Tironea al acelerar", resultServiceId: "afinamiento", resultAnalysis: "Podría ser un problema de bujías, cables o inyectores sucios. Se recomienda afinamiento." },
      { text: "Sube la temperatura pero no avanza", resultServiceId: "transmision", resultAnalysis: "Falla probable en el embrague (autos manuales) o caja de cambios (automáticos)." },
      { text: "Siente olor a combustible", resultServiceId: "revision_general", resultAnalysis: "Posible fuga de combustible o falla en la mezcla. Peligro de incendio, revisar pronto." }
    ]
  },
  fugas: {
    id: "fugas",
    text: "¿De qué color es el líquido que gotea?",
    options: [
      { text: "Aceite oscuro/café", resultServiceId: "aceite", resultAnalysis: "Fuga de aceite de motor. Requiere cambio de empaquetaduras o sellos." },
      { text: "Verde/Rojo brillante y acuoso", resultServiceId: "refrigeracion", resultAnalysis: "Fuga de líquido refrigerante. Peligro de sobrecalentamiento del motor." },
      { text: "Agua clara (sin olor)", resultServiceId: "revision_general", resultAnalysis: "Probablemente condensación del aire acondicionado, suele ser normal." }
    ]
  },
  frenos_direccion: {
    id: "frenos_direccion",
    text: "¿Qué sientes al volante?",
    options: [
      { text: 'El pedal de freno está "esponjoso"', resultServiceId: "frenos", resultAnalysis: "Presencia de aire en el sistema hidráulico o bajo nivel de líquido. Riesgo alto." },
      { text: "El volante vibra a alta velocidad", resultServiceId: "balanceo", resultAnalysis: "Tus ruedas necesitan alineación y balanceo." },
      { text: "El volante está muy duro", resultServiceId: "direccion", resultAnalysis: "Falla en la bomba de dirección asistida o falta de líquido hidráulico." }
    ]
  },
  tablero: {
    id: "tablero",
    text: "¿De qué color es la luz que se encendió?",
    options: [
      { text: "Roja (Aceite, Temperatura, Batería)", resultServiceId: "grua", resultAnalysis: "¡Alerta! Detén el vehículo. El color rojo indica falla crítica. Se sugiere grúa a taller." },
      { text: "Amarilla / Naranja (Check Engine)", resultServiceId: "escaner", resultAnalysis: "El computador detectó una anomalía. Se requiere escáner automotriz para leer el código de falla." }
    ]
  },
  electrico: {
    id: "electrico",
    text: "¿Qué sucede al girar la llave?",
    options: [
      { text: "No hace ningún ruido ni prenden luces", resultServiceId: "bateria", resultAnalysis: "Batería descargada o bornes sueltos/sulfatados." },
      { text: "Las luces prenden pero hace un chasquido", resultServiceId: "electrico", resultAnalysis: "Falla en el motor de partida." },
      { text: "El motor gira pero no arranca", resultServiceId: "revision_general", resultAnalysis: "Falla de encendido (bujías) o falta de combustible (bomba)." }
    ]
  }
};

const TriageChatbot = ({ onServiceSelect, availableServices: initialServices }) => {
  const navigate = useNavigate();
  const [availableServices, setAvailableServices] = reactExports.useState(initialServices || []);
  const [currentId, setCurrentId] = reactExports.useState("start");
  const [history, setHistory] = reactExports.useState([]);
  const [showResult, setShowResult] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!initialServices || initialServices.length === 0) {
      getServices().then(setAvailableServices).catch(console.error);
    }
  }, [initialServices]);
  const currentQuestion = triageTree[currentId] || triageTree["start"];
  const handleOptionClick = (option) => {
    if (option.resultServiceId && option.resultAnalysis) {
      setResult({
        serviceId: option.resultServiceId,
        analysis: option.resultAnalysis
      });
      setShowResult(true);
    } else if (option.nextQuestionId) {
      setHistory([...history, currentId]);
      setCurrentId(option.nextQuestionId);
    }
  };
  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      setResult(null);
      return;
    }
    const newHistory = [...history];
    const lastId = newHistory.pop();
    if (lastId) {
      setCurrentId(lastId);
      setHistory(newHistory);
    }
  };
  const handleSelectService = () => {
    if (result) {
      let service = availableServices.find((s) => s.id === result.serviceId);
      if (!service) {
        service = availableServices.find((s) => s.id === "revision_general") || availableServices[0];
      }
      if (service) {
        if (onServiceSelect) {
          onServiceSelect(service);
        } else {
          navigate(`/solicitar?serviceId=${service.id}`);
        }
      }
    }
  };
  const restart = () => {
    setCurrentId("start");
    setHistory([]);
    setShowResult(false);
    setResult(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-inner border border-blue-100 overflow-hidden min-h-[400px] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "🔧" }),
          " Asistente de Diagnóstico"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-100 italic", children: "Identifiquemos el problema de tu vehículo paso a paso" })
      ] }),
      (history.length > 0 || showResult) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: restart,
          className: "text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition-colors",
          children: "Reiniciar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow p-6 flex flex-col", children: !showResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0", children: "🤖" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-none p-4 text-gray-800 shadow-sm max-w-[90%]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: currentQuestion.text }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 pl-11", children: currentQuestion.options.map((option, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleOptionClick(option),
          className: "w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group flex justify-between items-center shadow-sm hover:shadow-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 group-hover:text-blue-900 font-medium", children: option.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-200 group-hover:text-blue-500 transition-transform group-hover:translate-x-1", children: "→" })
          ]
        },
        index
      )) }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleBack,
          className: "ml-11 text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: "←" }),
            " Volver a la pregunta anterior"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn text-center py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-100 rounded-full h-16 w-16 flex items-center justify-center text-green-600 mx-auto mb-4 border-4 border-green-50 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "✅" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-bold text-gray-900", children: "Diagnóstico Preliminar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-inner italic", children: [
          '"',
          result?.analysis,
          '"'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-blue-50 rounded-xl border border-blue-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-800 font-semibold mb-3", children: "Recomendamos el siguiente servicio:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm font-bold text-blue-600 text-lg border border-blue-200", children: availableServices.find((s) => s.id === result?.serviceId)?.name || "Revisión General" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleBack,
            className: "flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors",
            children: "Cambiar Respuesta"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSelectService,
            className: "flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5",
            children: "Seleccionar y Continuar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-6 px-10", children: "* Este diagnóstico es orientativo. El resultado final será validado por el profesional mecánico." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      ` } })
  ] });
};

export { TriageChatbot as default };
