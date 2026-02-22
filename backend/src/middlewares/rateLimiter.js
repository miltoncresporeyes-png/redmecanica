"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.globalLimiter = void 0;
var express_rate_limit_1 = require("express-rate-limit");
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: function (req) { return req.method === 'OPTIONS'; },
    message: {
        message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.'
    }
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 login/register attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Demasiados intentos de acceso, por favor intente de nuevo en una hora.'
    }
});
