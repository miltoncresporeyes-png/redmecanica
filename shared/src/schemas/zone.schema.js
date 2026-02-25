"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerZoneSchema = exports.updateZoneSchema = exports.zoneSchema = void 0;
const zod_1 = require("zod");
exports.zoneSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    slug: zod_1.z.string().min(1, 'El slug es requerido'),
    type: zod_1.z.enum(['REGION', 'COMMUNE', 'CUSTOM']),
    parentId: zod_1.z.string().uuid().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    radiusKm: zod_1.z.number().positive().optional(),
});
exports.updateZoneSchema = exports.zoneSchema.partial();
exports.providerZoneSchema = zod_1.z.object({
    providerId: zod_1.z.string().uuid('ID de proveedor inválido'),
    zoneId: zod_1.z.string().uuid('ID de zona inválido'),
    radiusKm: zod_1.z.number().positive().optional(),
});
//# sourceMappingURL=zone.schema.js.map