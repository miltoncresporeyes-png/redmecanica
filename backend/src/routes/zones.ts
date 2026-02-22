import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { zoneSchema, updateZoneSchema, providerZoneSchema } from '@redmecanica/shared';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { type, parentId } = req.query;
    
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (parentId) where.parentId = parentId as string;
    else where.parentId = null;

    const zones = await prisma.zone.findMany({
      where,
      include: { 
        children: true,
        _count: { select: { providers: true } }
      },
      orderBy: { name: 'asc' },
    });
    
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ error: 'Failed to fetch zones' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: req.params.id },
      include: { 
        parent: true,
        children: true,
        providers: { include: { provider: true } }
      },
    });
    
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    
    res.json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Failed to fetch zone' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = zoneSchema.parse(req.body);
    
    const zone = await prisma.zone.create({
      data,
    });
    
    res.status(201).json(zone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Failed to create zone' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = updateZoneSchema.parse(req.body);
    
    const zone = await prisma.zone.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(zone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Failed to update zone' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.zone.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Failed to delete zone' });
  }
});

router.post('/assign-provider', async (req, res) => {
  try {
    const data = providerZoneSchema.parse(req.body);
    
    const providerZone = await prisma.providerZone.create({
      data,
    });
    
    res.status(201).json(providerZone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error assigning provider to zone:', error);
    res.status(500).json({ error: 'Failed to assign provider to zone' });
  }
});

router.delete('/remove-provider', async (req, res) => {
  try {
    const { providerId, zoneId } = req.body;
    
    await prisma.providerZone.deleteMany({
      where: { providerId, zoneId },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing provider from zone:', error);
    res.status(500).json({ error: 'Failed to remove provider from zone' });
  }
});

router.get('/:id/providers', async (req, res) => {
  try {
    const providers = await prisma.providerZone.findMany({
      where: { zoneId: req.params.id },
      include: { 
        provider: { 
          include: { user: { select: { name: true, email: true } } }
        } 
      },
    });
    
    res.json(providers.map(p => p.provider));
  } catch (error) {
    console.error('Error fetching providers in zone:', error);
    res.status(500).json({ error: 'Failed to fetch providers in zone' });
  }
});

export default router;
