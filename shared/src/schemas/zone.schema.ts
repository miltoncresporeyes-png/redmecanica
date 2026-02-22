import { z } from 'zod';

export const zoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  type: z.enum(['REGION', 'COMMUNE', 'CUSTOM']),
  parentId: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().positive().optional(),
});

export type ZoneDTO = z.infer<typeof zoneSchema>;

export const updateZoneSchema = zoneSchema.partial();

export type UpdateZoneDTO = z.infer<typeof updateZoneSchema>;

export const providerZoneSchema = z.object({
  providerId: z.string().uuid('ID de proveedor inválido'),
  zoneId: z.string().uuid('ID de zona inválido'),
  radiusKm: z.number().positive().optional(),
});

export type ProviderZoneDTO = z.infer<typeof providerZoneSchema>;
