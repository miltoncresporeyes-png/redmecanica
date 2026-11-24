import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * Restablecimiento de contraseña sin tablas nuevas: un token firmado y de corta vida.
 *
 * El secreto de firma incluye el hash de contraseña actual del usuario. Por eso:
 *  - el token es de UN SOLO USO: al cambiar la contraseña, el hash cambia y los tokens anteriores dejan de validar;
 *  - un token no sirve para otra cuenta ni para otro fin (claim `purpose`).
 */
const RESET_TTL = '30m';
const PURPOSE = 'password-reset';

const baseSecret = () => process.env.PASSWORD_RESET_SECRET || config.jwt.accessSecret;
const secretFor = (passwordHash: string) => `${baseSecret()}::${passwordHash}`;

export const createResetToken = (user: { id: string; password: string }) =>
  jwt.sign({ sub: user.id, purpose: PURPOSE }, secretFor(user.password), { expiresIn: RESET_TTL, algorithm: 'HS256' });

/** Lee el `sub` sin confiar en el: solo para saber a que usuario buscar antes de verificar la firma. */
export const peekResetSubject = (token: string): string | null => {
  const decoded = jwt.decode(token) as { sub?: string; purpose?: string } | null;
  return decoded && decoded.purpose === PURPOSE && typeof decoded.sub === 'string' ? decoded.sub : null;
};

export const verifyResetToken = (token: string, user: { id: string; password: string }): boolean => {
  try {
    const payload = jwt.verify(token, secretFor(user.password), { algorithms: ['HS256'] }) as { sub?: string; purpose?: string };
    return payload.purpose === PURPOSE && payload.sub === user.id;
  } catch {
    return false;
  }
};

/** Base del enlace que se envia por correo. En desarrollo apunta a localhost para no mandar enlaces de produccion. */
export const appBaseUrl = () => {
  const explicit = (process.env.APP_URL || '').trim().replace(/\/$/, '');
  if (explicit) return explicit;
  if (process.env.NODE_ENV === 'production') {
    const first = (process.env.FRONTEND_URL || '').split(',').map((s) => s.trim()).filter(Boolean)[0];
    return (first || 'https://redmecanica.cl').replace(/\/$/, '');
  }
  return `http://localhost:${process.env.VITE_DEV_PORT || 5290}`;
};
