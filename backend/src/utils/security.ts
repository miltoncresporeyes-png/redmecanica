import { z } from 'zod';

export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^0-9+]/g, '');
};

export const registrationSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email es requerido')
    .max(255, 'Email muy largo')
    .transform(sanitizeEmail),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'Contraseña muy larga')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe tener letras mayúsculas, minúsculas y números'),
  name: z.string()
    .min(1, 'Nombre es requerido')
    .max(100, 'Nombre muy largo')
    .transform(sanitizeString),
  role: z.enum(['client', 'provider']).optional().default('client'),
  phone: z.string()
    .optional()
    .transform(val => val ? sanitizePhone(val) : undefined)
});

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email es requerido')
    .transform(sanitizeEmail),
  password: z.string()
    .min(1, 'Contraseña es requerida')
});

export const jobCreateSchema = z.object({
  vehicleId: z.string().optional(),
  serviceId: z.string()
    .min(1, 'Servicio es requerido')
    .max(100, 'ID de servicio muy largo'),
  providerId: z.string().optional(),
  problemDescription: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 1000, 'Descripción muy larga'),
  damagePhoto: z.string().url('URL de foto inválida').optional().or(z.literal(''))
});

export const quoteCreateSchema = z.object({
  jobId: z.string()
    .min(1, 'Job ID es requerido')
    .max(100, 'ID muy largo'),
  providerId: z.string()
    .min(1, 'Provider ID es requerido')
    .max(100, 'ID muy largo'),
  preliminaryDiagnosis: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 500, 'Diagnóstico muy largo'),
  laborCost: z.number().min(0).optional(),
  partsCost: z.number().min(0).optional(),
  totalCost: z.number()
    .min(1, 'Costo debe ser mayor a 0')
    .max(10000000, 'Costo muy alto'),
  estimatedDuration: z.number()
    .min(1, 'Duración mínima 1 minuto')
    .max(1440, 'Duración máxima 24 horas'),
  warranty: z.string()
    .optional()
    .max(200, 'Garantía muy larga')
    .transform(val => val ? sanitizeString(val) : undefined),
  serviceItems: z.array(z.object({
    descripcion: z.string().max(200),
    costo: z.number().min(0)
  })).max(20, 'Máximo 20 ítems').optional()
});

export const providerUpdateSchema = z.object({
  bio: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 500, 'Bio muy larga'),
  phone: z.string()
    .optional()
    .transform(val => val ? sanitizePhone(val) : undefined),
  address: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 200, 'Dirección muy larga'),
  commune: z.string()
    .optional()
    .max(100, 'Comuna muy larga'),
  region: z.string()
    .optional()
    .max(100, 'Región muy larga'),
  specialties: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 500, 'Especialidades muy largas'),
  vehicle: z.string()
    .optional()
    .max(100, 'Vehículo muy largo'),
  licensePlate: z.string()
    .optional()
    .transform(val => val ? val.toUpperCase().replace(/[^A-Z0-9]/g, '') : undefined)
    .refine(val => !val || val.length <= 10, 'Patente muy larga')
});

export const paymentCreateSchema = z.object({
  jobId: z.string()
    .min(1, 'Job ID es requerido')
    .max(100, 'ID muy largo'),
  amount: z.number()
    .min(1000, 'Monto mínimo $1.000 CLP')
    .max(10000000, 'Monto máximo $10.000.000 CLP'),
  paymentMethod: z.enum(['webpay', 'transfer', 'cash'])
});

export const userUpdateSchema = z.object({
  name: z.string()
    .min(1, 'Nombre es requerido')
    .max(100, 'Nombre muy largo')
    .transform(sanitizeString),
  phone: z.string()
    .optional()
    .transform(val => val ? sanitizePhone(val) : undefined)
});

export const reviewSchema = z.object({
  rating: z.number()
    .min(1, 'Rating mínimo 1')
    .max(5, 'Rating máximo 5'),
  review: z.string()
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
    .refine(val => !val || val.length <= 500, 'Reseña muy larga'),
  wouldRecommend: z.boolean().optional()
});

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 },
  api: { windowMs: 15 * 60 * 1000, max: 100 },
  create: { windowMs: 60 * 1000, max: 10 },
  payment: { windowMs: 60 * 1000, max: 5 }
};

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateFileUpload = (file: { type: string; size: number }): { valid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido. Solo JPEG, PNG, WebP o PDF.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Archivo muy grande. Máximo 5MB.' };
  }
  return { valid: true };
};
