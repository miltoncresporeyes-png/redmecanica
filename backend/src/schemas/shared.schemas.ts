import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Contrasena debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  role: z.enum(['client', 'provider']).optional().default('client'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const providerAvailabilitySchema = z.object({
  providerId: z.string().uuid('ID de proveedor invalido'),
  dayOfWeek: z.number().min(0).max(6, 'Dia de la semana debe ser 0-6'),
  startTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora invalido (HH:mm)'),
  endTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Formato de hora invalido (HH:mm)'),
  isActive: z.boolean().optional().default(true),
});

export const providerAvailabilityBulkSchema = z.object({
  providerId: z.string().uuid('ID de proveedor invalido'),
  schedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
      endTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/),
      isActive: z.boolean().optional().default(true),
    })
  ),
});

export const notificationSchema = z.object({
  userId: z.string().uuid('ID de usuario invalido'),
  type: z.enum(['JOB_UPDATE', 'NEW_QUOTE', 'MESSAGE', 'PAYMENT', 'SYSTEM']),
  title: z.string().min(1, 'El titulo es requerido'),
  body: z.string().min(1, 'El cuerpo es requerido'),
  data: z.record(z.unknown()).optional(),
});

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid('ID de notificacion invalido'),
});

export const getNotificationsSchema = z.object({
  userId: z.string().uuid('ID de usuario invalido'),
  isRead: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

export const conversationSchema = z.object({
  jobId: z.string().uuid('ID de trabajo invalido').optional(),
  customerId: z.string().uuid('ID de cliente invalido'),
  providerId: z.string().uuid('ID de proveedor invalido'),
});

export const messageSchema = z.object({
  conversationId: z.string().uuid('ID de conversacion invalido'),
  senderId: z.string().uuid('ID de remitente invalido'),
  senderType: z.enum(['CUSTOMER', 'PROVIDER']),
  content: z.string().min(1, 'El mensaje no puede estar vacio').max(2000, 'Mensaje demasiado largo'),
  metadata: z.record(z.unknown()).optional(),
});

export const serviceCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['MECHANIC', 'TOWING', 'INSURANCE', 'EMERGENCY']),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export const updateServiceCategorySchema = serviceCategorySchema.partial();

export const zoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  type: z.enum(['REGION', 'COMMUNE', 'CUSTOM']),
  parentId: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().positive().optional(),
});

export const updateZoneSchema = zoneSchema.partial();

export const providerZoneSchema = z.object({
  providerId: z.string().uuid('ID de proveedor invalido'),
  zoneId: z.string().uuid('ID de zona invalido'),
  radiusKm: z.number().positive().optional(),
});
