import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'provider']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const createJobSchema = z.object({
  vehicleId: z.string().optional(),
  serviceId: z.string().min(1, 'Debe seleccionar un servicio'),
  providerId: z.string().optional(),
  problemDescription: z.string().min(10, 'Describa el problema con al menos 10 caracteres'),
  address: z.string().min(5, 'Dirección requerida'),
  latitude: z.number(),
  longitude: z.number(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Marca requerida'),
  model: z.string().min(1, 'Modelo requerido'),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  licensePlate: z.string().optional(),
  color: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  phone: z.string().min(10, 'Teléfono inválido').optional(),
  address: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radiusKm: z.number().min(1).max(50).optional(),
  serviceType: z.string().optional(),
  sortBy: z.enum(['distance', 'rating', 'price']).optional(),
});

export const quoteSchema = z.object({
  price: z.number().positive('Precio debe ser positivo'),
  estimatedTime: z.string().min(1, 'Tiempo estimado requerido'),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return { success: false, errors };
}
