import { z } from 'zod';

export const notificationSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  type: z.enum(['JOB_UPDATE', 'NEW_QUOTE', 'MESSAGE', 'PAYMENT', 'SYSTEM']),
  title: z.string().min(1, 'El título es requerido'),
  body: z.string().min(1, 'El cuerpo es requerido'),
  data: z.record(z.unknown()).optional(),
});

export type NotificationDTO = z.infer<typeof notificationSchema>;

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid('ID de notificación inválido'),
});

export type MarkNotificationReadDTO = z.infer<typeof markNotificationReadSchema>;

export const getNotificationsSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  isRead: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

export type GetNotificationsDTO = z.infer<typeof getNotificationsSchema>;
