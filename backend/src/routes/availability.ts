import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { providerAvailabilitySchema, providerAvailabilityBulkSchema } from '../schemas/shared.schemas.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';

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

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = providerAvailabilitySchema.parse(req.body);
    
    // Verify that the logged-in user is the owner of the provider profile
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: data.providerId }
    });
    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    if (provider.userId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para este proveedor' });
    }

    const availability = await prisma.providerAvailability.create({
      data: data as any,
    });
    
    res.status(201).json(availability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error creating availability:', error);
    res.status(500).json({ error: 'Failed to create availability' });
  }
});

router.post('/bulk', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { providerId, schedule } = providerAvailabilityBulkSchema.parse(req.body);
    
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId }
    });
    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    if (provider.userId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para este proveedor' });
    }

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
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error creating bulk availability:', error);
    res.status(500).json({ error: 'Failed to create availability schedule' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const availability = (await prisma.providerAvailability.findUnique({
      where: { id: req.params.id as string },
      include: { provider: true }
    })) as any;
    if (!availability) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    if (availability.provider.userId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No autorizado para modificar este horario' });
    }

    const data = providerAvailabilitySchema.partial().parse(req.body);
    
    const updated = await prisma.providerAvailability.update({
      where: { id: req.params.id as string },
      data,
    });
    
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const availability = (await prisma.providerAvailability.findUnique({
      where: { id: req.params.id as string },
      include: { provider: true }
    })) as any;
    if (!availability) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    if (availability.provider.userId !== req.user?.id && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No autorizado para eliminar este horario' });
    }

    await prisma.providerAvailability.delete({
      where: { id: req.params.id as string },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
});

export default router;
