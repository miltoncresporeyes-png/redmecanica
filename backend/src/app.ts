
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js';
import monitoringRoutes from './routes/monitoring.js';

import { prisma } from './db.js';
import jobsRoutes from './routes/jobs.js';
import servicesRoutes from './routes/services.js';
import usersRoutes from './routes/users.js';
import providersRoutes from './routes/providers.js';
import adminRoutes from './routes/admin.js';
import quotesRoutes from './routes/quotes.js';
import paymentsRoutes from './routes/payments.js';
import categoriesRoutes from './routes/categories.js';
import zonesRoutes from './routes/zones.js';
import availabilityRoutes from './routes/availability.js';
import notificationsRoutes from './routes/notifications.js';
import conversationsRoutes from './routes/conversations.js';
import geolocationRoutes from './routes/geolocation.js';
import mapsRoutes from './routes/maps.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import contactRoutes from './routes/contact.js';

import { requestIdMiddleware, securityHeadersMiddleware } from './middlewares/securityHeaders.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requireAuth, requireRole } from './middlewares/requireAuth.js';

const app = express();

// Express app runs behind a reverse proxy (nginx/gateway). Trust proxy hops
// so req.ip uses the real client IP from X-Forwarded-For instead of the proxy.
// Required for express-rate-limit to correctly identify users in production.
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Health Check Endpoints (placed BEFORE CORS, RateLimiter & security headers to ensure health probes always succeed)
app.get(['/', '/health', '/api/health'], (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'redmecanica-backend', timestamp: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'api', timestamp: new Date().toISOString() });
});

app.get('/api/commit-hash', (_req, res) => {
  res.status(200).json({ commit: 'F58B299_ENTRYPOINT_FIX_V2' });
});

app.get('/api/test-smtp', async (_req, res) => {
  try {
    const nodemailer = await import('nodemailer');
    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER || "contacto@redmecanica.cl";
    const pass = process.env.SMTP_PASS;

    const transporter = nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });

    await transporter.verify();
    res.json({
      success: true,
      message: 'SMTP connection verified successfully',
      config: { host, port, user, hasPass: !!pass, passLength: pass ? pass.length : 0 }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS,
        passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
      }
    });
  }
});



const defaultFrontendOrigins = [
  'https://redmecanica.cl',
  'https://www.redmecanica.cl',
  'http://localhost:5173',
  'http://localhost:3000',
];

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultFrontendOrigins, ...configuredOrigins].map((origin) => origin.replace(/\/$/, '')))
);

const isAllowedLocalOrigin = (origin: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin) || isAllowedLocalOrigin(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(securityHeadersMiddleware);
app.use(globalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use(requestIdMiddleware);

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/users', usersRoutes);

// Named static routes BEFORE the dynamic /:id router to avoid param capture
app.get('/api/providers/demo-status', async (_req, res) => {
  try {
    const realProviderCount = await prisma.serviceProvider.count({ where: { isDemo: false } });
    return res.json({ demoMode: realProviderCount === 0, realProviderCount });
  } catch (error) {
    console.error('Error fetching demo status:', error);
    return res.status(500).json({ error: 'Failed to fetch platform status' });
  }
});

app.use('/api/providers', providersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/geo', geolocationRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/contact', contactRoutes);

// Protected endpoint to view launch leads
app.get('/api/public/launch-leads', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { prisma } = await import('./db.js');
    const leads = await prisma.launchLead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ leads, total: leads.length });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leads' });
  }
});

// Error Handler
app.use(errorHandler);

export default app;
