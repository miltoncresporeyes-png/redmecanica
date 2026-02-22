import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth.js'; // Note .js extension for ESM if configured
import { prisma } from '../db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });

  const decoded = verifyAccessToken(token);

  if (!decoded) return res.status(403).json({ error: 'Token inválido o expirado' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true } // Fetch minimal user info
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes' });
    }

    next();
  };
};
