
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import monitoringRoutes from './routes/monitoring.js';

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

// Health Check Endpoints (placed BEFORE CORS, RateLimiter & security headers to ensure health probes always succeed)
app.get(['/', '/health', '/api/health'], (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'redmecanica-backend', timestamp: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'api', timestamp: new Date().toISOString() });
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
app.use(securityHeadersMiddleware);
app.use(globalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use(requestIdMiddleware);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/users', usersRoutes);
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
