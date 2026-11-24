import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET) throw new Error('ACCESS_TOKEN_SECRET not set');
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!REFRESH_TOKEN_SECRET) throw new Error('REFRESH_TOKEN_SECRET not set');

// Huella corta del hash de contraseña: el refresh token queda atado a ella, asi que cambiar o restablecer la
// contraseña invalida las sesiones abiertas (un refresh robado deja de servir).
export const passwordFingerprint = (passwordHash: string) =>
  crypto.createHash('sha256').update(passwordHash).digest('hex').slice(0, 16);

export const generateTokens = (userId: string, passwordHash?: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshPayload: { userId: string; pv?: string } = { userId };
  if (passwordHash) refreshPayload.pv = passwordFingerprint(passwordHash);
  const refreshToken = jwt.sign(refreshPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; pv?: string };
  } catch (error) {
    return null;
  }
};
