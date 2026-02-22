import { z } from 'zod';

export const providerAvailabilitySchema = z.object({
  providerId: z.string().uuid('ID de proveedor inválido'),
  dayOfWeek: z.number().min(0).max(6, 'Día de la semana debe ser 0-6'),
  startTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)'),
  endTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)'),
  isActive: z.boolean().optional().default(true),
});

export type ProviderAvailabilityDTO = z.infer<typeof providerAvailabilitySchema>;

export const providerAvailabilityBulkSchema = z.object({
  providerId: z.string().uuid('ID de proveedor inválido'),
  schedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
      endTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
      isActive: z.boolean().optional().default(true),
    })
  ),
});

export type ProviderAvailabilityBulkDTO = z.infer<typeof providerAvailabilityBulkSchema>;
