import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// Get user profile (with vehicles and job history)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
          orderBy: { createdAt: 'desc' }
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
router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      include: {
        vehicles: true,
        serviceRequests: {
            include: {
                service: true,
                vehicle: true,
                job: { include: { provider: { include: { user: true } } } }
            },
            orderBy: { createdAt: 'desc' }
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
