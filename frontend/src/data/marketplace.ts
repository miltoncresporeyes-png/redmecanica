// Catálogo central del marketplace RedMecánica
// Prestadores automotrices que pueden promocionar sus servicios y
// conductores que buscan gratis por comuna.

export interface MarketplaceCategory {
  slug: string;
  label: string;
  plural: string;
  icon: string;
  // Tipo backend más cercano (para /geo/search)
  backendType?: 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
  // Palabras que ayudan al filtro local por especialidad / bio
  keywords: string[];
  shortDesc: string;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    slug: 'mecanico',
    label: 'Mecánico a domicilio',
    plural: 'Mecánicos a domicilio',
    icon: '🔧',
    backendType: 'MECHANIC',
    keywords: ['mecanica general', 'mecanico', 'afinamiento', 'cambio de aceite', 'frenos', 'motor'],
    shortDesc: 'Mantención y reparación donde estés',
  },
  {
    slug: 'taller',
    label: 'Taller mecánico',
    plural: 'Talleres mecánicos',
    icon: '🏭',
    backendType: 'WORKSHOP',
    keywords: ['taller', 'diagnostico', 'mantencion', 'reparacion'],
    shortDesc: 'Talleres verificados por comuna',
  },
  {
    slug: 'grua',
    label: 'Grúa y auxilio',
    plural: 'Grúas y auxilio vial',
    icon: '🚛',
    backendType: 'TOWING',
    keywords: ['grua', 'auxilio', 'remolque', 'rescate', 'bateria', 'pinchazo'],
    shortDesc: 'Rescate 24/7 en tu comuna',
  },
  {
    slug: 'vulcanizacion',
    label: 'Vulcanización',
    plural: 'Vulcanizaciones',
    icon: '🛞',
    backendType: 'WORKSHOP',
    keywords: ['vulcanizacion', 'neumatico', 'pinchazo', 'balanceo', 'alineacion', 'llanta'],
    shortDesc: 'Neumáticos, pinchazos y balanceo',
  },
  {
    slug: 'electrico',
    label: 'Electricidad automotriz',
    plural: 'Eléctricos automotrices',
    icon: '⚡',
    backendType: 'MECHANIC',
    keywords: ['electricidad', 'electronica', 'bateria', 'alternador', 'escaner', 'obd2', 'check engine'],
    shortDesc: 'Diagnóstico electrónico y baterías',
  },
  {
    slug: 'hojalateria',
    label: 'Hojalatería y pintura',
    plural: 'Hojalatería y pintura',
    icon: '🎨',
    backendType: 'WORKSHOP',
    keywords: ['hojalateria', 'pintura', 'desabolladura', 'choque', 'parachoques'],
    shortDesc: 'Choques, pintura y desabolladura',
  },
  {
    slug: 'aire-acondicionado',
    label: 'Aire acondicionado',
    plural: 'Climatización vehicular',
    icon: '❄️',
    backendType: 'WORKSHOP',
    keywords: ['aire acondicionado', 'climatizacion', 'calefaccion', 'recarga'],
    shortDesc: 'Clima, calefacción y recarga',
  },
  {
    slug: 'detailing',
    label: 'Detailing y lavado',
    plural: 'Detailing y lavado',
    icon: '✨',
    backendType: 'WORKSHOP',
    keywords: ['detailing', 'lavado', 'pulido', 'limpieza', 'estetica'],
    shortDesc: 'Estética y cuidado exterior',
  },
  {
    slug: 'repuestos',
    label: 'Repuestos y accesorios',
    plural: 'Repuestos y accesorios',
    icon: '⚙️',
    backendType: 'WORKSHOP',
    keywords: ['repuesto', 'accesorio', 'filtro', 'pastilla', 'aceite', 'bateria'],
    shortDesc: 'Repuestos originales y alternativos',
  },
  {
    slug: 'revision',
    label: 'Revisión y diagnóstico',
    plural: 'Revisión y diagnóstico',
    icon: '📊',
    backendType: 'MECHANIC',
    keywords: ['revision tecnica', 'diagnostico', 'inspeccion', 'pre-compra', 'scanner'],
    shortDesc: 'Inspección pre-compra y escáner',
  },
];

export const getCategoryBySlug = (slug?: string | null): MarketplaceCategory | undefined =>
  MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);

// Comunas populares para acceso rápido en el home (todas existen en autocompleteData)
export const POPULAR_COMUNAS = [
  'Santiago',
  'Providencia',
  'Las Condes',
  'Ñuñoa',
  'Maipú',
  'La Florida',
  'Puente Alto',
  'Viña del Mar',
  'Valparaíso',
  'Concepción',
  'Temuco',
  'Antofagasta',
];

// Normaliza texto para comparar comuna / query sin tildes ni mayúsculas
export const normalizeText = (value?: string | null): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
