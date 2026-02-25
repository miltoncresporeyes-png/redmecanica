import { z } from 'zod';
export declare const serviceCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["MECHANIC", "TOWING", "INSURANCE", "EMERGENCY"]>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    type?: "MECHANIC" | "TOWING" | "INSURANCE" | "EMERGENCY";
    slug?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}, {
    name?: string;
    type?: "MECHANIC" | "TOWING" | "INSURANCE" | "EMERGENCY";
    slug?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}>;
export type ServiceCategoryDTO = z.infer<typeof serviceCategorySchema>;
export declare const updateServiceCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<["MECHANIC", "TOWING", "INSURANCE", "EMERGENCY"]>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    type?: "MECHANIC" | "TOWING" | "INSURANCE" | "EMERGENCY";
    slug?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}, {
    name?: string;
    type?: "MECHANIC" | "TOWING" | "INSURANCE" | "EMERGENCY";
    slug?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}>;
export type UpdateServiceCategoryDTO = z.infer<typeof updateServiceCategorySchema>;
//# sourceMappingURL=category.schema.d.ts.map