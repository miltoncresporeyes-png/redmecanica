"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    role: zod_1.z.enum(['client', 'provider']).optional().default('client'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().optional()
});
//# sourceMappingURL=auth.schema.js.map