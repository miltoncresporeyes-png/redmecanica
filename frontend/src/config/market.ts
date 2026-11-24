import { useSyncExternalStore } from 'react';

/** Configuracion del mercado (pais). Valores por defecto = Chile; el backend la entrega en el panel (config.market). */
export interface MarketConfig {
  country: string;
  currency: string;
  locale: string;
  timezone: string;
  phonePrefix: string;
  zoneLabel: { singular: string; plural: string };
  taxIdLabel: string;
  documents: { identity: string; background: string };
  platformFeePercent: number;
  contactChannel: 'whatsapp' | 'phone' | 'sms';
}

export const DEFAULT_MARKET: MarketConfig = {
  country: 'CL',
  currency: 'CLP',
  locale: 'es-CL',
  timezone: 'America/Santiago',
  phonePrefix: '+56',
  zoneLabel: { singular: 'comuna', plural: 'comunas' },
  taxIdLabel: 'RUT',
  documents: { identity: 'Cédula de identidad', background: 'Certificado de antecedentes' },
  platformFeePercent: 12,
  contactChannel: 'whatsapp',
};

let current: MarketConfig = DEFAULT_MARKET;
const listeners = new Set<() => void>();

export const getMarket = () => current;
export const setMarket = (m?: Partial<MarketConfig> | null) => {
  if (!m || m.country === current.country && m.currency === current.currency) return;
  current = { ...DEFAULT_MARKET, ...m };
  listeners.forEach((l) => l());
};
export const useMarket = (): MarketConfig =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; }, getMarket);
