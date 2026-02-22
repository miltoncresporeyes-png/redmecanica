
import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { loginSchema, registerSchema, refreshTokenSchema } from './auth.schemas.js';
import * as authController from './auth.controller.js';

import { authLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema, 'body'), authController.refresh); // Body is optional if cookie is present, but this middleware enforces body schema. Need to fix if optional.
// Wait, refreshTokenSchema has optional 'refreshToken'. validate('body') works if object matches schema. Empty object matches schema if prop is optional.
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
