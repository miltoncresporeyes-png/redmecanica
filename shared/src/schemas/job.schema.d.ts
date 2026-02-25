import { z } from 'zod';
export declare const jobLocationSchema: z.ZodObject<{
    jobId: z.ZodString;
    originLat: z.ZodNumber;
    originLng: z.ZodNumber;
    originAddress: z.ZodOptional<z.ZodString>;
    originCommune: z.ZodOptional<z.ZodString>;
    destLat: z.ZodOptional<z.ZodNumber>;
    destLng: z.ZodOptional<z.ZodNumber>;
    destAddress: z.ZodOptional<z.ZodString>;
    destCommune: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    jobId?: string;
    originLat?: number;
    originLng?: number;
    originAddress?: string;
    originCommune?: string;
    destLat?: number;
    destLng?: number;
    destAddress?: string;
    destCommune?: string;
}, {
    jobId?: string;
    originLat?: number;
    originLng?: number;
    originAddress?: string;
    originCommune?: string;
    destLat?: number;
    destLng?: number;
    destAddress?: string;
    destCommune?: string;
}>;
export type JobLocationDTO = z.infer<typeof jobLocationSchema>;
export declare const updateJobLocationSchema: z.ZodObject<{
    currentLat: z.ZodOptional<z.ZodNumber>;
    currentLng: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    currentLat?: number;
    currentLng?: number;
}, {
    currentLat?: number;
    currentLng?: number;
}>;
export type UpdateJobLocationDTO = z.infer<typeof updateJobLocationSchema>;
//# sourceMappingURL=job.schema.d.ts.map