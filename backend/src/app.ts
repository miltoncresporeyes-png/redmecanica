
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

import { requestIdMiddleware } from './middlewares/securityHeaders.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

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

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(requestIdMiddleware);

// Health Check
app.get('/', (_req, res) => {
  res.send('RedMecanica Backend Running');
});

app.get('/api', (_req, res) => {
  res.json({ status: 'ok', service: 'api', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// Temporary public endpoint to view launch leads (until admin is set up)
app.get('/api/public/launch-leads', async (req, res) => {
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
