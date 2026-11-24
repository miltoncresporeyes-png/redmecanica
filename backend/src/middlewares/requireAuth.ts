
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/index.js';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../lib/httpErrors.js';
import { config } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    status?: string;
  };
}

// Cada peticion autenticada consultaba el usuario en la base (un viaje de red de ~200 ms hacia Railway).
// Se guarda unos segundos: una suspension o baja se aplica en como maximo AUTH_CACHE_TTL_MS
// (y de inmediato en este proceso si se llama invalidateAuthCache).
const AUTH_CACHE_TTL_MS = 10_000;
const authCache = new Map<string, { user: { id: string; email: string; role: string; status?: string }; expires: number }>();
export const invalidateAuthCache = (userId?: string) => { if (userId) authCache.delete(userId); else authCache.clear(); };

export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return next(new UnauthorizedError('Acceso denegado: Token no proporcionado'));

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
    
    const hit = authCache.get(decoded.userId);
    let user: { id: string; email: string; role: string; status?: string } | null =
      hit && hit.expires > Date.now() ? hit.user : null;
    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, status: true }
      });
      if (user) {
        if (authCache.size > 5000) authCache.clear();
        authCache.set(decoded.userId, { user, expires: Date.now() + AUTH_CACHE_TTL_MS });
      }
    }

    if (!user) {
        return next(new UnauthorizedError('Usuario no encontrado'));
    }

    if ((user as any).status === 'SUSPENDED') {
        return next(new ForbiddenError('Tu cuenta ha sido suspendida por la administración.'));
    }

    if ((user as any).status === 'DELETED') {
        return next(new UnauthorizedError('Esta cuenta ha sido dada de baja.'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedError('Token expirado'));
    }
    return next(new UnauthorizedError('Token inválido'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
      if (!req.user) {
          return next(new UnauthorizedError('No autenticado'));
      }

      if (!roles.includes(req.user.role)) {
          return next(new ForbiddenError('Acceso denegado: No tienes permisos suficientes'));
      }

      next();
  };
};
