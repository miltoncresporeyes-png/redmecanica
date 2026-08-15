// Security headers middleware
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

export const securityHeadersMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  // Prevent framing of the app
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // No referrer
  res.setHeader('Referrer-Policy', 'no-referrer');
  // Disallow DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
};