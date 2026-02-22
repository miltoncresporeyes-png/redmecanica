
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { BadRequestError } from '../lib/httpErrors.js';

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: any, source: ValidationSource = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const parsed = schema.parse(data);
      // Replace original data with parsed/validated data (helpful for coercion)
      if (source === 'body') req.body = parsed;
      if (source === 'query') req.query = parsed;
      if (source === 'params') req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new BadRequestError(message));
      } else {
        next(error);
      }
    }
  };
};
