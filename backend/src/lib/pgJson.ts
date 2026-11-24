// Postgres devuelve los "timestamp" sin zona horaria y sin "Z" (p. ej. 2026-11-24T00:27:08.809). Prisma guarda esas
// fechas en UTC, pero el navegador interpretaria el texto sin "Z" como hora LOCAL y mostraria fechas corridas.
// Esta funcion recorre el JSON de una consulta SQL cruda y marca esas fechas como UTC.
const ISO_NO_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;

export const withUtc = (v: any): any => {
  if (typeof v === 'string') return ISO_NO_TZ.test(v) ? `${v}Z` : v;
  if (Array.isArray(v)) return v.map(withUtc);
  if (v && typeof v === 'object') {
    const out: any = {};
    for (const k of Object.keys(v)) out[k] = withUtc(v[k]);
    return out;
  }
  return v;
};
