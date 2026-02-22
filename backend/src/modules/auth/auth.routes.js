"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var validate_js_1 = require("../../middlewares/validate.js");
var requireAuth_js_1 = require("../../middlewares/requireAuth.js");
var auth_schemas_js_1 = require("./auth.schemas.js");
var authController = require("./auth.controller.js");
var rateLimiter_js_1 = require("../../middlewares/rateLimiter.js");
var router = (0, express_1.Router)();
router.post('/register', rateLimiter_js_1.authLimiter, (0, validate_js_1.validate)(auth_schemas_js_1.registerSchema), authController.register);
router.post('/login', rateLimiter_js_1.authLimiter, (0, validate_js_1.validate)(auth_schemas_js_1.loginSchema), authController.login);
router.post('/refresh', (0, validate_js_1.validate)(auth_schemas_js_1.refreshTokenSchema, 'body'), authController.refresh); // Body is optional if cookie is present, but this middleware enforces body schema. Need to fix if optional.
// Wait, refreshTokenSchema has optional 'refreshToken'. validate('body') works if object matches schema. Empty object matches schema if prop is optional.
router.post('/logout', authController.logout);
router.get('/me', requireAuth_js_1.requireAuth, authController.me);
exports.default = router;
