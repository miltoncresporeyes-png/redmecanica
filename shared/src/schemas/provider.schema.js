"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerAvailabilityBulkSchema = exports.providerAvailabilitySchema = void 0;
const zod_1 = require("zod");
exports.providerAvailabilitySchema = zod_1.z.object({
    providerId: zod_1.z.string().uuid('ID de proveedor inválido'),
    dayOfWeek: zod_1.z.number().min(0).max(6, 'Día de la semana debe ser 0-6'),
    startTime: zod_1.z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)'),
    endTime: zod_1.z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)'),
    isActive: zod_1.z.boolean().optional().default(true),
});
exports.providerAvailabilityBulkSchema = zod_1.z.object({
    providerId: zod_1.z.string().uuid('ID de proveedor inválido'),
    schedule: zod_1.z.array(zod_1.z.object({
        dayOfWeek: zod_1.z.number().min(0).max(6),
        startTime: zod_1.z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
        endTime: zod_1.z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
        isActive: zod_1.z.boolean().optional().default(true),
    })),
});
//# sourceMappingURL=provider.schema.js.map