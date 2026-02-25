import { z } from 'zod';
export declare const conversationSchema: z.ZodObject<{
    jobId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodString;
    providerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    providerId?: string;
    jobId?: string;
    customerId?: string;
}, {
    providerId?: string;
    jobId?: string;
    customerId?: string;
}>;
export type ConversationDTO = z.infer<typeof conversationSchema>;
export declare const messageSchema: z.ZodObject<{
    conversationId: z.ZodString;
    senderId: z.ZodString;
    senderType: z.ZodEnum<["CUSTOMER", "PROVIDER"]>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    conversationId?: string;
    senderId?: string;
    senderType?: "CUSTOMER" | "PROVIDER";
    content?: string;
    metadata?: Record<string, unknown>;
}, {
    conversationId?: string;
    senderId?: string;
    senderType?: "CUSTOMER" | "PROVIDER";
    content?: string;
    metadata?: Record<string, unknown>;
}>;
export type MessageDTO = z.infer<typeof messageSchema>;
export declare const markMessageReadSchema: z.ZodObject<{
    messageId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    messageId?: string;
}, {
    messageId?: string;
}>;
export type MarkMessageReadDTO = z.infer<typeof markMessageReadSchema>;
//# sourceMappingURL=conversation.schema.d.ts.map