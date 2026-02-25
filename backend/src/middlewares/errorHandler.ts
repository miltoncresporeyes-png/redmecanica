
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/httpErrors.js';
import { logger } from '../lib/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    logger.error(`[${err.statusCode}] ${err.message}`);
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    const message = (err as any).issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    logger.warn(`[Validation Error] ${message}`);
    return res.status(400).json({ error: message });
  }

  logger.error({ err }, `[500] ${err.message}`);

  return res.status(500).json({ error: 'Error interno del servidor' });
};
