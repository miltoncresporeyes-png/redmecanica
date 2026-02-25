"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessageReadSchema = exports.messageSchema = exports.conversationSchema = void 0;
const zod_1 = require("zod");
exports.conversationSchema = zod_1.z.object({
    jobId: zod_1.z.string().uuid('ID de trabajo inválido').optional(),
    customerId: zod_1.z.string().uuid('ID de cliente inválido'),
    providerId: zod_1.z.string().uuid('ID de proveedor inválido'),
});
exports.messageSchema = zod_1.z.object({
    conversationId: zod_1.z.string().uuid('ID de conversación inválido'),
    senderId: zod_1.z.string().uuid('ID de remitente inválido'),
    senderType: zod_1.z.enum(['CUSTOMER', 'PROVIDER']),
    content: zod_1.z.string().min(1, 'El mensaje no puede estar vacío').max(2000, 'Mensaje demasiado largo'),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.markMessageReadSchema = zod_1.z.object({
    messageId: zod_1.z.string().uuid('ID de mensaje inválido'),
});
//# sourceMappingURL=conversation.schema.js.map