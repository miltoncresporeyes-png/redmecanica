import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '../utils/security.js';

export const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.auth.windowMs,
  max: RATE_LIMITS.auth.max,
  message: {
    error: 'Demasiados intentos de login. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMITS.api.windowMs,
  max: RATE_LIMITS.api.max,
  message: {
    error: 'Demasiadas solicitudes. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const createLimiter = rateLimit({
  windowMs: RATE_LIMITS.create.windowMs,
  max: RATE_LIMITS.create.max,
  message: {
    error: 'Demasiadas solicitudes de creación. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const paymentLimiter = rateLimit({
  windowMs: RATE_LIMITS.payment.windowMs,
  max: RATE_LIMITS.payment.max,
  message: {
    error: 'Demasiadas solicitudes de pago. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
