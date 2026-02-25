"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsSchema = exports.markNotificationReadSchema = exports.notificationSchema = void 0;
const zod_1 = require("zod");
exports.notificationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuario inválido'),
    type: zod_1.z.enum(['JOB_UPDATE', 'NEW_QUOTE', 'MESSAGE', 'PAYMENT', 'SYSTEM']),
    title: zod_1.z.string().min(1, 'El título es requerido'),
    body: zod_1.z.string().min(1, 'El cuerpo es requerido'),
    data: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.markNotificationReadSchema = zod_1.z.object({
    notificationId: zod_1.z.string().uuid('ID de notificación inválido'),
});
exports.getNotificationsSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('ID de usuario inválido'),
    isRead: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().min(1).max(100).optional().default(50),
    offset: zod_1.z.number().min(0).optional().default(0),
});
//# sourceMappingURL=notification.schema.js.map