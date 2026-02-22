// Structured Data Schemas for SEO
// https://schema.org/

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RedMecánica',
  url: 'https://redmecanica.cl',
  logo: 'https://redmecanica.cl/logo.png',
  description: 'Plataforma que conecta conductores con mecánicos certificados en Chile',
  sameAs: [
    'https://www.facebook.com/redmecanica',
    'https://www.instagram.com/redmecanica',
    'https://www.linkedin.com/company/redmecanica',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56-9-XXXX-XXXX',
    contactType: 'customer service',
    areaServed: 'CL',
    availableLanguage: ['Spanish'],
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutomotiveBusiness',
  name: 'RedMecánica',
  image: 'https://redmecanica.cl/og-image.jpg',
  url: 'https://redmecanica.cl',
  telephone: '+56-9-XXXX-XXXX',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CL',
    addressRegion: 'RM',
    addressLocality: 'Santiago',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -33.4489,
    longitude: -70.6693,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
};

export const serviceSchema = (serviceName: string, description: string, price: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: serviceName,
  provider: {
    '@type': 'Organization',
    name: 'RedMecánica',
    url: 'https://redmecanica.cl',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
  description: description,
  offers: {
    '@type': 'Offer',
    price: price,
    priceCurrency: 'CLP',
  },
});

export const faqPageSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RedMecánica',
  url: 'https://redmecanica.cl',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://redmecanica.cl/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
