import { z } from 'zod';

export const conversationSchema = z.object({
  jobId: z.string().uuid('ID de trabajo inválido').optional(),
  customerId: z.string().uuid('ID de cliente inválido'),
  providerId: z.string().uuid('ID de proveedor inválido'),
});

export type ConversationDTO = z.infer<typeof conversationSchema>;

export const messageSchema = z.object({
  conversationId: z.string().uuid('ID de conversación inválido'),
  senderId: z.string().uuid('ID de remitente inválido'),
  senderType: z.enum(['CUSTOMER', 'PROVIDER']),
  content: z.string().min(1, 'El mensaje no puede estar vacío').max(2000, 'Mensaje demasiado largo'),
  metadata: z.record(z.unknown()).optional(),
});

export type MessageDTO = z.infer<typeof messageSchema>;

export const markMessageReadSchema = z.object({
  messageId: z.string().uuid('ID de mensaje inválido'),
});

export type MarkMessageReadDTO = z.infer<typeof markMessageReadSchema>;
