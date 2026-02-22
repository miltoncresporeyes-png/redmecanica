"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.MAX_FILE_SIZE = exports.ALLOWED_FILE_TYPES = exports.RATE_LIMITS = exports.reviewSchema = exports.userUpdateSchema = exports.paymentCreateSchema = exports.providerUpdateSchema = exports.quoteCreateSchema = exports.jobCreateSchema = exports.loginSchema = exports.registrationSchema = exports.sanitizePhone = exports.sanitizeEmail = exports.sanitizeString = void 0;
var zod_1 = require("zod");
var sanitizeString = function (input) {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
};
exports.sanitizeString = sanitizeString;
var sanitizeEmail = function (email) {
    return email.toLowerCase().trim();
};
exports.sanitizeEmail = sanitizeEmail;
var sanitizePhone = function (phone) {
    return phone.replace(/[^0-9+]/g, '');
};
exports.sanitizePhone = sanitizePhone;
exports.registrationSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email('Email inválido')
        .min(1, 'Email es requerido')
        .max(255, 'Email muy largo')
        .transform(exports.sanitizeEmail),
    password: zod_1.z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'Contraseña muy larga')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe tener letras mayúsculas, minúsculas y números'),
    name: zod_1.z.string()
        .min(1, 'Nombre es requerido')
        .max(100, 'Nombre muy largo')
        .transform(exports.sanitizeString),
    role: zod_1.z.enum(['client', 'provider']).optional().default('client'),
    phone: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizePhone)(val) : undefined; })
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email('Email inválido')
        .min(1, 'Email es requerido')
        .transform(exports.sanitizeEmail),
    password: zod_1.z.string()
        .min(1, 'Contraseña es requerida')
});
exports.jobCreateSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().optional(),
    serviceId: zod_1.z.string()
        .min(1, 'Servicio es requerido')
        .max(100, 'ID de servicio muy largo'),
    providerId: zod_1.z.string().optional(),
    problemDescription: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 1000; }, 'Descripción muy larga'),
    damagePhoto: zod_1.z.string().url('URL de foto inválida').optional().or(zod_1.z.literal(''))
});
exports.quoteCreateSchema = zod_1.z.object({
    jobId: zod_1.z.string()
        .min(1, 'Job ID es requerido')
        .max(100, 'ID muy largo'),
    providerId: zod_1.z.string()
        .min(1, 'Provider ID es requerido')
        .max(100, 'ID muy largo'),
    preliminaryDiagnosis: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 500; }, 'Diagnóstico muy largo'),
    laborCost: zod_1.z.number().min(0).optional(),
    partsCost: zod_1.z.number().min(0).optional(),
    totalCost: zod_1.z.number()
        .min(1, 'Costo debe ser mayor a 0')
        .max(10000000, 'Costo muy alto'),
    estimatedDuration: zod_1.z.number()
        .min(1, 'Duración mínima 1 minuto')
        .max(1440, 'Duración máxima 24 horas'),
    warranty: zod_1.z.string()
        .optional()
        .max(200, 'Garantía muy larga')
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; }),
    serviceItems: zod_1.z.array(zod_1.z.object({
        descripcion: zod_1.z.string().max(200),
        costo: zod_1.z.number().min(0)
    })).max(20, 'Máximo 20 ítems').optional()
});
exports.providerUpdateSchema = zod_1.z.object({
    bio: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 500; }, 'Bio muy larga'),
    phone: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizePhone)(val) : undefined; }),
    address: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 200; }, 'Dirección muy larga'),
    commune: zod_1.z.string()
        .optional()
        .max(100, 'Comuna muy larga'),
    region: zod_1.z.string()
        .optional()
        .max(100, 'Región muy larga'),
    specialties: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 500; }, 'Especialidades muy largas'),
    vehicle: zod_1.z.string()
        .optional()
        .max(100, 'Vehículo muy largo'),
    licensePlate: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? val.toUpperCase().replace(/[^A-Z0-9]/g, '') : undefined; })
        .refine(function (val) { return !val || val.length <= 10; }, 'Patente muy larga')
});
exports.paymentCreateSchema = zod_1.z.object({
    jobId: zod_1.z.string()
        .min(1, 'Job ID es requerido')
        .max(100, 'ID muy largo'),
    amount: zod_1.z.number()
        .min(1000, 'Monto mínimo $1.000 CLP')
        .max(10000000, 'Monto máximo $10.000.000 CLP'),
    paymentMethod: zod_1.z.enum(['webpay', 'transfer', 'cash'])
});
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Nombre es requerido')
        .max(100, 'Nombre muy largo')
        .transform(exports.sanitizeString),
    phone: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizePhone)(val) : undefined; })
});
exports.reviewSchema = zod_1.z.object({
    rating: zod_1.z.number()
        .min(1, 'Rating mínimo 1')
        .max(5, 'Rating máximo 5'),
    review: zod_1.z.string()
        .optional()
        .transform(function (val) { return val ? (0, exports.sanitizeString)(val) : undefined; })
        .refine(function (val) { return !val || val.length <= 500; }, 'Reseña muy larga'),
    wouldRecommend: zod_1.z.boolean().optional()
});
exports.RATE_LIMITS = {
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    api: { windowMs: 15 * 60 * 1000, max: 100 },
    create: { windowMs: 60 * 1000, max: 10 },
    payment: { windowMs: 60 * 1000, max: 5 }
};
exports.ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
];
exports.MAX_FILE_SIZE = 5 * 1024 * 1024;
var validateFileUpload = function (file) {
    if (!exports.ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Tipo de archivo no permitido. Solo JPEG, PNG, WebP o PDF.' };
    }
    if (file.size > exports.MAX_FILE_SIZE) {
        return { valid: false, error: 'Archivo muy grande. Máximo 5MB.' };
    }
    return { valid: true };
};
exports.validateFileUpload = validateFileUpload;
