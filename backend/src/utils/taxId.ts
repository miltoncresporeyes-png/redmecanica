import { validarRUT } from './rutValidator.js';
import { getMarket } from '../config/markets.js';

/**
 * Validacion de documento tributario segun el mercado. Chile: RUT con modulo 11.
 * Otros paises: validacion generica (largo y caracteres) hasta agregar su validador especifico.
 */
export const validateTaxId = (value: string, country?: string | null): boolean => {
  const market = getMarket(country);
  if (market.taxId.validator === 'cl-rut') return validarRUT(value);
  return /^[A-Za-z0-9.\-\/ ]{5,20}$/.test(value.trim());
};
