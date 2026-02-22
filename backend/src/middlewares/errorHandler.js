"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var httpErrors_js_1 = require("../lib/httpErrors.js");
var logger_js_1 = require("../lib/logger.js");
var zod_1 = require("zod");
var errorHandler = function (err, _req, res, _next) {
    if (err instanceof httpErrors_js_1.HttpError) {
        logger_js_1.logger.error("[".concat(err.statusCode, "] ").concat(err.message));
        return res.status(err.statusCode).json({ error: err.message });
    }
    if (err instanceof zod_1.ZodError) {
        var message = err.issues.map(function (e) { return "".concat(e.path.join('.'), ": ").concat(e.message); }).join(', ');
        logger_js_1.logger.warn("[Validation Error] ".concat(message));
        return res.status(400).json({ error: message });
    }
    logger_js_1.logger.error({ err: err }, "[500] ".concat(err.message));
    return res.status(500).json({ error: 'Error interno del servidor' });
};
exports.errorHandler = errorHandler;
