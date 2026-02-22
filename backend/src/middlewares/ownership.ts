
import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth.js';
import { prisma } from '../prisma/index.js';
import { ForbiddenError, NotFoundError } from '../lib/httpErrors.js';

type Models = keyof typeof prisma;

export const requireOwnership = (modelName: Models, userIdField: string = 'userId') => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new ForbiddenError('No autenticado'));

    // Admin bypass
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return next();
    }

    const resourceId = req.params.id;
    if (!resourceId) return next(new Error('ID de recurso no proporcionado en params'));

    try {
      // @ts-ignore - dynamic model access
      const resource = await prisma[modelName].findUnique({
        where: { id: resourceId },
        select: { [userIdField]: true }
      });

      if (!resource) {
        return next(new NotFoundError('Recurso no encontrado'));
      }

      if (resource[userIdField] !== user.id) {
        return next(new ForbiddenError('No tienes permiso para acceder a este recurso'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
