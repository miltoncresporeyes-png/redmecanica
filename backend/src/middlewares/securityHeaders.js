"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressionMiddleware = exports.securityHeadersMiddleware = exports.requestIdMiddleware = void 0;
var crypto_1 = require("crypto");
var requestIdMiddleware = function (req, res, next) {
    var id = (0, crypto_1.randomBytes)(8).toString('hex');
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
var securityHeadersMiddleware = function (_req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
};
exports.securityHeadersMiddleware = securityHeadersMiddleware;
var compressionMiddleware = function (req, _res, next) {
    req.acceptsEncodings = ['gzip', 'deflate', 'identity'];
    next();
};
exports.compressionMiddleware = compressionMiddleware;
