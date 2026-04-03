import { j as jsxRuntimeExports, C as Card, g as geocodeAddress, s as searchNearbyProviders } from './index-DQFChqCe.js';
import { i as useSearchParams, e as useNavigate, r as reactExports, d as React } from './vendor-react-C9gK5gKp.js';
import { C as COMUNAS_POR_REGION, R as REGIONES, A as AutocompleteInput } from './autocompleteData-BCrnspmT.js';
import './vendor-utils-CyilRAHM.js';

const ProviderCard = ({ provider, onSelect }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "MECHANIC":
        return "🔧";
      case "WORKSHOP":
        return "🏭";
      case "TOWING":
        return "🚛";
      case "INSURANCE":
        return "🛡️";
      default:
        return "⚙️";
    }
  };
  const getTypeLabel = (type) => {
    switch (type) {
      case "MECHANIC":
        return "Mecánico";
      case "WORKSHOP":
        return "Taller";
      case "TOWING":
        return "Grúa";
      case "INSURANCE":
        return "Aseguradora";
      default:
        return type;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-5 hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200 cursor-pointer overflow-hidden", onClick: () => onSelect?.(provider), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-start gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner", children: getTypeIcon(provider.type) }),
      provider.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -left-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-4 border-white title='Proveedor Verificado'", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "✓" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between items-start mb-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-extrabold text-xl text-gray-900 leading-tight", children: provider.businessName || provider.user?.name || "Prestador de Servicio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider", children: getTypeLabel(provider.type) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 items-center", children: (provider.specialties || provider.specialty || "").split(",").map((spec, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-gray-500 text-[10px] font-bold uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100",
                children: spec.trim()
              },
              idx
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-600 font-bold mr-1", children: "★" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-800 font-bold text-sm", children: provider.rating.toFixed(1) })
        ] })
      ] }),
      provider.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed", children: provider.bio }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 opacity-70", children: "📍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
            provider.commune || "Santiago",
            ", ",
            provider.region || "Metropolitana"
          ] })
        ] }),
        provider.experience && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm text-gray-700 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 opacity-70", children: "📅" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            provider.experience,
            " años de trayectoria"
          ] })
        ] }),
        provider.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 opacity-70", children: "📞" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: provider.phone })
        ] }),
        provider.distance !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-sm text-green-600 font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: "⚡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "A ",
            provider.distance.toFixed(1),
            " km de ti"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto pt-4 border-t border-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: (provider.paymentMethods || "").split(",").map((method) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-tighter",
            children: method === "CASH" ? "Efectivo" : method === "DEBIT" ? "Débito" : method === "CREDIT" ? "Crédito" : "Transferencia"
          },
          method
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95", children: "Ver Cotización" })
      ] })
    ] })
  ] }) });
};

const ProviderSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultadosRef = reactExports.useRef(null);
  const isEmergency = searchParams.get("emergency") === "true";
  const [filters, setFilters] = reactExports.useState({
    region: searchParams.get("region") || "",
    commune: searchParams.get("commune") || "",
    type: isEmergency ? "TOWING" : searchParams.get("type") || "",
    certified: searchParams.get("certified") === "true",
    radius: "10",
    query: searchParams.get("query") || ""
  });
  const [results, setResults] = reactExports.useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [userLocation, setUserLocation] = reactExports.useState(null);
  const [locationError, setLocationError] = reactExports.useState(null);
  const specialtyOptions = [
    "Mecánica General",
    "Electricidad / Electrónica",
    "Frenos y Suspensión",
    "Auxilio y Grúa",
    "Hojalatería y Pintura",
    "Aire Acondicionado",
    "Alineación y Balanceo"
  ];
  reactExports.useEffect(() => {
    if (navigator.geolocation && !locationError) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Permiso de ubicación denegado. Puedes buscar sin ubicación automática.");
          }
        },
        { maximumAge: 3e5 }
        // Cache location for 5 minutes
      );
    }
  }, [locationError]);
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Permiso de ubicación denegado.");
          }
        }
      );
    }
  };
  const toggleSpecialty = (spec) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };
  React.useEffect(() => {
    const emergencyType = searchParams.get("emergency") === "true" ? "TOWING" : "";
    const newFilters = {
      region: searchParams.get("region") || "",
      commune: searchParams.get("commune") || "",
      type: emergencyType || searchParams.get("type") || "",
      certified: searchParams.get("certified") === "true",
      radius: "10",
      query: searchParams.get("query") || ""
    };
    setFilters(newFilters);
    if (newFilters.type || newFilters.certified || newFilters.region || newFilters.commune || newFilters.query || searchParams.get("emergency") === "true") {
      handleSearch(newFilters);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [searchParams]);
  React.useEffect(() => {
    if (results.length > 0 && !loading) {
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [results, loading]);
  const comunasSugeridas = reactExports.useMemo(() => {
    if (filters.region && COMUNAS_POR_REGION[filters.region]) {
      return COMUNAS_POR_REGION[filters.region];
    }
    return Object.values(COMUNAS_POR_REGION).flat() || [];
  }, [filters.region]);
  const handleSearch = async (currentFilters = filters) => {
    setLoading(true);
    setResults([]);
    try {
      let lat = userLocation?.lat ?? -33.4489;
      let lng = userLocation?.lng ?? -70.6693;
      if (isNaN(lat) || isNaN(lng) || lat === void 0 || lng === void 0) {
        lat = -33.4489;
        lng = -70.6693;
      }
      if (currentFilters.commune) {
        const location = await geocodeAddress(`${currentFilters.commune}, ${currentFilters.region || "Chile"}`);
        if (location) {
          lat = location.lat;
          lng = location.lng;
        }
      }
      const searchParams2 = {
        lat: Number(lat),
        lng: Number(lng),
        radiusKm: parseInt(currentFilters.radius) || 15
      };
      if (currentFilters.type && ["MECHANIC", "WORKSHOP", "TOWING", "INSURANCE"].includes(currentFilters.type)) {
        searchParams2.serviceType = currentFilters.type;
      }
      if (isEmergency) {
        searchParams2.availableNow = true;
      }
      const response = await searchNearbyProviders(searchParams2);
      let providers = response.providers || [];
      providers = providers.filter((p) => p.status === "ACTIVE");
      setResults(providers);
    } catch (error) {
      console.error("Error searching providers:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    isEmergency && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🚨" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: "Emergencias 24/7 - Servicio de Grúa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-100", children: "Conectando con Prestadores disponibles cerca de ti..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🚨" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `p-6 mb-6 ${isEmergency ? "rounded-t-none" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-800", children: isEmergency ? "🚨 Solicitar Grúa de Emergencia" : "Buscar Prestadores" }),
          filters.type && !isEmergency && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-600 mt-1", children: [
            "📍 Filtro activo: ",
            filters.type === "WORKSHOP" ? "Talleres certificados" : filters.type === "TOWING" ? "Servicios de grúa" : filters.type === "MECHANIC" ? "Mecánicos" : filters.type
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/"), className: "text-gray-500 hover:text-gray-700 text-2xl", children: "×" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Región" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.region,
              onChange: (e) => setFilters({ ...filters, region: e.target.value, commune: "" }),
              className: "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todas" }),
                REGIONES.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: region, children: region }, region))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Comuna" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AutocompleteInput,
            {
              value: filters.commune,
              onChange: (value) => setFilters({ ...filters, commune: value }),
              suggestions: comunasSugeridas,
              placeholder: "Ej: Las Condes",
              className: "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.type,
              onChange: (e) => setFilters({ ...filters, type: e.target.value }),
              className: "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MECHANIC", children: "Mecánico" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "WORKSHOP", children: "Taller" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "TOWING", children: "Grúa" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "INSURANCE", children: "Aseguradora" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Radio (km)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filters.radius,
              onChange: (e) => setFilters({ ...filters, radius: e.target.value }),
              className: "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5 km" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "10 km" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "20", children: "20 km" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "50", children: "50 km" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "certified-check",
            type: "checkbox",
            checked: filters.certified,
            onChange: (e) => setFilters({ ...filters, certified: e.target.checked }),
            className: "w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mr-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "certified-check", className: "text-sm font-bold text-gray-700 select-none cursor-pointer flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full mr-2", children: "VERIFICADO" }),
          "Solo mostrar Prestadores certificados"
        ] })
      ] }),
      locationError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "📍 ",
          locationError
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: requestLocation,
            className: "text-blue-600 hover:text-blue-800 font-medium underline",
            children: "Habilitar"
          }
        )
      ] }),
      !locationError && !userLocation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📍 ¿Usar tu ubicación actual?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: requestLocation,
            className: "text-blue-600 hover:text-blue-800 font-medium underline",
            children: "Sí, usar mi ubicación"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Especialidades (selecciona una o más)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: specialtyOptions.map((spec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => toggleSpecialty(spec),
            className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedSpecialties.includes(spec) ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 shadow-sm"}`,
            children: [
              selectedSpecialties.includes(spec) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: "✓" }),
              spec
            ]
          },
          spec
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSearch,
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50",
          children: loading ? "Buscando..." : "🔍 Buscar Prestadores"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: resultadosRef, className: "space-y-4", children: [
      results.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-gray-500 py-10", children: "No hay resultados. Intenta ajustar los filtros." }),
      results.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderCard, { provider }, provider.id))
    ] })
  ] });
};

export { ProviderSearch as default };
