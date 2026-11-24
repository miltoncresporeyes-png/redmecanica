
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

  // Errores del analizador de cuerpos (body-parser): peticion demasiado grande o JSON roto. Son culpa de quien envia,
  // no del servidor: antes salian como 500 genericos y la persona no tenia ninguna pista de que pasaba.
  const e = err as any;
  if (e?.type === 'entity.too.large' || e?.status === 413) {
    logger.warn(`[413] Cuerpo demasiado grande (${e.length ?? '?'} bytes, limite ${e.limit ?? '?'})`);
    return res.status(413).json({ error: 'El archivo o los datos enviados son demasiado grandes. Reduce el tamaño e inténtalo de nuevo.' });
  }
  if (e?.type === 'entity.parse.failed' || (e?.status === 400 && e?.expose)) {
    return res.status(400).json({ error: 'No pudimos leer los datos enviados.' });
  }

  logger.error({ err }, `[500] ${err.message}`);

  return res.status(500).json({ error: 'Error interno del servidor' });
};
