import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public');
const SITE = 'https://redmecanica.cl';
const NOW = new Date().toISOString().split('T')[0];

// ── Data (sync with communesData.ts) ──────────────────────────
const SERVICES = [
  { slug: 'mecanico', plural: 'mecanicos', category: 'mecanicos' },
  { slug: 'grua',     plural: 'gruas',     category: 'gruas' },
  { slug: 'taller',   plural: 'talleres',  category: 'talleres' },
  { slug: 'electrico',plural: 'electricos',category: 'electricos' },
];

const CITIES = [
  'santiago', 'maipu', 'las-condes', 'providencia', 'nunoa', 'vitacura',
  'la-florida', 'puente-alto', 'vina-del-mar', 'valparaiso',
  'concepcion', 'antofagasta', 'temuco', 'la-serena',
];

// ── Blog posts with image URLs (sync with blogArticles.ts) ─────
const BLOG_POSTS = [
  { slug: 'precio-cambio-pastillas-freno-santiago',         img: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b' },
  { slug: 'taller-mecanico-vs-mecanico-a-domicilio',       img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e' },
  { slug: 'cinco-fallas-electricas-comunes-vehiculo',      img: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc' },
  { slug: 'guia-precios-servicios-grua-asistencia-chile',  img: 'https://images.unsplash.com/photo-1563720223185-11003d516935' },
  { slug: 'por-que-mi-auto-no-enciende-y-hace-clic',       img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3' },
  { slug: 'guia-mantenimiento-preventivo-kilometraje-chile', img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc' },
  { slug: 'como-revisar-el-aceite-de-tu-auto-paso-a-paso', img: 'https://images.unsplash.com/photo-1612437213821-6b0236e741e5' },
  { slug: 'por-que-vibra-mi-auto-al-conducir',             img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7' },
  { slug: 'por-que-se-sobrecalienta-mi-motor',             img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537' },
  { slug: 'luces-tablero-significado-guia-completa',       img: 'https://images.unsplash.com/photo-1628289052055-1efdf1c51b99' },
  { slug: 'precio-cambio-aceite-filtro-chile',             img: 'https://images.unsplash.com/photo-1617732614948-9a1e5a1cf77e' },
  { slug: 'precio-cambio-bateria-auto-chile',              img: 'https://images.unsplash.com/photo-1603800133262-b7fb608af3d5' },
  { slug: 'cuanto-cuesta-escaner-automotriz-chile',        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e' },
  { slug: 'precio-cambio-embrague-chile',                  img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e' },
  { slug: 'costo-revision-tecnica-chile-2026',             img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e' },
  { slug: 'concesionario-vs-taller-independiente-chile',  img: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f' },
  { slug: 'repuesto-original-vs-alternativo-chile',        img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc' },
  { slug: 'mecanico-especialista-vs-general-chile',        img: 'https://images.unsplash.com/photo-1617529497471-9218630199c0' },
];

// ── Static pages ──────────────────────────────────────────────
const STATIC_PAGES = [
  { path: '',                          priority: 1.0, freq: 'daily' },
  { path: 'search',                    priority: 0.9, freq: 'daily' },
  { path: 'solicitar',                 priority: 0.9, freq: 'weekly' },
  { path: 'servicio',                  priority: 0.9, freq: 'weekly' },
  { path: 'unete',                     priority: 0.9, freq: 'weekly' },
  { path: 'blog',                      priority: 0.8, freq: 'daily' },
  { path: 'pricing',                   priority: 0.8, freq: 'monthly' },
  { path: 'how-it-works',             priority: 0.7, freq: 'monthly' },
  { path: 'about',                     priority: 0.7, freq: 'monthly' },
  { path: 'contact',                   priority: 0.7, freq: 'monthly' },
  { path: 'faq',                       priority: 0.8, freq: 'weekly' },
  { path: 'help',                      priority: 0.6, freq: 'monthly' },
  { path: 'stories',                   priority: 0.6, freq: 'monthly' },
  { path: 'benefits',                  priority: 0.7, freq: 'monthly' },
  { path: 'terms',                     priority: 0.3, freq: 'yearly' },
  { path: 'privacy',                   priority: 0.3, freq: 'yearly' },
];

// ── Helpers ────────────────────────────────────────────────────
function url(loc, freq, priority) {
  return `  <url>\n    <loc>${SITE}/${loc}</loc>\n    <lastmod>${NOW}</lastmod>\n    <changefreq>${freq || 'monthly'}</changefreq>\n    <priority>${priority || 0.5}</priority>\n  </url>`;
}

function urlSet(items) {
  return items.map(i => url(i.path, i.freq, i.priority)).join('\n');
}

function urlWithImage(loc, imgUrl, freq, priority) {
  return [
    `  <url>`,
    `    <loc>${SITE}/${loc}</loc>`,
    `    <lastmod>${NOW}</lastmod>`,
    `    <changefreq>${freq || 'monthly'}</changefreq>`,
    `    <priority>${priority || 0.5}</priority>`,
    `    <image:image>`,
    `      <image:loc>${imgUrl}</image:loc>`,
    `    </image:image>`,
    `  </url>`,
  ].join('\n');
}

// ── Build main sitemap ─────────────────────────────────────────
const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">');

// Static pages
lines.push(urlSet(STATIC_PAGES));

// Blog articles (with images)
BLOG_POSTS.forEach(post => {
  lines.push(urlWithImage(`blog/${post.slug}`, post.img, 'weekly', 0.7));
});

// Programmatic SEO: service-en-commune (old format)
SERVICES.forEach(svc => {
  CITIES.forEach(city => {
    lines.push(url(`${svc.slug}-en-${city}`, 'weekly', 0.8));
  });
});

// Directory pages: /service/city (new format)
SERVICES.forEach(svc => {
  CITIES.forEach(city => {
    lines.push(url(`${svc.category}/${city}`, 'weekly', 0.8));
  });
});

lines.push('</urlset>');

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'sitemap.xml'), lines.join('\n'), 'utf-8');

// ── Build image sitemap (for Google Images) ────────────────────
const imgLines = [];
imgLines.push('<?xml version="1.0" encoding="UTF-8"?>');
imgLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">');
BLOG_POSTS.forEach(post => {
  imgLines.push(urlWithImage(`blog/${post.slug}`, post.img, 'weekly', 0.7));
});
imgLines.push('</urlset>');
writeFileSync(join(OUT_DIR, 'image-sitemap.xml'), imgLines.join('\n'), 'utf-8');

// ── Stats ──────────────────────────────────────────────────────
const total = (lines.join('').match(/<loc>/g) || []).length;
const blogCount = BLOG_POSTS.length;
const seoCount = SERVICES.length * CITIES.length;
console.log(`✓ Sitemaps generated:
  Main sitemap: ${total} URLs → public/sitemap.xml
  Image sitemap: ${blogCount} URLs → public/image-sitemap.xml
  Breakdown: ${STATIC_PAGES.length} static + ${blogCount} blog + ${seoCount} SEO old + ${seoCount} SEO new`);
