import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { notificationSchema, markNotificationReadSchema, getNotificationsSchema } from '@redmecanica/shared';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { userId, isRead, limit = '50', offset = '0' } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const where: Record<string, unknown> = { userId: userId as string };
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });
    
    const total = await prisma.notification.count({ where });
    
    res.json({ notifications, total, limit: Number(limit), offset: Number(offset) });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const count = await prisma.notification.count({
      where: { userId: userId as string, isRead: false },
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = notificationSchema.parse(req.body);
    
    const notification = await prisma.notification.create({
      data: {
        ...data,
        data: data.data ? JSON.stringify(data.data) : null,
      },
    });
    
    res.status(201).json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.post('/mark-read', async (req, res) => {
  try {
    const { notificationId } = markNotificationReadSchema.parse(req.body);
    
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    
    res.json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.post('/mark-all-read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.notification.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
