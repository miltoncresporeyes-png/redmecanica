import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { serviceCategorySchema, updateServiceCategorySchema } from '../schemas/shared.schemas.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const categories = await prisma.serviceCategory.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.serviceCategory.findUnique({
      where: { id: req.params.id },
      include: { services: true },
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = serviceCategorySchema.parse(req.body);
    
    const category = await prisma.serviceCategory.create({
      data,
    });
    
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = updateServiceCategorySchema.parse(req.body);
    
    const category = await prisma.serviceCategory.update({
      where: { id: req.params.id },
      data,
    });
    
    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: (error as any).issues });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.serviceCategory.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
