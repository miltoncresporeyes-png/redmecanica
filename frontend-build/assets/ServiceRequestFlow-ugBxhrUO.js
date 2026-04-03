import { u as useSuccessToast, d as useErrorToast, e as useInfoToast, f as useConfirm, j as jsxRuntimeExports, S as SEO, b as getServices, h as getPaymentMethods, i as createJob, k as createPayment, l as getProviders, m as createQuote } from './index-DQFChqCe.js';
import { e as useNavigate, i as useSearchParams, r as reactExports } from './vendor-react-C9gK5gKp.js';
import './vendor-utils-CyilRAHM.js';

const carMakes = [
  { make: "Chevrolet", models: ["Sail", "Onix", "Groove"] },
  { make: "Suzuki", models: ["Swift", "Baleno", "S-Presso"] },
  { make: "Toyota", models: ["Yaris", "Hilux", "RAV4"] },
  { make: "Nissan", models: ["Versa", "Kicks", "Qashqai"] },
  { make: "Hyundai", models: ["Accent", "Tucson", "Creta"] },
  { make: "Kia", models: ["Rio", "Morning", "Seltos"] },
  { make: "Peugeot", models: ["208", "2008", "3008"] },
  { make: "MG", models: ["ZS", "MG3"] }
];
const vehicleYears = Array.from({ length: 20 }, (_, i) => (/* @__PURE__ */ new Date()).getFullYear() - i);

const ServiceRequestFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();
  const showInfo = useInfoToast();
  const confirm = useConfirm();
  const [step, setStep] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [services, setServices] = reactExports.useState([]);
  const [providers, setProviders] = reactExports.useState([]);
  const [quotes, setQuotes] = reactExports.useState([]);
  const [selectedService, setSelectedService] = reactExports.useState(null);
  const [selectedProvider, setSelectedProvider] = reactExports.useState(null);
  const [selectedQuote, setSelectedQuote] = reactExports.useState(null);
  const [vehicle, setVehicle] = reactExports.useState({
    make: carMakes[0].make,
    model: carMakes[0].models[0],
    year: vehicleYears[0],
    licensePlate: ""
  });
  const [problemDescription, setProblemDescription] = reactExports.useState("");
  const [job, setJob] = reactExports.useState(null);
  const [paymentMethods, setPaymentMethods] = reactExports.useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = reactExports.useState("webpay");
  reactExports.useEffect(() => {
    const init = async () => {
      await loadServices();
      loadPaymentMethods();
      searchParams.get("serviceId");
    };
    init();
  }, []);
  reactExports.useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    if (serviceId && services.length > 0) {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [services, searchParams]);
  reactExports.useEffect(() => {
    if (step === 5) {
      showSuccess("🎉 ¡Solicitud completada! Te contactaremos pronto.");
    }
  }, [step]);
  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Error loading services:", err);
      showError("No pudimos cargar los servicios. Intenta recargar la página.");
    }
  };
  const loadPaymentMethods = async () => {
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      console.error("Error loading payment methods:", err);
    }
  };
  const handleSearchProviders = async () => {
    if (!selectedService) {
      showError("Por favor selecciona un servicio primero");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = {
        lat: "-33.4489",
        lng: "-70.6693",
        radius: "15"
      };
      const data = await getProviders(params);
      setProviders(data.slice(0, 5));
      setStep(2);
      showSuccess(`✅ Encontramos ${data.length} Prestadores cercanos`);
    } catch (err) {
      setError("Error al buscar Prestadores");
      showError("❌ No pudimos buscar Prestadores. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectProvider = async (provider) => {
    const shouldProceed = await confirm({
      title: "¿Solicitar cotización?",
      message: `¿Quieres solicitar una cotización a ${provider.user?.name || "este prestador"}?`,
      confirmText: "Solicitar",
      cancelText: "Cancelar",
      confirmVariant: "primary",
      icon: "info"
    });
    if (shouldProceed) {
      setSelectedProvider(provider);
      handleRequestQuote(provider);
    }
  };
  const handleRequestQuote = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      if (!job && selectedService) {
        const jobData = await createJob({
          serviceId: selectedService.id,
          problemDescription: problemDescription || `Solicitud de servicio: ${selectedService.name}`
        });
        setJob(jobData);
      }
      const quoteData = await createQuote({
        jobId: job?.id || "demo-job",
        providerId: provider.id,
        preliminaryDiagnosis: problemDescription,
        totalCost: selectedService.price,
        estimatedDuration: 60,
        warranty: "30 días"
      });
      setQuotes([quoteData]);
      setStep(3);
      showSuccess("✅ ¡Cotización recibida! Revisa los detalles.");
    } catch (err) {
      setError("Error al solicitar cotización");
      showError("❌ No pudimos solicitar la cotización. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleAcceptQuote = async (quote) => {
    const shouldAccept = await confirm({
      title: "¿Aceptar cotización?",
      message: `¿Confirmas que quieres aceptar esta cotización de ${selectedService?.price?.toLocaleString("es-CL")}?`,
      confirmText: "Aceptar",
      cancelText: "Revisar",
      confirmVariant: "primary",
      icon: "info"
    });
    if (shouldAccept) {
      setSelectedQuote(quote);
      setStep(4);
      showSuccess("✅ Cotización aceptada. Procede al pago.");
    }
  };
  const handlePayment = async () => {
    const shouldPay = await confirm({
      title: "¿Confirmar pago?",
      message: `Vas a pagar ${selectedService?.price?.toLocaleString("es-CL")} que será retenido en escrow hasta que recibas el servicio.`,
      confirmText: "Pagar",
      cancelText: "Cancelar",
      confirmVariant: "primary",
      icon: "info"
    });
    if (!shouldPay) return;
    setLoading(true);
    setError(null);
    try {
      if (!job && selectedService) {
        const jobData = await createJob({
          serviceId: selectedService.id,
          problemDescription: problemDescription || `Solicitud de servicio: ${selectedService.name}`
        });
        setJob(jobData);
      }
      const paymentData = await createPayment({
        jobId: job?.id || "demo-job",
        amount: selectedService?.price || 0,
        paymentMethod: selectedPaymentMethod
      });
      if (paymentData.token && selectedPaymentMethod === "webpay") {
        showSuccess(`✅ Pago procesado. Token: ${paymentData.token.substring(0, 8)}...`);
      } else {
        showSuccess("✅ ¡Pago completado exitosamente!");
      }
      setStep(5);
    } catch (err) {
      setError("Error al procesar pago");
      showError("❌ No pudimos procesar el pago. Verifica tus datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = async () => {
    const shouldCancel = await confirm({
      title: "¿Cancelar solicitud?",
      message: "¿Estás seguro de que quieres cancelar? Perderás todo el progreso.",
      confirmText: "Sí, cancelar",
      cancelText: "Continuar",
      confirmVariant: "secondary",
      icon: "warning"
    });
    if (shouldCancel) {
      showInfo("Solicitud cancelada");
      navigate("/");
    }
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: "Paso 1 de 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mt-3", children: "¿Qué servicio necesitas?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tu vehículo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: vehicle.make,
                  onChange: (e) => {
                    const make = carMakes.find((m) => m.make === e.target.value);
                    setVehicle({ ...vehicle, make: e.target.value, model: make?.models[0] || "" });
                  },
                  className: "p-3 border rounded-lg",
                  children: carMakes.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m.make, children: m.make }, m.make))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: vehicle.model,
                  onChange: (e) => setVehicle({ ...vehicle, model: e.target.value }),
                  className: "p-3 border rounded-lg",
                  children: carMakes.find((m) => m.make === vehicle.make)?.models.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: vehicle.year,
                  onChange: (e) => setVehicle({ ...vehicle, year: parseInt(e.target.value) }),
                  className: "p-3 border rounded-lg",
                  children: vehicleYears.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Selecciona un servicio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: services.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                onClick: () => setSelectedService(service),
                className: `p-4 border rounded-lg cursor-pointer transition-all ${selectedService?.id === service.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: service.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: service.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-blue-600", children: [
                    "$",
                    service.price?.toLocaleString("es-CL")
                  ] })
                ] })
              },
              service.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Describe el problema (opcional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: problemDescription,
                onChange: (e) => setProblemDescription(e.target.value),
                placeholder: "Ej: Ruido al frenar, no parte el auto, perdida de aceite...",
                className: "w-full p-3 border rounded-lg",
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSearchProviders,
              disabled: !selectedService || loading,
              className: "w-full bg-blue-600 text-white py-4 rounded-lg font-bold disabled:opacity-50",
              children: loading ? "Buscando Prestadores..." : "Buscar Prestadores"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleCancel,
              className: "w-full text-gray-500 py-3 hover:text-gray-700 transition-colors",
              children: "Cancelar"
            }
          )
        ] });
      case 2:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: "Paso 2 de 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mt-3", children: "Elige un proveedor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Selecciona un proveedor para recibir su cotización" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: providers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-4", children: "No hay Prestadores disponibles en este momento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "text-blue-600 underline", children: "Volver a seleccionar servicio" })
          ] }) : providers.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => handleSelectProvider(provider),
              className: "p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: provider.user?.name || "Prestador" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
                    provider.type,
                    " • ",
                    provider.commune
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-500", children: [
                      "⭐ ",
                      provider.rating || "5.0"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 text-sm", children: "✓ Verificado" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium", children: "Solicitar Cotización" })
              ] })
            },
            provider.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "text-gray-500 underline", children: "← Volver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCancel, className: "text-red-500 hover:text-red-700 transition-colors", children: "Cancelar solicitud" })
          ] })
        ] });
      case 3:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: "Paso 3 de 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mt-3", children: "Cotización recibida" })
          ] }),
          quotes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-lg p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: selectedProvider?.user?.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: selectedProvider?.type })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-blue-600", children: [
                "$",
                selectedService?.price?.toLocaleString("es-CL")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Servicio:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedService?.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Tiempo estimado:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "60 minutos" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Garantía:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30 días" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleAcceptQuote(quotes[0]),
                className: "w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-4",
                children: "Aceptar Cotización"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Esperando cotización..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "text-gray-500 underline", children: "← Volver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCancel, className: "text-red-500 hover:text-red-700 transition-colors", children: "Cancelar solicitud" })
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium", children: "Paso 4 de 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mt-3", children: "Método de pago" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm mt-1", children: "El pago será retenido hasta que confirmes el servicio" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: paymentMethods.map((method) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => setSelectedPaymentMethod(method.id),
              className: `p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: method.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: method.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: method.description })
                ] }),
                selectedPaymentMethod === method.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-bold", children: "✓" })
              ] })
            },
            method.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-800", children: "🔒 Tu dinero estará protegido en escrow hasta que confirmes que el servicio fue completado a tu satisfacción." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handlePayment,
              disabled: loading,
              className: "w-full bg-green-600 text-white py-4 rounded-lg font-bold disabled:opacity-50",
              children: loading ? "Procesando..." : `Pagar $${selectedService?.price?.toLocaleString("es-CL")}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "text-gray-500 underline", children: "← Volver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCancel, className: "text-red-500 hover:text-red-700 transition-colors", children: "Cancelar solicitud" })
          ] })
        ] });
      case 5:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "✅" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "¡Solicitud enviada!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 mb-6", children: [
            "El proveedor ",
            selectedProvider?.user?.name,
            " ha sido notificado.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Te contactará pronto para confirmar los detalles."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-lg text-left mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-2", children: "Resumen:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Servicio:" }),
                " ",
                selectedService?.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Prestador:" }),
                " ",
                selectedProvider?.user?.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Monto:" }),
                " $",
                selectedService?.price?.toLocaleString("es-CL")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate("/"),
              className: "bg-blue-600 text-white px-8 py-3 rounded-lg font-bold",
              children: "Volver al inicio"
            }
          )
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SEO,
      {
        title: "Solicitar Servicio Mecánico | Cotiza Gratis",
        description: "Solicita servicios mecánicos a domicilio en Chile. Cotiza gratis, compara precios y contrata profesionales verificados con garantía.",
        keywords: "solicitar mecánico, cotizar servicio auto, mecánico a domicilio Chile",
        canonicalUrl: "https://redmecanica.cl/solicitar"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-gray-900", children: "Solicitar Servicio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Conecta con los mejores profesionales" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-6", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 text-red-600 p-3 rounded-lg mb-4", children: error }),
        renderStep()
      ] })
    ] }) })
  ] });
};

export { ServiceRequestFlow as default };
