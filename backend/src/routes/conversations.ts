import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { conversationSchema, messageSchema } from '@redmecanica/shared';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { userId, providerId, status } = req.query;
    
    const where: Record<string, unknown> = {};
    if (userId) where.customerId = userId as string;
    if (providerId) where.providerId = providerId as string;
    if (status) where.status = status;

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        provider: { include: { user: { select: { name: true, email: true } } } },
        job: { select: { id: true, status: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: true } }
      },
      orderBy: { lastMessageAt: 'desc' },
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: {
        provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
        job: { select: { id: true, status: true, request: { include: { vehicle: true, service: true } } } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = conversationSchema.parse(req.body);
    
    const existing = await prisma.conversation.findFirst({
      where: {
        customerId: data.customerId,
        providerId: data.providerId,
        jobId: data.jobId,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      return res.json(existing);
    }
    
    const conversation = await prisma.conversation.create({
      data,
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

router.get('/:id/messages', async (req, res) => {
  try {
    const { limit = '50', offset = '0', unreadOnly = 'false' } = req.query;
    
    const where: Record<string, unknown> = { conversationId: req.params.id };
    if (unreadOnly === 'true') where.isRead = false;

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const data = messageSchema.parse({
      ...req.body,
      conversationId: req.params.id,
    });
    
    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderType: data.senderType,
        content: data.content,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
      include: { conversation: true },
    });
    
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: new Date() },
    });

    const { notificationType, senderType } = req.body;
    if (notificationType && senderType) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: req.params.id },
      });

      if (conversation) {
        const recipientId = senderType === 'CUSTOMER' ? conversation.providerId : conversation.customerId;
        
        await prisma.notification.create({
          data: {
            userId: senderType === 'CUSTOMER' ? conversation.customerId : recipientId,
            type: 'MESSAGE',
            title: 'Nuevo mensaje',
            body: data.content.substring(0, 100),
            data: JSON.stringify({ conversationId: req.params.id, messageId: message.id }),
          },
        });
      }
    }
    
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.patch('/messages/:messageId/read', async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: req.params.messageId },
      data: { isRead: true },
    });
    
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.post('/:id/archive', async (req, res) => {
  try {
    const conversation = await prisma.conversation.update({
      where: { id: req.params.id },
      data: { status: 'ARCHIVED' },
    });
    
    res.json(conversation);
  } catch (error) {
    console.error('Error archiving conversation:', error);
    res.status(500).json({ error: 'Failed to archive conversation' });
  }
});

export default router;
