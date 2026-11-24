import { getMarket } from '../config/market';

// Formato de dinero en un solo lugar: moneda y locale vienen de la configuracion del mercado (config/market.ts).
export const formatMoney = (amount: number | null | undefined, currency?: string, locale?: string) => {
  const m = getMarket();
  const cur = currency || m.currency;
  return new Intl.NumberFormat(locale || m.locale, { style: 'currency', currency: cur, maximumFractionDigits: cur === 'CLP' ? 0 : 2 }).format(Number(amount) || 0);
};
