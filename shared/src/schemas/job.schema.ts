import { z } from 'zod';

export const jobLocationSchema = z.object({
  jobId: z.string().uuid('ID de trabajo inválido'),
  originLat: z.number().min(-90).max(90, 'Latitud inválida'),
  originLng: z.number().min(-180).max(180, 'Longitud inválida'),
  originAddress: z.string().optional(),
  originCommune: z.string().optional(),
  destLat: z.number().min(-90).max(90).optional(),
  destLng: z.number().min(-180).max(180).optional(),
  destAddress: z.string().optional(),
  destCommune: z.string().optional(),
});

export type JobLocationDTO = z.infer<typeof jobLocationSchema>;

export const updateJobLocationSchema = z.object({
  currentLat: z.number().min(-90).max(90).optional(),
  currentLng: z.number().min(-180).max(180).optional(),
});

export type UpdateJobLocationDTO = z.infer<typeof updateJobLocationSchema>;
