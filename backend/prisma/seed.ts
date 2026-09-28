import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

const pool = new Pool({ connectionString, max: 5 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Seed 100% real y no destructivo.
 *
 * - NUNCA borra datos (sin deleteMany): es seguro ejecutarlo en producción
 *   para poblar la base de prestadores y usuarios reales.
 * - Solo asegura datos de referencia mediante upsert: categorías de
 *   servicio, zonas (regiones/comunas) y servicios maestros.
 * - NO crea usuarios, prestadores, vehículos, trabajos ni reseñas de ejemplo.
 *   Esos registros nacen únicamente del flujo real: registro, onboarding y uso.
 */
async function main() {
  console.log('🌱 Seed de referencia (no destructivo)...');

  const categories = [
    { slug: 'mecanica-general', name: 'Mecánica General', description: 'Servicios de mecánica básica y general', icon: 'wrench', type: 'MECHANIC', sortOrder: 1 },
    { slug: 'reparacion-motor', name: 'Reparación de Motor', description: 'Diagnóstico y reparación de motores', icon: 'engine', type: 'MECHANIC', sortOrder: 2 },
    { slug: 'frenos-suspension', name: 'Frenos y Suspensión', description: 'Sistema de frenos y suspensión', icon: 'car', type: 'MECHANIC', sortOrder: 3 },
    { slug: 'sistema-electrico', name: 'Sistema Eléctrico', description: 'Reparaciones eléctricas y electrónicas', icon: 'flash', type: 'MECHANIC', sortOrder: 4 },
    { slug: 'servicio-gruas', name: 'Servicio de Grúas', description: 'Rescate y traslado de vehículos', icon: 'truck', type: 'TOWING', sortOrder: 5 },
    { slug: 'emergencias', name: 'Emergencias 24/7', description: 'Asistencia de emergencia vehicular', icon: 'alert', type: 'EMERGENCY', sortOrder: 6 },
    { slug: 'seguros', name: 'Seguros', description: 'Servicios de seguros vehiculares', icon: 'shield', type: 'INSURANCE', sortOrder: 7 },
  ];

  for (const c of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, icon: c.icon, type: c.type, sortOrder: c.sortOrder },
      create: c,
    });
  }
  console.log('✅ Categorías de referencia aseguradas:', categories.length);

  const regions = [
    { name: 'Metropolitana de Santiago', slug: 'metropolitana', lat: -33.4489, lng: -70.6693 },
    { name: 'Valparaíso', slug: 'valparaiso', lat: -33.0472, lng: -71.6127 },
    { name: 'Biobío', slug: 'biobio', lat: -37.4667, lng: -72.35 },
    { name: 'Maule', slug: 'maule', lat: -35.5167, lng: -71.6667 },
    { name: 'Los Lagos', slug: 'los-lagos', lat: -41.8, lng: -73.0 },
    { name: 'Antofagasta', slug: 'antofagasta', lat: -23.65, lng: -70.4 },
    { name: 'Coquimbo', slug: 'coquimbo', lat: -29.9533, lng: -71.0 },
  ];

  const zoneIds: Record<string, string> = {};
  for (const r of regions) {
    const zone = await prisma.zone.upsert({
      where: { slug: r.slug },
      update: { name: r.name, latitude: r.lat, longitude: r.lng },
      create: { name: r.name, slug: r.slug, type: 'REGION', latitude: r.lat, longitude: r.lng, radiusKm: 50 },
    });
    zoneIds[r.slug] = zone.id;
  }

  const communes = [
    { name: 'Santiago', slug: 'santiago', parent: 'metropolitana', lat: -33.4489, lng: -70.6693 },
    { name: 'Las Condes', slug: 'las-condes', parent: 'metropolitana', lat: -33.412, lng: -70.566 },
    { name: 'Providencia', slug: 'providencia', parent: 'metropolitana', lat: -33.431, lng: -70.609 },
    { name: 'Maipú', slug: 'maipu', parent: 'metropolitana', lat: -33.51, lng: -70.757 },
    { name: 'Puente Alto', slug: 'puente-alto', parent: 'metropolitana', lat: -33.612, lng: -70.575 },
    { name: 'Valparaíso', slug: 'valparaiso-ciudad', parent: 'valparaiso', lat: -33.0472, lng: -71.6127 },
    { name: 'Viña del Mar', slug: 'vina-del-mar', parent: 'valparaiso', lat: -33.0245, lng: -71.5518 },
  ];

  for (const c of communes) {
    await prisma.zone.upsert({
      where: { slug: c.slug },
      update: { name: c.name, latitude: c.lat, longitude: c.lng },
      create: {
        name: c.name, slug: c.slug, type: 'COMMUNE',
        parentId: zoneIds[c.parent], latitude: c.lat, longitude: c.lng, radiusKm: 15,
      },
    });
  }
  console.log('✅ Zonas de referencia aseguradas');

  const motorCat = await prisma.serviceCategory.findUnique({ where: { slug: 'reparacion-motor' } });
  const frenosCat = await prisma.serviceCategory.findUnique({ where: { slug: 'frenos-suspension' } });
  const gruaCat = await prisma.serviceCategory.findUnique({ where: { slug: 'servicio-gruas' } });

  const masterServices = [
    { id: 'motor', name: 'Reparación de Motor', description: 'Diagnóstico y reparación completa de motor.', price: 450000, categoryId: motorCat?.id },
    { id: 'frenos', name: 'Revisión y Cambio de Frenos', description: 'Reemplazo de pastillas y rectificado de discos.', price: 45000, categoryId: frenosCat?.id },
    { id: 'grua', name: 'Servicio de Grúa Emergencia', description: 'Traslado de vehículo las 24 horas.', price: 60000, categoryId: gruaCat?.id },
  ];

  for (const s of masterServices) {
    if (!s.categoryId) continue;
    await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, description: s.description, price: s.price, categoryId: s.categoryId },
      create: { id: s.id, name: s.name, description: s.description, price: s.price, categoryId: s.categoryId },
    });
  }
  console.log('✅ Servicios maestros asegurados');

  console.log('✅ Seed completo: solo datos de referencia. Sin usuarios ni prestadores de ejemplo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
