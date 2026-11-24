/**
 * Configuracion por mercado (pais). Todo lo que hoy es "de Chile" (moneda, comision, vocabulario, documentos,
 * validacion tributaria) vive aqui y no repartido en el codigo. Para abrir otro pais se agrega una entrada
 * y su validador; el resto de la app lee esta configuracion.
 *
 * Mercado por defecto: DEFAULT_MARKET (env) o CL. Cuando exista la columna `country` en ServiceProvider,
 * se resolvera por prestador con getMarket(provider.country).
 */
export interface Market {
  country: string;                 // ISO 3166-1 alpha-2
  name: string;
  currency: string;                // ISO 4217
  locale: string;                  // BCP 47
  timezone: string;                // IANA
  phonePrefix: string;
  zoneLabel: { singular: string; plural: string }; // "comuna", "zona", "ciudad"...
  taxId: { label: string; validator: 'cl-rut' | 'generic' };
  documents: { identity: string; background: string };
  platformFeePercent: number;
  contactChannel: 'whatsapp' | 'phone' | 'sms';
}

export const MARKETS: Record<string, Market> = {
  CL: {
    country: 'CL',
    name: 'Chile',
    currency: 'CLP',
    locale: 'es-CL',
    timezone: 'America/Santiago',
    phonePrefix: '+56',
    zoneLabel: { singular: 'comuna', plural: 'comunas' },
    taxId: { label: 'RUT', validator: 'cl-rut' },
    documents: { identity: 'Cédula de identidad', background: 'Certificado de antecedentes' },
    platformFeePercent: 0, // RedMecanica no cobra comision por servicios ni contactos (solo planes de visibilidad)
    contactChannel: 'whatsapp',
  },
};

export const DEFAULT_MARKET_CODE = (process.env.DEFAULT_MARKET || 'CL').toUpperCase();

export const getMarket = (code?: string | null): Market =>
  MARKETS[(code || DEFAULT_MARKET_CODE).toUpperCase()] ?? MARKETS.CL;

/** Subconjunto que se entrega al navegador (sin nada interno). */
export const publicMarket = (m: Market) => ({
  country: m.country,
  currency: m.currency,
  locale: m.locale,
  timezone: m.timezone,
  phonePrefix: m.phonePrefix,
  zoneLabel: m.zoneLabel,
  taxIdLabel: m.taxId.label,
  documents: m.documents,
  platformFeePercent: m.platformFeePercent,
  contactChannel: m.contactChannel,
});
