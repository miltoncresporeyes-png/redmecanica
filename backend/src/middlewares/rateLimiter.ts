import rateLimit from 'express-rate-limit';

// Permitir tráfico local en desarrollo sin bloquearse por reloads y hot-reload
const isDev = process.env.NODE_ENV !== 'production';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 5000 : 300, // En desarrollo prácticamente ilimitado para recargas / HMR
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.method === 'OPTIONS' || (isDev && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')),
  message: {
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.'
  }
});

export const authLimiter = rateLimit({
  windowMs: isDev ? 60 * 1000 : 60 * 60 * 1000,
  max: isDev ? 100 : 20, // En dev permite pruebas fluidas sin bloquear la IP local
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No limitar la verificación de sesión en cada reload (/auth/me o OPTIONS)
    if (req.method === 'OPTIONS' || req.path === '/me') return true;
    if (isDev && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')) return true;
    return false;
  },
  message: {
    message: 'Demasiados intentos de acceso, por favor intente de nuevo en una hora.'
  }
});

// Límite estricto para registro de preventa / launch leads (máximo 5 por IP cada 15 minutos)
export const launchLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Has alcanzado el límite de intentos para registrarte. Por favor espera unos minutos antes de volver a intentar.'
  }
});

// Límite para envío de mensajes de contacto general (máximo 5 por IP cada 15 minutos)
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Has enviado demasiados mensajes recientemente. Por favor espera unos minutos.'
  }
});

