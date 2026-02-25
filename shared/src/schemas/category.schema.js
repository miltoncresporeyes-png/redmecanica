"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceCategorySchema = exports.serviceCategorySchema = void 0;
const zod_1 = require("zod");
exports.serviceCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    slug: zod_1.z.string().min(1, 'El slug es requerido'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    type: zod_1.z.enum(['MECHANIC', 'TOWING', 'INSURANCE', 'EMERGENCY']),
    isActive: zod_1.z.boolean().optional().default(true),
    sortOrder: zod_1.z.number().optional().default(0),
});
exports.updateServiceCategorySchema = exports.serviceCategorySchema.partial();
//# sourceMappingURL=category.schema.js.map