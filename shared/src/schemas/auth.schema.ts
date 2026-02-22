
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  role: z.enum(['client', 'provider']).optional().default('client'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;

export const refreshTokenSchema = z.object({
    refreshToken: z.string().optional()
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
