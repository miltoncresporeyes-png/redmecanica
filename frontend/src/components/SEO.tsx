import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schema?: object | object[];
}

const DEFAULT_TITLE = 'RedMecánica — Marketplace automotriz de Chile | Prestadores en tu comuna gratis';
const DEFAULT_DESC =
  'Directorio gratuito de prestadores automotrices en Chile: mecánicos, talleres, grúas, vulcanizaciones, electricidad, hojalatería y más. Busca por comuna, compara vitrinas y contacta directo por WhatsApp. Sin cuenta, sin costo.';
const DEFAULT_KEYS =
  'marketplace automotriz Chile, buscar mecánico por comuna, talleres en mi comuna, grúas Chile, vulcanización, eléctrico automotriz, directorio automotriz gratuito';

const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYS,
  ogImage = 'https://redmecanica.cl/og-image.jpg',
  ogUrl,
  canonicalUrl,
  noIndex = false,
  schema,
}) => {
  const fullTitle = title.includes('RedMecánica') ? title : `${title} | RedMecánica`;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="RedMecánica" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_CL" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {(canonicalUrl || ogUrl) && <meta property="og:url" content={ogUrl || canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Idioma / región */}
      <meta httpEquiv="content-language" content="es-CL" />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
