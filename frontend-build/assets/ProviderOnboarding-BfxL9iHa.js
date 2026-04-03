import { j as jsxRuntimeExports, C as Card, r as registerProvider } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';
import { C as COMUNAS_POR_REGION, R as REGIONES, A as AutocompleteInput, a as CALLES_COMUNES } from './autocompleteData-BCrnspmT.js';
import './vendor-utils-CyilRAHM.js';

function validarRUT(rut) {
  const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "");
  if (rutLimpio.length < 2) return false;
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const dvCalculado = 11 - suma % 11;
  const dvEsperado = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : dvCalculado.toString();
  return dv === dvEsperado;
}
function formatearRUT(rut) {
  const rutLimpio = rut.replace(/[^0-9kK]/g, "");
  if (rutLimpio.length < 2) return rutLimpio;
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpoFormateado}-${dv}`;
}

const ProviderOnboarding = ({ onComplete, onCancel }) => {
  const [step, setStep] = reactExports.useState(1);
  const [formData, setFormData] = reactExports.useState({
    userId: "user-1",
    type: "MECHANIC",
    businessName: "",
    rut: "",
    experience: "",
    specialties: [],
    bio: "",
    vehicle: "",
    licensePlate: "",
    latitude: -33.4489,
    longitude: -70.6693,
    address: "",
    commune: "",
    region: "Metropolitana",
    phone: "",
    website: "",
    paymentMethods: "CASH,TRANSFER",
    backgroundCheckUrl: "",
    idDocumentUrl: ""
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const specialtyOptions = [
    { id: "MECHANIC", label: "Mecánica General" },
    { id: "ELECTRICITY", label: "Electricidad / Electrónica" },
    { id: "BRAKES", label: "Frenos y Suspensión" },
    { id: "PAINT", label: "Hojalatería y Pintura" },
    { id: "AC", label: "Aire Acondicionado" },
    { id: "ALIGMENT", label: "Alineación y Balanceo" }
  ];
  const toggleSpecialty = (specLabel) => {
    const current = formData.specialties || [];
    if (current.includes(specLabel)) {
      setFormData({ ...formData, specialties: current.filter((s) => s !== specLabel) });
    } else {
      setFormData({ ...formData, specialties: [...current, specLabel] });
    }
  };
  const comunasSugeridas = reactExports.useMemo(() => {
    if (formData.region && COMUNAS_POR_REGION[formData.region]) {
      return COMUNAS_POR_REGION[formData.region];
    }
    return Object.values(COMUNAS_POR_REGION).flat();
  }, [formData.region]);
  const validateStep = () => {
    setError(null);
    if (step === 2) {
      if (!formData.businessName.trim()) {
        setError("El nombre de fantasía es obligatorio.");
        return false;
      }
      if (!formData.rut.trim()) {
        setError("El RUT es obligatorio.");
        return false;
      }
      if (!validarRUT(formData.rut)) {
        setError("El RUT ingresado no es válido.");
        return false;
      }
      if (!formData.experience || parseInt(formData.experience) < 0) {
        setError("Debes ingresar años de experiencia válidos.");
        return false;
      }
      if ((formData.type === "MECHANIC" || formData.type === "WORKSHOP") && formData.specialties.length === 0) {
        setError("Debes seleccionar al menos una especialidad.");
        return false;
      }
      if (!formData.bio.trim() || formData.bio.length < 20) {
        setError("La presentación debe tener al menos 20 caracteres.");
        return false;
      }
      if ((formData.type === "MECHANIC" || formData.type === "TOWING") && (!formData.vehicle.trim() || !formData.licensePlate.trim())) {
        setError("Los datos del vehículo (Marca/Patente) son obligatorios para este servicio.");
        return false;
      }
    } else if (step === 3) {
      if (!formData.commune.trim()) {
        setError("La comuna es obligatoria.");
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 9) {
        setError("Debes ingresar un número de teléfono válido.");
        return false;
      }
      if (!formData.address.trim()) {
        setError("La dirección es obligatoria.");
        return false;
      }
    } else if (step === 4) {
      if (!formData.backgroundCheckUrl) {
        setError("El Certificado de Antecedentes es obligatorio.");
        return false;
      }
      if (!formData.idDocumentUrl) {
        setError("La Cédula de Identidad es obligatoria.");
        return false;
      }
    }
    return true;
  };
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande (máx 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [field]: reader.result });
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        specialties: formData.specialties.join(",")
      };
      await registerProvider(payload);
      const savedPlan = localStorage.getItem("selectedPlan");
      if (savedPlan) {
        const { planId } = JSON.parse(savedPlan);
        localStorage.removeItem("selectedPlan");
        if (planId === "free") {
          alert("¡Registro exitoso! Tu plan Básico está activo.");
        } else {
          alert("¡Registro exitoso! Serás redirigido para completar el pago.");
        }
      } else {
        alert("¡Registro exitoso! Tu solicitud está siendo revisada.");
      }
      onComplete();
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.response?.data?.error || "Error al registrar prestador.");
    } finally {
      setLoading(false);
    }
  };
  const renderStep1_Type = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-slate-800", children: "Selecciona tu tipo de servicio" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [
      { id: "MECHANIC", label: "Mecánico a Domicilio", icon: "🔧" },
      { id: "WORKSHOP", label: "Taller Establecido", icon: "🏭" },
      { id: "TOWING", label: "Servicio de Grúa", icon: "🚛" },
      { id: "INSURANCE", label: "Aseguradora", icon: "🛡️" }
    ].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setFormData({ ...formData, type: type.id, specialties: [] }),
        className: `p-6 border-2 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all ${formData.type === type.id ? "border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100" : "border-slate-100 hover:border-blue-200 bg-white shadow-sm"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: type.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm tracking-tight", children: type.label })
        ]
      },
      type.id
    )) })
  ] });
  const renderStep2_Info = () => {
    const isTechnical = formData.type === "MECHANIC" || formData.type === "WORKSHOP";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-slate-800", children: "Información del Prestador" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Nombre de Fantasía o Empresa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.businessName,
              onChange: (e) => setFormData({ ...formData, businessName: e.target.value }),
              className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none",
              placeholder: "Ej: Talleres Martínez Ltda."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "RUT (Personal o Empresa)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: formData.rut,
              onChange: (e) => setFormData({ ...formData, rut: formatearRUT(e.target.value) }),
              className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none",
              placeholder: "12.345.678-9"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Años de Experiencia" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: formData.experience,
              onChange: (e) => setFormData({ ...formData, experience: e.target.value }),
              className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none",
              placeholder: "Ej: 10"
            }
          )
        ] }),
        !isTechnical && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Categoría" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100", children: formData.type === "TOWING" ? "🚚 Auxilio y Grúa" : "🛡️ Aseguradora" })
        ] })
      ] }),
      isTechnical && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold text-slate-700", children: "Especialidades (Selecciona una o más)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFormData({ ...formData, specialties: specialtyOptions.map((s) => s.label) }),
              className: "text-xs text-blue-600 font-bold hover:underline",
              children: "Seleccionar todas"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: specialtyOptions.map((spec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => toggleSpecialty(spec.label),
            className: `px-3 py-2 rounded-xl text-xs font-bold transition-all border ${(formData.specialties || []).includes(spec.label) ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`,
            children: [
              (formData.specialties || []).includes(spec.label) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: "✓" }),
              spec.label
            ]
          },
          spec.id
        )) }),
        (formData.specialties || []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-500 font-medium", children: "Debes seleccionar al menos una especialidad." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Presentación / Propuesta de Valor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: formData.bio,
            onChange: (e) => setFormData({ ...formData, bio: e.target.value }),
            className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none",
            rows: 3,
            placeholder: "Cuéntanos por qué los clientes deberían elegirte..."
          }
        )
      ] }),
      (formData.type === "MECHANIC" || formData.type === "TOWING") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 p-4 rounded-2xl text-white shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-black mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚗" }),
          " Datos del Vehículo Operativo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1", children: "Marca / Modelo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.vehicle,
                onChange: (e) => setFormData({ ...formData, vehicle: e.target.value }),
                className: "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm",
                placeholder: "Ej: Ford Transit"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1", children: "Patente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: formData.licensePlate,
                onChange: (e) => setFormData({ ...formData, licensePlate: e.target.value }),
                className: "w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm",
                placeholder: "AB-CD-11"
              }
            )
          ] })
        ] })
      ] })
    ] });
  };
  const renderStep3_Location = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black", children: "Ubicación y Contacto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Región" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: formData.region,
            onChange: (e) => setFormData({ ...formData, region: e.target.value }),
            className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none",
            children: REGIONES.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: region, children: region }, region))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Comuna" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutocompleteInput,
          {
            value: formData.commune,
            onChange: (value) => setFormData({ ...formData, commune: value }),
            suggestions: comunasSugeridas,
            placeholder: "Ej: Las Condes",
            className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Teléfono" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "tel",
            value: formData.phone,
            onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
            className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl",
            placeholder: "+56 9 83414730"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-slate-600 mb-1", children: "Dirección" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AutocompleteInput,
          {
            value: formData.address,
            onChange: (value) => setFormData({ ...formData, address: value }),
            suggestions: CALLES_COMUNES,
            placeholder: "Calle, número...",
            className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          }
        )
      ] })
    ] })
  ] });
  const renderStep4_Docs = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black", children: "Documentación Obligatoria" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mb-4", children: "Sube fotos o PDFs claros de tus documentos para validar tu cuenta." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => document.getElementById("file-antecedentes")?.click(),
          className: `p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${formData.backgroundCheckUrl ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "file-antecedentes",
                type: "file",
                className: "hidden",
                accept: "image/*,application/pdf",
                onChange: (e) => handleFileUpload(e, "backgroundCheckUrl")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl block mb-2", children: formData.backgroundCheckUrl ? "✅" : "📄" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${formData.backgroundCheckUrl ? "text-green-700" : "text-slate-600"}`, children: formData.backgroundCheckUrl ? "Certificado Cargado" : "Certificado de Antecedentes" }),
            formData.backgroundCheckUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-1", children: "Haz clic para cambiar el archivo" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => document.getElementById("file-id")?.click(),
          className: `p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${formData.idDocumentUrl ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "file-id",
                type: "file",
                className: "hidden",
                accept: "image/*,application/pdf",
                onChange: (e) => handleFileUpload(e, "idDocumentUrl")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl block mb-2", children: formData.idDocumentUrl ? "✅" : "🆔" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${formData.idDocumentUrl ? "text-green-700" : "text-slate-600"}`, children: formData.idDocumentUrl ? "Cédula Cargada" : "Cédula de Identidad (Ambos Lados)" }),
            formData.idDocumentUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-1", children: "Haz clic para cambiar el archivo" })
          ]
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-2xl mx-auto p-8 shadow-2xl rounded-3xl animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-slate-800 tracking-tight", children: "Registro de Prestadores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black", children: [
          "Paso ",
          step,
          " de 4"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 ease-out", style: { width: `${step / 4 * 100}%` } }) })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-slideDown", children: [
      "⚠️ ",
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[400px]", children: [
      step === 1 && renderStep1_Type(),
      step === 2 && renderStep2_Info(),
      step === 3 && renderStep3_Location(),
      step === 4 && renderStep4_Docs()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-12 pt-6 border-t border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: step > 1 ? handleBack : onCancel,
          className: "px-6 py-3 text-slate-400 font-black hover:text-slate-800 transition-colors",
          children: step > 1 ? "Atrás" : "Cancelar"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: step < 4 ? handleNext : handleSubmit,
          disabled: loading,
          className: `px-10 py-4 font-black rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${step < 4 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"}`,
          children: loading ? "Procesando..." : step < 4 ? "Siguiente" : "Finalizar Registro"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      ` } })
  ] });
};

export { ProviderOnboarding as default };
