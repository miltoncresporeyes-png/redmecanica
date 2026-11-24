// URL base de la API. En produccion el sitio es estatico (no reenvia /api), por lo que la API se llama por su URL absoluta.
// Orden: VITE_API_URL (si el build la tiene) -> URL de produccion segun el dominio -> '/api' (desarrollo con proxy de Vite).
// Cuando exista el subdominio propio, cambiar PRODUCTION_API a https://api.redmecanica.cl/api (ver docs/api-subdominio.md).
const PRODUCTION_API = 'https://backend-production-f294e.up.railway.app/api';

export const resolveApiBase = (): string => {
  const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (/^https?:\/\//.test(envApiUrl)) return envApiUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined' && /(^|\.)redmecanica\.cl$/.test(window.location.hostname)) return PRODUCTION_API;
  return (envApiUrl || '/api').replace(/\/$/, '');
};
