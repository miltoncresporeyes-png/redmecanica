"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobLocationSchema = exports.jobLocationSchema = void 0;
const zod_1 = require("zod");
exports.jobLocationSchema = zod_1.z.object({
    jobId: zod_1.z.string().uuid('ID de trabajo inválido'),
    originLat: zod_1.z.number().min(-90).max(90, 'Latitud inválida'),
    originLng: zod_1.z.number().min(-180).max(180, 'Longitud inválida'),
    originAddress: zod_1.z.string().optional(),
    originCommune: zod_1.z.string().optional(),
    destLat: zod_1.z.number().min(-90).max(90).optional(),
    destLng: zod_1.z.number().min(-180).max(180).optional(),
    destAddress: zod_1.z.string().optional(),
    destCommune: zod_1.z.string().optional(),
});
exports.updateJobLocationSchema = zod_1.z.object({
    currentLat: zod_1.z.number().min(-90).max(90).optional(),
    currentLng: zod_1.z.number().min(-180).max(180).optional(),
});
//# sourceMappingURL=job.schema.js.map