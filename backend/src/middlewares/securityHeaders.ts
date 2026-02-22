import { randomBytes } from 'crypto';

export const requestIdMiddleware = (req: any, res: any, next: any) => {
  const id = randomBytes(8).toString('hex');
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
};

export const securityHeadersMiddleware = (_req: any, res: any, next: any) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

export const compressionMiddleware = (req: any, _res: any, next: any) => {
  req.acceptsEncodings = ['gzip', 'deflate', 'identity'];
  next();
};
