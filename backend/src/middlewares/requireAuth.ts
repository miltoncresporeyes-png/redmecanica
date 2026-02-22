
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
  };
}

export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return next(new UnauthorizedError('Acceso denegado: Token no proporcionado'));

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
    
    // We fetch user just to be sure, maybe cache this later
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
        return next(new UnauthorizedError('Usuario no encontrado'));
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
