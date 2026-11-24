import { getMarket } from './markets.js';

/**
 * La comision depende del mercado (config/markets.ts). Se mantiene esta constante para el codigo de pagos actual,
 * que opera solo en el mercado por defecto.
 */
export const PLATFORM_FEE_PERCENT = getMarket().platformFeePercent;
