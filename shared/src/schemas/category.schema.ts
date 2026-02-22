import { z } from 'zod';

export const serviceCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['MECHANIC', 'TOWING', 'INSURANCE', 'EMERGENCY']),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export type ServiceCategoryDTO = z.infer<typeof serviceCategorySchema>;

export const updateServiceCategorySchema = serviceCategorySchema.partial();

export type UpdateServiceCategoryDTO = z.infer<typeof updateServiceCategorySchema>;
