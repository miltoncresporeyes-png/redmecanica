// Cache local para que los paneles abran al instante con lo ultimo que se vio y se actualicen en segundo plano
// ("stale-while-revalidate"). Se guarda por usuario y se borra al cerrar sesion.
const PREFIX = 'rm:v1:';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // pasado un dia, no se usa

export const readCache = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; v: T };
    if (!parsed || Date.now() - parsed.t > MAX_AGE_MS) return null;
    return parsed.v;
  } catch {
    return null;
  }
};

export const writeCache = (key: string, value: unknown) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // almacenamiento lleno o bloqueado: la app funciona igual, solo sin cache
  }
};

export const clearAllCaches = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignorar
  }
};
