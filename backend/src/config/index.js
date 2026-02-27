"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv = require("dotenv");
dotenv.config();
var defaultFrontendOrigins = [
    'http://localhost:5173',
    'http://localhost:3011',
    'http://localhost:3012',
    'http://localhost:3000',
    'https://redmecanica.cl',
    'https://www.redmecanica.cl',
];
var configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);
var corsOrigins = Array.from(new Set(__spreadArray(__spreadArray([], defaultFrontendOrigins, true), configuredOrigins, true).map(function (origin) { return origin.replace(/\/$/, ''); })));
exports.config = {
    port: process.env.PORT || 3001,
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
    }
};
