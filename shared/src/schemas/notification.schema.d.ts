import { z } from 'zod';
export declare const notificationSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodEnum<["JOB_UPDATE", "NEW_QUOTE", "MESSAGE", "PAYMENT", "SYSTEM"]>;
    title: z.ZodString;
    body: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    body?: string;
    type?: "JOB_UPDATE" | "NEW_QUOTE" | "MESSAGE" | "PAYMENT" | "SYSTEM";
    userId?: string;
    title?: string;
    data?: Record<string, unknown>;
}, {
    body?: string;
    type?: "JOB_UPDATE" | "NEW_QUOTE" | "MESSAGE" | "PAYMENT" | "SYSTEM";
    userId?: string;
    title?: string;
    data?: Record<string, unknown>;
}>;
export type NotificationDTO = z.infer<typeof notificationSchema>;
export declare const markNotificationReadSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    notificationId?: string;
}, {
    notificationId?: string;
}>;
export type MarkNotificationReadDTO = z.infer<typeof markNotificationReadSchema>;
export declare const getNotificationsSchema: z.ZodObject<{
    userId: z.ZodString;
    isRead: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    userId?: string;
    isRead?: boolean;
    limit?: number;
    offset?: number;
}, {
    userId?: string;
    isRead?: boolean;
    limit?: number;
    offset?: number;
}>;
export type GetNotificationsDTO = z.infer<typeof getNotificationsSchema>;
//# sourceMappingURL=notification.schema.d.ts.map