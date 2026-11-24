import api from './http';

type ProviderEventType = 'VIEW' | 'WHATSAPP' | 'CALL';

// Registra una visita o un contacto a la vitrina de un prestador (metrica para su panel). No lleva datos personales.
// Una vez por sesion y tipo: recargar o volver a abrir el mismo boton no infla el numero.
export const trackProviderEvent = (providerId: string | undefined, type: ProviderEventType) => {
  if (!providerId) return;
  try {
    const key = `rm:ev:${providerId}:${type}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // sin sessionStorage: se registra igual
  }
  api.post(`/providers/${providerId}/events`, { type }).catch(() => { /* nunca debe molestar al cliente */ });
};
