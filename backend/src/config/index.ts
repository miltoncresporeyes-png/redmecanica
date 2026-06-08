
import dotenv from 'dotenv';
dotenv.config();

const defaultFrontendOrigins = [
  'http://localhost:5173',
  'http://localhost:3011',
  'http://localhost:3012',
  'http://localhost:3000',
  'https://redmecanica.cl',
  'https://www.redmecanica.cl',
];

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigins = Array.from(
  new Set([...defaultFrontendOrigins, ...configuredOrigins].map((origin) => origin.replace(/\/$/, '')))
);

export const config = {
  port: process.env.PORT || 3011,
  env: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET || 'access_secret_123',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_123',
    accessExpires: '15m',
    refreshExpires: '7d',
  },
  cors: {
    origin: corsOrigins,
  },
  db: {
      url: process.env.DATABASE_URL
  },
  maps: {
    provider: process.env.MAPS_PROVIDER || 'mapbox',
    apiKey: process.env.MAPS_API_KEY || '',
  },
  webpay: {
    commerceCode: process.env.WEBPAY_COMMERCE_CODE || '',
    apiKey: process.env.WEBPAY_API_KEY || '',
    environment: process.env.WEBPAY_ENV || 'integration',
  },
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || '',
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || process.env.MP_PUBLIC_KEY || '',
    webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || process.env.MP_WEBHOOK_SECRET || '',
    notificationUrl: process.env.MERCADOPAGO_NOTIFICATION_URL || '',
    returnUrl: process.env.MERCADOPAGO_RETURN_URL || '',
    finalUrl: process.env.MERCADOPAGO_FINAL_URL || '',
  }
};
