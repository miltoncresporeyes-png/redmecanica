
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { config } from '../../config/index.js';
import { auditLog } from '../../lib/audit.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await auditLog({
      userId: user.id,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user,
      token: accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await auditLog({
      userId: user.id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });

    res.json({
      message: 'Login exitoso',
      user: user,
      token: accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refresh_token');
  
  const user = (req as any).user;
  if (user) {
    auditLog({
        userId: user.id,
        action: 'LOGOUT',
        resource: 'User',
        resourceId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string
      });
  }

  res.json({ message: 'Logout exitoso' });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await auditLog({
      action: 'REFRESH_TOKEN',
      resource: 'User',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });

    res.json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response) => {
  // Logic from routes/auth.ts:182
  // req.user is populated by requireAuth middleware
  // We can just return it or re-fetch if needed (middleware already fetched basic info)
  // Original code fetched full user info again. Middleware fetches: id, email, role.
  // Let's assume middleware is enough or service can fetch full profile.
  // For now, return req.user (which is what we have)
  
  // If we want full profile including provider or details, we might want a userService call here.
  // But staying scope of auth module:
  res.json({ user: (req as any).user });
};
