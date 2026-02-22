
import { z } from 'zod';

export const createJobSchema = z.object({
  vehicleId: z.string().min(1, 'ID de vehículo inválido').optional().nullable(),
  serviceId: z.string().min(1, 'ID de servicio inválido').optional().nullable(),
  providerId: z.string().min(1, 'ID de proveedor inválido').optional().nullable(),
  problemDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  damagePhoto: z.string().url('URL de foto inválida').optional(),
});

export const updateJobStatusSchema = z.object({
  status: z.enum([
    'PENDING', 'SEARCHING', 'QUOTING', 'COMPARING_QUOTES', 'CONFIRMED',
    'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING',
    'IN_PROGRESS', 'WORK_COMPLETED', 'DELIVERED', 'REVIEWED',
    'CLOSED', 'CANCELLED', 'DISPUTED', 'REFUNDED'
  ]),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const rateJobSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});
