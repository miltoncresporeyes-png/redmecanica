import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export type LoginDTO = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["client", "provider"]>>>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
    name?: string;
    role?: "client" | "provider";
}, {
    email?: string;
    password?: string;
    name?: string;
    role?: "client" | "provider";
}>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string;
}, {
    refreshToken?: string;
}>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
//# sourceMappingURL=auth.schema.d.ts.map