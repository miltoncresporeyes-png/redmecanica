// Diccionarios estáticos para el SEO Programático de RedMecánica

export interface SEOServiceInfo {
  slug: string;
  name: string;
  pluralName: string;
  type: 'MECHANIC' | 'WORKSHOP' | 'TOWING' | 'INSURANCE';
  specialty?: string;
  icon: string;
  keywords: string[];
}

export interface SEOCommuneInfo {
  slug: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const SEO_SERVICES: Record<string, SEOServiceInfo> = {
  'mecanico': {
    slug: 'mecanico',
    name: 'Mecánico',
    pluralName: 'Mecánicos a Domicilio',
    type: 'MECHANIC',
    icon: '🔧',
    keywords: ['mecánico a domicilio', 'afinamiento', 'cambio de aceite', 'mecánico de autos']
  },
  'grua': {
    slug: 'grua',
    name: 'Grúa',
    pluralName: 'Servicios de Grúa',
    type: 'TOWING',
    icon: '🚛',
    keywords: ['grúa cerca de mi', 'servicio de grúas', 'remolque de autos', 'auxilio vehicular']
  },
  'taller': {
    slug: 'taller',
    name: 'Taller',
    pluralName: 'Talleres Mecánicos',
    type: 'WORKSHOP',
    icon: '🏭',
    keywords: ['taller mecánico', 'diagnóstico automotriz', 'desabolladura y pintura', 'mantención por kilometraje']
  },
  'electrico': {
    slug: 'electrico',
    name: 'Eléctrico',
    pluralName: 'Eléctricos Automotrices',
    type: 'MECHANIC',
    specialty: 'Electricidad / Electrónica',
    icon: '⚡',
    keywords: ['eléctrico automotriz', 'cambio de batería', 'escaner automotriz', 'corto circuito auto']
  }
};

export const SEO_COMMUNES: Record<string, SEOCommuneInfo> = {
  'santiago': {
    slug: 'santiago',
    name: 'Santiago',
    region: 'Metropolitana',
    latitude: -33.4489,
    longitude: -70.6693
  },
  'maipu': {
    slug: 'maipu',
    name: 'Maipú',
    region: 'Metropolitana',
    latitude: -33.5104,
    longitude: -70.7572
  },
  'las-condes': {
    slug: 'las-condes',
    name: 'Las Condes',
    region: 'Metropolitana',
    latitude: -33.4125,
    longitude: -70.5664
  },
  'providencia': {
    slug: 'providencia',
    name: 'Providencia',
    region: 'Metropolitana',
    latitude: -33.4272,
    longitude: -70.6128
  },
  'nunoa': {
    slug: 'nunoa',
    name: 'Ñuñoa',
    region: 'Metropolitana',
    latitude: -33.4569,
    longitude: -70.6032
  },
  'vitacura': {
    slug: 'vitacura',
    name: 'Vitacura',
    region: 'Metropolitana',
    latitude: -33.3989,
    longitude: -70.5684
  },
  'la-florida': {
    slug: 'la-florida',
    name: 'La Florida',
    region: 'Metropolitana',
    latitude: -33.5227,
    longitude: -70.5983
  },
  'puente-alto': {
    slug: 'puente-alto',
    name: 'Puente Alto',
    region: 'Metropolitana',
    latitude: -33.6120,
    longitude: -70.5750
  },
  'vina-del-mar': {
    slug: 'vina-del-mar',
    name: 'Viña del Mar',
    region: 'Valparaíso',
    latitude: -33.0245,
    longitude: -71.5518
  },
  'valparaiso': {
    slug: 'valparaiso',
    name: 'Valparaíso',
    region: 'Valparaíso',
    latitude: -33.0472,
    longitude: -71.6127
  },
  'concepcion': {
    slug: 'concepcion',
    name: 'Concepción',
    region: 'Biobío',
    latitude: -36.8201,
    longitude: -73.0444
  },
  'antofagasta': {
    slug: 'antofagasta',
    name: 'Antofagasta',
    region: 'Antofagasta',
    latitude: -23.6509,
    longitude: -70.3975
  },
  'temuco': {
    slug: 'temuco',
    name: 'Temuco',
    region: 'Araucanía',
    latitude: -38.7397,
    longitude: -72.5901
  },
  'la-serena': {
    slug: 'la-serena',
    name: 'La Serena',
    region: 'Coquimbo',
    latitude: -29.9027,
    longitude: -71.2520
  }
};
