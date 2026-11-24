import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

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
  // Solo cuentan los intentos fallidos: un acceso correcto no debe acercar al usuario al bloqueo
  // (varias personas pueden compartir IP, p. ej. una oficina o una red movil).
  skipSuccessfulRequests: true,
  skip: (req) => {
    // No limitar la verificación de sesión, su renovación ni la config pública de Google
    if (req.method === 'OPTIONS') return true;
    if (['/me', '/refresh', '/logout', '/google/config'].includes(req.path)) return true;
    if (isDev && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1')) return true;
    return false;
  },
  message: {
    error: 'Demasiados intentos de acceso desde esta red. Por favor intenta de nuevo en una hora.',
    message: 'Demasiados intentos de acceso, por favor intente de nuevo en una hora.'
  }
});

// Registro y reenvío de códigos: aquí sí cuentan también los intentos exitosos (evita spam de cuentas/correos)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV !== 'production' ? 1000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiados registros desde esta red. Por favor intenta de nuevo en una hora.'
  }
});

// Recuperar contraseña: cuenta TODAS las solicitudes (incluso las que "funcionan") para que nadie pueda
// llenar el correo de una persona. Limita por IP+correo (3/hora) y por IP (10/hora).
const emailOf = (req: any) => String(req.body?.email ?? '').trim().toLowerCase().slice(0, 254);
export const forgotPasswordEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV !== 'production' ? 1000 : 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip || '')}|${emailOf(req)}`,
  message: { error: 'Ya enviamos instrucciones a ese correo. Revisa tu bandeja (y spam) o intenta de nuevo en una hora.' },
});
export const forgotPasswordIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV !== 'production' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes de recuperación desde esta red. Intenta de nuevo en una hora.' },
});

// Subida de documentos: pocas por hora (son archivos pesados y sensibles).
export const documentsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV !== 'production' ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Subiste demasiados documentos en poco tiempo. Intenta de nuevo en una hora.' },
});

// Eventos de contacto/visita: publicos y baratos, pero acotados para que nadie infle las metricas de un prestador.
export const providerEventsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV !== 'production' ? 5000 : 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes.' },
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

