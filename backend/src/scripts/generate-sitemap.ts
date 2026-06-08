import { writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Inicializar conexión a base de datos manual para evitar depender de imports relativos complejos
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
const forceInsecureTls = process.env.PG_SSL_REJECT_UNAUTHORIZED === 'false';
const requiresSsl = /sslmode=(require|verify-ca|verify-full)/i.test(connectionString);

const pool = new pg.Pool({
  connectionString,
  ...(requiresSsl || forceInsecureTls
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Definición estática de servicios y comunas para la generación programática
const SERVICES = ['mecanico', 'grua', 'taller', 'electrico'];
const COMMUNES = [
  'santiago', 'maipu', 'las-condes', 'providencia', 'nunoa', 
  'vitacura', 'la-florida', 'puente-alto', 'vina-del-mar', 
  'valparaiso', 'concepcion', 'antofagasta', 'temuco', 'la-serena'
];

// Slugs de artículos del blog
const BLOG_SLUGS = [
  'precio-cambio-pastillas-freno-santiago',
  'taller-mecanico-vs-mecanico-a-domicilio',
  'cinco-fallas-electricas-comunes-vehiculo',
  'guia-precios-servicios-grua-asistencia-chile'
];

async function generateSitemap() {
  console.log('🤖 Starting dynamic sitemap.xml generation...');
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Añadir páginas estáticas clave
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'search', priority: '0.9', changefreq: 'daily' },
    { path: 'solicitar', priority: '0.9', changefreq: 'weekly' },
    { path: 'servicio', priority: '0.9', changefreq: 'weekly' },
    { path: 'unete', priority: '0.9', changefreq: 'weekly' },
    { path: 'blog', priority: '0.8', changefreq: 'daily' },
    { path: 'pricing', priority: '0.8', changefreq: 'monthly' },
    { path: 'how-it-works', priority: '0.7', changefreq: 'monthly' },
    { path: 'about', priority: '0.7', changefreq: 'monthly' },
    { path: 'contact', priority: '0.7', changefreq: 'monthly' },
    { path: 'faq', priority: '0.7', changefreq: 'weekly' },
    { path: 'help', priority: '0.6', changefreq: 'monthly' },
    { path: 'stories', priority: '0.6', changefreq: 'monthly' },
    { path: 'benefits', priority: '0.7', changefreq: 'monthly' },
    { path: 'terms', priority: '0.3', changefreq: 'yearly' },
    { path: 'privacy', priority: '0.3', changefreq: 'yearly' }
  ];

  console.log('📝 Injecting', staticPages.length, 'static routes...');
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>https://redmecanica.cl/${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // 2. Añadir combinaciones SEO programáticas (/{servicio}-en-{ciudad})
  console.log('🔗 Generating programmatic combinations...');
  let programmaticCount = 0;
  for (const service of SERVICES) {
    for (const commune of COMMUNES) {
      xml += '  <url>\n';
      xml += `    <loc>https://redmecanica.cl/${service}-en-${commune}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
      programmaticCount++;
    }
  }
  console.log('✅ Generated', programmaticCount, 'programmatic SEO links');

  // 3. Añadir artículos del blog
  console.log('✍️ Injecting blog articles...');
  for (const slug of BLOG_SLUGS) {
    xml += '  <url>\n';
    xml += `    <loc>https://redmecanica.cl/blog/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += '  </url>\n';
  }

  // 4. Consultar base de datos para obtener prestadores activos
  try {
    console.log('🗄️ Querying database for active provider profiles...');
    const activeProviders = await prisma.serviceProvider.findMany({
      where: {
        status: 'ACTIVE',
        subscription: {
          status: 'ACTIVE'
        }
      },
      select: {
        id: true,
        updatedAt: true
      }
    });

    console.log('👤 Injecting', activeProviders.length, 'active mechanic profile links...');
    for (const provider of activeProviders) {
      const lastModDate = provider.updatedAt.toISOString().split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>https://redmecanica.cl/proveedor/${provider.id}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    }
  } catch (dbError) {
    console.error('⚠️ Failed to fetch providers from database. Sitemap will proceed without profiles.', dbError);
  }

  xml += '</urlset>\n';

  // Escribir el archivo en public del frontend
  const sitemapPath = join(__dirname, '../../../frontend/public/sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf8');

  console.log(`🎉 sitemap.xml generated successfully at: ${sitemapPath}`);
  
  // Cerrar conexiones
  await prisma.$disconnect();
  await pool.end();
}

generateSitemap().catch(async (e) => {
  console.error('❌ Sitemap generation crashed:', e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});
