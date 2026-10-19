import dns from 'node:dns/promises';
import { logger } from '../lib/logger.js';

// Lista de dominios desechables y temporales comunes (disposable emails)
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'throwawaymail.com',
  'dispostable.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'trashmail.com',
  'burnermail.io',
  'mohmal.com',
  'crazymailing.com',
  'temp-mail.org',
  'fakeinbox.com',
  'generator.email',
  'mytemp.email',
  'emailondeck.com',
  'tempinbox.com',
  'maildrop.cc',
  'inboxkitten.com'
]);

// Cache en memoria para resultados de resolución MX (TTL: 1 hora)
const mxCache = new Map<string, { valid: boolean; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Valida un correo electrónico verificando formato, descarte de dominios temporales
 * y existencia de servidores MX en los registros DNS.
 */
export async function validateEmailDeliverability(email: string): Promise<EmailValidationResult> {
  const normalized = email.trim().toLowerCase();

  // 1. Verificación básica de sintaxis
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(normalized)) {
    return { isValid: false, reason: 'Formato de correo inválido.' };
  }

  const parts = normalized.split('@');
  if (parts.length !== 2) {
    return { isValid: false, reason: 'Formato de correo inválido.' };
  }

  const [localPart, domain] = parts;

  // Evitar partes locales anómalas
  if (localPart.length > 64 || domain.length > 255) {
    return { isValid: false, reason: 'Longitud de correo excede límites estándar.' };
  }

  // 2. Comprobar dominios de prueba RFC 2606
  if (domain.endsWith('.test') || domain.endsWith('.example') || domain.endsWith('.invalid') || domain.endsWith('.localhost')) {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      return { isValid: true };
    }
    return { isValid: false, reason: 'Dominio de prueba no permitido en producción.' };
  }

  // 3. Comprobar si el dominio es desechable / temporal
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, reason: 'No se aceptan correos temporales o desechables.' };
  }

  // 4. Verificación de Caché de resolución MX
  const now = Date.now();
  const cached = mxCache.get(domain);
  if (cached && cached.expiresAt > now) {
    if (!cached.valid) {
      return { isValid: false, reason: 'El dominio del correo no puede recibir mensajes (sin servidores MX).' };
    }
    return { isValid: true };
  }

  // 5. Verificación DNS en tiempo real de registros MX
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      mxCache.set(domain, { valid: false, expiresAt: now + CACHE_TTL_MS });
      return { isValid: false, reason: 'El dominio no cuenta con servidores de correo habilitados (sin registros MX).' };
    }

    mxCache.set(domain, { valid: true, expiresAt: now + CACHE_TTL_MS });
    return { isValid: true };
  } catch (dnsError: any) {
    // Si no tiene registros MX, dns lanza ENODATA o ENOTFOUND
    if (dnsError.code === 'ENOTFOUND' || dnsError.code === 'ENODATA') {
      mxCache.set(domain, { valid: false, expiresAt: now + CACHE_TTL_MS });
      logger.warn({ domain, code: dnsError.code }, 'Dominio sin registros MX válidos');
      return { isValid: false, reason: 'El dominio ingresado no existe o no tiene servicio de correo configurado.' };
    }

    // En caso de timeout transitorio de DNS de la máquina host, permitimos pasar para no bloquear usuarios válidos
    logger.warn({ domain, error: dnsError.message }, 'Timeout o fallo transitorio consultando DNS MX; admitiendo preventivamente');
    return { isValid: true };
  }
}
