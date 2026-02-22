import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { providerAvailabilitySchema, providerAvailabilityBulkSchema } from '@redmecanica/shared';

const router = Router();

router.get('/:providerId', async (req, res) => {
  try {
    const availability = await prisma.providerAvailability.findMany({
      where: { providerId: req.params.providerId },
      orderBy: { dayOfWeek: 'asc' },
    });
    
    res.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = providerAvailabilitySchema.parse(req.body);
    
    const availability = await prisma.providerAvailability.create({
      data,
    });
    
    res.status(201).json(availability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating availability:', error);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const { providerId, schedule } = providerAvailabilityBulkSchema.parse(req.body);
    
    await prisma.providerAvailability.deleteMany({
      where: { providerId },
    });
    
    const availabilities = await prisma.providerAvailability.createMany({
      data: schedule.map(s => ({
        providerId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isActive: s.isActive ?? true,
      })),
    });
    
    const allAvailability = await prisma.providerAvailability.findMany({
      where: { providerId },
      orderBy: { dayOfWeek: 'asc' },
    });
    
    res.json(allAvailability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating bulk availability:', error);
    res.status(500).json({ error: 'Failed to create availability schedule' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = providerAvailabilitySchema.partial().parse(req.body);
    
    const availability = await prisma.providerAvailability.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(availability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.providerAvailability.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

export default router;
