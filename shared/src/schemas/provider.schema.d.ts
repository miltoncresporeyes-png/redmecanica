import { z } from 'zod';
export declare const providerAvailabilitySchema: z.ZodObject<{
    providerId: z.ZodString;
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean;
    providerId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
}, {
    isActive?: boolean;
    providerId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
}>;
export type ProviderAvailabilityDTO = z.infer<typeof providerAvailabilitySchema>;
export declare const providerAvailabilityBulkSchema: z.ZodObject<{
    providerId: z.ZodString;
    schedule: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startTime: z.ZodString;
        endTime: z.ZodString;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean;
        dayOfWeek?: number;
        startTime?: string;
        endTime?: string;
    }, {
        isActive?: boolean;
        dayOfWeek?: number;
        startTime?: string;
        endTime?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    providerId?: string;
    schedule?: {
        isActive?: boolean;
        dayOfWeek?: number;
        startTime?: string;
        endTime?: string;
    }[];
}, {
    providerId?: string;
    schedule?: {
        isActive?: boolean;
        dayOfWeek?: number;
        startTime?: string;
        endTime?: string;
    }[];
}>;
export type ProviderAvailabilityBulkDTO = z.infer<typeof providerAvailabilityBulkSchema>;
//# sourceMappingURL=provider.schema.d.ts.map