const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'https://redmecanica.cl,https://www.redmecanica.cl')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'redmecanica-backend',
    health: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

const mountRoute = (basePath, modulePath) => {
  try {
    const routeModule = require(modulePath);
    app.use(basePath, routeModule.default || routeModule);
  } catch (error) {
    console.error(`Failed to mount route ${basePath} from ${modulePath}:`, error);
  }
};

mountRoute('/api/auth', '../src/routes/auth.js');
mountRoute('/api/jobs', '../src/routes/jobs.js');
mountRoute('/api/services', '../src/routes/services.js');
mountRoute('/api/users', '../src/routes/users.js');
mountRoute('/api/providers', '../src/routes/providers.js');
mountRoute('/api/admin', '../src/routes/admin.js');
mountRoute('/api/quotes', '../src/routes/quotes.js');
mountRoute('/api/payments', '../src/routes/payments.js');
mountRoute('/api/categories', '../src/routes/categories.js');
mountRoute('/api/zones', '../src/routes/zones.js');
mountRoute('/api/availability', '../src/routes/availability.js');
mountRoute('/api/notifications', '../src/routes/notifications.js');
mountRoute('/api/conversations', '../src/routes/conversations.js');
mountRoute('/api/geo', '../src/routes/geolocation.js');
mountRoute('/api/maps', '../src/routes/maps.js');
mountRoute('/api/subscriptions', '../src/routes/subscriptions.js');
mountRoute('/api/contact', '../src/routes/contact.js');

app.use((error, _req, res, _next) => {
  if (error && error.message && error.message.startsWith('CORS blocked')) {
    res.status(403).json({ error: error.message });
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
