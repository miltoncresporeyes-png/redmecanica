"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateJobSchema = exports.updateJobStatusSchema = exports.createJobSchema = void 0;
var zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().min(1, 'ID de vehículo inválido').optional().nullable(),
    serviceId: zod_1.z.string().min(1, 'ID de servicio inválido').optional().nullable(),
    providerId: zod_1.z.string().min(1, 'ID de proveedor inválido').optional().nullable(),
    problemDescription: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    damagePhoto: zod_1.z.string().url('URL de foto inválida').optional(),
});
exports.updateJobStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        'PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES', 'CONFIRMED',
        'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING',
        'IN_PROGRESS', 'WORK_COMPLETED', 'DELIVERED', 'REVIEWED',
        'CLOSED', 'CANCELLED', 'DISPUTED', 'REFUNDED'
    ]),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
exports.rateJobSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    review: zod_1.z.string().optional(),
});
