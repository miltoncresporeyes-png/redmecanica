import { prisma } from '../db.js';

interface SecurityLog {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

export const logSecurityEvent = async (log: SecurityLog) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        newValue: log.details
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGIN_RATE_LIMIT: 'LOGIN_RATE_LIMIT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  USER_CREATE: 'USER_CREATE',
  USER_DELETE: 'USER_DELETE',
  PROVIDER_APPROVE: 'PROVIDER_APPROVE',
  PROVIDER_REJECT: 'PROVIDER_REJECT',
  PAYMENT_CREATE: 'PAYMENT_CREATE',
  PAYMENT_CONFIRM: 'PAYMENT_CONFIRM',
  PAYMENT_RELEASE: 'PAYMENT_RELEASE',
  PAYMENT_REFUND: 'PAYMENT_REFUND',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
};

export const isSuspiciousActivity = (req: any): boolean => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /\.\.\//,
    /^\/etc\/passwd/,
    /^\/proc\//
  ];

  const bodyStr = JSON.stringify(req.body);
  const queryStr = JSON.stringify(req.query);
  const paramsStr = JSON.stringify(req.params);

  const allContent = bodyStr + queryStr + paramsStr;

  return suspiciousPatterns.some(pattern => pattern.test(allContent));
};

export const getClientIp = (req: any): string => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.ip ||
         'unknown';
};
