"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLimiter = exports.createLimiter = exports.apiLimiter = exports.authLimiter = void 0;
var express_rate_limit_1 = require("express-rate-limit");
var security_js_1 = require("../utils/security.js");
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_js_1.RATE_LIMITS.auth.windowMs,
    max: security_js_1.RATE_LIMITS.auth.max,
    message: {
        error: 'Demasiados intentos de login. Por favor intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_js_1.RATE_LIMITS.api.windowMs,
    max: security_js_1.RATE_LIMITS.api.max,
    message: {
        error: 'Demasiadas solicitudes. Por favor intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
exports.createLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_js_1.RATE_LIMITS.create.windowMs,
    max: security_js_1.RATE_LIMITS.create.max,
    message: {
        error: 'Demasiadas solicitudes de creación. Por favor intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
exports.paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: security_js_1.RATE_LIMITS.payment.windowMs,
    max: security_js_1.RATE_LIMITS.payment.max,
    message: {
        error: 'Demasiadas solicitudes de pago. Por favor intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
