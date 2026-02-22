// Datos de comunas y regiones de Chile
export const REGIONES = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes'
];

export const COMUNAS_POR_REGION: { [key: string]: string[] } = {
  'Metropolitana': [
    'Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque',
    'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna',
    'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes',
    'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú',
    'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia',
    'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca',
    'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura',
    'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina',
    'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango',
    'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto',
    'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo',
    'Padre Hurtado', 'Peñaflor'
  ],
  'Valparaíso': [
    'Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví',
    'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga',
    'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo',
    'Petorca', 'Zapallar', 'Quillota', 'La Calera', 'Hijuelas',
    'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena',
    'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu',
    'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué',
    'Limache', 'Olmué', 'Villa Alemana'
  ],
  'Biobío': [
    'Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui',
    'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano',
    'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo',
    'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco',
    'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete',
    'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara',
    'Tucapel', 'Yumbel', 'Alto Biobío'
  ],
  'Arica y Parinacota': [
    'Arica', 'Camarones', 'Putre', 'General Lagos'
  ],
  'Tarapacá': [
    'Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane',
    'Huara', 'Pica'
  ],
  'Antofagasta': [
    'Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal',
    'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'
  ]
  // Se pueden agregar más regiones según sea necesario
};

export const MARCAS_VEHICULOS = [
  'Toyota', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
  'Suzuki', 'Honda', 'Ford', 'Volkswagen', 'Peugeot', 'Renault',
  'Citroën', 'Fiat', 'Jeep', 'Subaru', 'Mitsubishi', 'Ssangyong',
  'Mercedes-Benz', 'BMW', 'Audi', 'Volvo', 'Chery', 'JAC',
  'Great Wall', 'Haval', 'MG', 'BYD', 'Tesla'
];

export const TIPOS_PROBLEMA = [
  'El motor no enciende',
  'Motor se sobrecalienta',
  'Ruidos extraños en el motor',
  'Pérdida de potencia',
  'Batería descargada',
  'Luz de check engine encendida',
  'Problemas con los frenos',
  'Frenos hacen ruido',
  'Neumático pinchado',
  'Problemas de suspensión',
  'Aire acondicionado no enfría',
  'Problemas eléctricos',
  'Transmisión no cambia bien',
  'Embrague patina',
  'Vidrios eléctricos no funcionan',
  'Fugas de aceite',
  'Fugas de líquido refrigerante',
  'Escape ruidoso',
  'Luces no funcionan',
  'Dirección dura',
  'Vibración al frenar',
  'Vibración en el volante',
  'Consumo excesivo de combustible',
  'Humo del escape',
  'No pasa revisión técnica'
];

export const CALLES_COMUNES = [
  'Av. Apoquindo', 'Av. Providencia', 'Av. Las Condes', 'Av. Vicuña Mackenna',
  'Av. Libertador Bernardo O\'Higgins (Alameda)', 'Av. Grecia', 'Av. Irarrázaval',
  'Av. Santa Rosa', 'Av. Gran Avenida', 'Av. La Florida', 'Av. Quilín',
  'Los Leones', 'Tobalaba', 'Av. Macul', 'Av. Presidente Kennedy'
];
