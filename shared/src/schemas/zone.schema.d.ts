import { z } from 'zod';
export declare const zoneSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    type: z.ZodEnum<["REGION", "COMMUNE", "CUSTOM"]>;
    parentId: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    radiusKm: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    type?: "REGION" | "COMMUNE" | "CUSTOM";
    slug?: string;
    parentId?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
}, {
    name?: string;
    type?: "REGION" | "COMMUNE" | "CUSTOM";
    slug?: string;
    parentId?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
}>;
export type ZoneDTO = z.infer<typeof zoneSchema>;
export declare const updateZoneSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["REGION", "COMMUNE", "CUSTOM"]>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    radiusKm: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    type?: "REGION" | "COMMUNE" | "CUSTOM";
    slug?: string;
    parentId?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
}, {
    name?: string;
    type?: "REGION" | "COMMUNE" | "CUSTOM";
    slug?: string;
    parentId?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
}>;
export type UpdateZoneDTO = z.infer<typeof updateZoneSchema>;
export declare const providerZoneSchema: z.ZodObject<{
    providerId: z.ZodString;
    zoneId: z.ZodString;
    radiusKm: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    radiusKm?: number;
    providerId?: string;
    zoneId?: string;
}, {
    radiusKm?: number;
    providerId?: string;
    zoneId?: string;
}>;
export type ProviderZoneDTO = z.infer<typeof providerZoneSchema>;
//# sourceMappingURL=zone.schema.d.ts.map