import { j as jsxRuntimeExports } from './index-DQFChqCe.js';
import { r as reactExports } from './vendor-react-C9gK5gKp.js';

const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder = "",
  className = "",
  type = "text"
}) => {
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = reactExports.useState([]);
  const wrapperRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (value.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) => suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions]);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapperRef, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        onFocus: () => setShowSuggestions(true),
        placeholder,
        className
      }
    ),
    showSuggestions && filteredSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50", children: filteredSuggestions.map((suggestion, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => handleSelect(suggestion),
        className: "w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors",
        children: suggestion
      },
      index
    )) })
  ] });
};

const REGIONES = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes"
];
const COMUNAS_POR_REGION = {
  "Metropolitana": [
    "Santiago",
    "Cerrillos",
    "Cerro Navia",
    "Conchalí",
    "El Bosque",
    "Estación Central",
    "Huechuraba",
    "Independencia",
    "La Cisterna",
    "La Florida",
    "La Granja",
    "La Pintana",
    "La Reina",
    "Las Condes",
    "Lo Barnechea",
    "Lo Espejo",
    "Lo Prado",
    "Macul",
    "Maipú",
    "Ñuñoa",
    "Pedro Aguirre Cerda",
    "Peñalolén",
    "Providencia",
    "Pudahuel",
    "Quilicura",
    "Quinta Normal",
    "Recoleta",
    "Renca",
    "San Joaquín",
    "San Miguel",
    "San Ramón",
    "Vitacura",
    "Puente Alto",
    "Pirque",
    "San José de Maipo",
    "Colina",
    "Lampa",
    "Tiltil",
    "San Bernardo",
    "Buin",
    "Calera de Tango",
    "Paine",
    "Melipilla",
    "Alhué",
    "Curacaví",
    "María Pinto",
    "San Pedro",
    "Talagante",
    "El Monte",
    "Isla de Maipo",
    "Padre Hurtado",
    "Peñaflor"
  ],
  "Valparaíso": [
    "Valparaíso",
    "Casablanca",
    "Concón",
    "Juan Fernández",
    "Puchuncaví",
    "Quintero",
    "Viña del Mar",
    "Isla de Pascua",
    "Los Andes",
    "Calle Larga",
    "Rinconada",
    "San Esteban",
    "La Ligua",
    "Cabildo",
    "Papudo",
    "Petorca",
    "Zapallar",
    "Quillota",
    "La Calera",
    "Hijuelas",
    "La Cruz",
    "Nogales",
    "San Antonio",
    "Algarrobo",
    "Cartagena",
    "El Quisco",
    "El Tabo",
    "Santo Domingo",
    "San Felipe",
    "Catemu",
    "Llaillay",
    "Panquehue",
    "Putaendo",
    "Santa María",
    "Quilpué",
    "Limache",
    "Olmué",
    "Villa Alemana"
  ],
  "Biobío": [
    "Concepción",
    "Coronel",
    "Chiguayante",
    "Florida",
    "Hualqui",
    "Lota",
    "Penco",
    "San Pedro de la Paz",
    "Santa Juana",
    "Talcahuano",
    "Tomé",
    "Hualpén",
    "Lebu",
    "Arauco",
    "Cañete",
    "Contulmo",
    "Curanilahue",
    "Los Álamos",
    "Tirúa",
    "Los Ángeles",
    "Antuco",
    "Cabrero",
    "Laja",
    "Mulchén",
    "Nacimiento",
    "Negrete",
    "Quilaco",
    "Quilleco",
    "San Rosendo",
    "Santa Bárbara",
    "Tucapel",
    "Yumbel",
    "Alto Biobío"
  ],
  "Arica y Parinacota": [
    "Arica",
    "Camarones",
    "Putre",
    "General Lagos"
  ],
  "Tarapacá": [
    "Iquique",
    "Alto Hospicio",
    "Pozo Almonte",
    "Camiña",
    "Colchane",
    "Huara",
    "Pica"
  ],
  "Antofagasta": [
    "Antofagasta",
    "Mejillones",
    "Sierra Gorda",
    "Taltal",
    "Calama",
    "Ollagüe",
    "San Pedro de Atacama",
    "Tocopilla",
    "María Elena"
  ]
  // Se pueden agregar más regiones según sea necesario
};
const CALLES_COMUNES = [
  "Av. Apoquindo",
  "Av. Providencia",
  "Av. Las Condes",
  "Av. Vicuña Mackenna",
  "Av. Libertador Bernardo O'Higgins (Alameda)",
  "Av. Grecia",
  "Av. Irarrázaval",
  "Av. Santa Rosa",
  "Av. Gran Avenida",
  "Av. La Florida",
  "Av. Quilín",
  "Los Leones",
  "Tobalaba",
  "Av. Macul",
  "Av. Presidente Kennedy"
];

export { AutocompleteInput as A, COMUNAS_POR_REGION as C, REGIONES as R, CALLES_COMUNES as a };
