import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user profile (with vehicles and job history)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para acceder a este perfil' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        vehicles: true,
        serviceRequests: {
          include: {
            service: true,
            vehicle: true,
            job: {
              include: {
                provider: {
                    include: { user: true }
                }
              }
            }
          },
            orderBy: [{ createdAt: 'desc' }]
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform data for frontend if necessary, or just send proper JSON
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    if (req.user?.id !== userId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para modificar este perfil' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId as string },
      data: { name, email },
      include: {
        vehicles: true,
        serviceRequests: {
            include: {
                service: true,
                vehicle: true,
                job: { include: { provider: { include: { user: true } } } }
            },
              orderBy: [{ createdAt: 'desc' }]
        }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;
