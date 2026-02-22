import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken as any);

// POST /api/quotes - Crear una nueva cotización (Solo Prestadores)
router.post('/', async (req: any, res) => {
  try {
    const {
      jobId,
      preliminaryDiagnosis,
      serviceItems,
      laborCost,
      partsCost,
      totalCost,
      estimatedDuration,
      warranty,
      paymentMethods,
      validUntil
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    // Verificar si el usuario es un proveedor
    const provider = await prisma.serviceProvider.findFirst({
      where: { userId }
    });

    if (!provider) {
      return res.status(403).json({ error: 'Solo los Prestadores pueden crear cotizaciones' });
    }

    // Validaciones
    if (!jobId || !totalCost) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (jobId, totalCost)' });
    }

    // Verificar si el job existe y está en estado válido
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job no encontrado' });

    // Verificar si ya existe una cotización de este proveedor para este job
    const existingQuote = await prisma.quote.findFirst({
      where: { jobId, providerId: provider.id }
    });

    if (existingQuote) {
      return res.status(400).json({ error: 'Ya has enviado una cotización para este trabajo' });
    }

    const quote = await prisma.quote.create({
      data: {
        jobId,
        providerId: provider.id,
        preliminaryDiagnosis: preliminaryDiagnosis || '',
        serviceItems: JSON.stringify(serviceItems || []),
        laborCost: laborCost || 0,
        partsCost: partsCost || 0,
        totalCost,
        estimatedDuration: estimatedDuration || 60,
        warranty: warranty || 'Sin garantía',
        paymentMethods: paymentMethods || 'CASH',
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs por defecto
        status: 'SENT'
      }
    });

    // Actualizar estado del job a QUOTING si no lo está
    if (job.status === 'SEARCHING' || job.status === 'PENDING') {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'QUOTING', quotedAt: new Date() }
      });
    }

    return res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    return res.status(500).json({ error: 'Error al crear cotización' });
  }
});

// GET /api/quotes/provider/me - Obtener todas las cotizaciones enviadas por el proveedor actual
router.get('/provider/me', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const provider = await prisma.serviceProvider.findFirst({ where: { userId } });
    if (!provider) return res.status(403).json({ error: 'Usuario no es proveedor' });

    const quotes = await prisma.quote.findMany({
      where: { providerId: provider.id },
      include: {
        job: {
          include: {
            request: {
              include: {
                vehicle: true,
                service: true,
                user: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching provider quotes:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// GET /api/quotes/user/me - Obtener todas las cotizaciones recibidas por el cliente actual
router.get('/user/me', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const quotes = await prisma.quote.findMany({
      where: {
        job: {
          request: {
            userId: userId
          }
        }
      },
      include: {
        job: {
          include: {
            request: {
              include: {
                vehicle: true,
                service: true
              }
            }
          }
        },
        provider: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    res.status(500).json({ error: 'Error al obtener tus cotizaciones' });
  }
});

// GET /api/quotes/marketplace - Obtener trabajos disponibles para cotizar (Solo Prestadores)
router.get('/marketplace', async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findFirst({ where: { userId } });
    if (!provider) return res.status(403).json({ error: 'Solo Prestadores pueden acceder al marketplace' });

    // Buscar jobs que estén en estado PENDING o SEARCHING (que necesiten cotización)
    // Y que el proveedor aún no haya cotizado
    const jobs = await prisma.job.findMany({
      where: {
        status: { in: ['PENDING', 'SEARCHING', 'QUOTING'] },
        quotes: {
          none: { providerId: provider.id }
        }
      },
      include: {
        request: {
          include: {
            service: true,
            vehicle: true,
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes disponibles' });
  }
});

// GET /api/quotes/job/:jobId - Obtener todas las cotizaciones de un job
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const quotes = await prisma.quote.findMany({
      where: { jobId },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// GET /api/quotes/:id - Obtener una cotización específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        job: true,
        provider: { include: { user: { select: { name: true, email: true } } } }
      }
    });

    if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
});

// PUT /api/quotes/:id - Actualizar una cotización (Solo si está en estado SENT)
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // Verificar propiedad
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: { provider: true }
    });

    if (!existingQuote) return res.status(404).json({ error: 'Cotización no encontrada' });

    // Verificar que el usuario sea el dueño de la cotización (a través del provider)
    if (existingQuote.provider.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta cotización' });
    }

    if (existingQuote.status !== 'SENT') {
      return res.status(400).json({ error: 'No se puede editar una cotización que ya fue respondida' });
    }

    const {
      preliminaryDiagnosis,
      serviceItems,
      laborCost,
      partsCost,
      totalCost,
      estimatedDuration,
      warranty,
      paymentMethods,
      validUntil
    } = req.body;

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        preliminaryDiagnosis,
        serviceItems: serviceItems ? JSON.stringify(serviceItems) : undefined,
        laborCost,
        partsCost,
        totalCost,
        estimatedDuration,
        warranty,
        paymentMethods,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        updatedAt: new Date()
      }
    });

    res.json(updatedQuote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Error al actualizar cotización' });
  }
});

// POST /api/quotes/:id/accept - Aceptar una cotización
router.post('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Actualizar la cotización a ACCEPTED
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date()
      }
    });

    // Rechazar las demás cotizaciones del mismo job
    await prisma.quote.updateMany({
      where: {
        jobId: quote.jobId,
        id: { not: id }
      },
      data: { status: 'REJECTED' }
    });

    // Actualizar el job
    await prisma.job.update({
      where: { id: quote.jobId },
      data: {
        status: 'CONFIRMED',
        selectedQuoteId: id,
        providerId: quote.providerId,
        estimatedCost: quote.totalCost,
        confirmedAt: new Date()
      }
    });

    res.json(updatedQuote);
  } catch (error) {
    console.error('Error accepting quote:', error);
    res.status(500).json({ error: 'Error al aceptar cotización' });
  }
});

// POST /api/quotes/:id/reject - Rechazar una cotización
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: 'REJECTED',
        respondedAt: new Date()
      }
    });

    res.json(quote);
  } catch (error) {
    console.error('Error rejecting quote:', error);
    res.status(500).json({ error: 'Error al rechazar cotización' });
  }
});

// DELETE /api/quotes/:id - Eliminar una cotización (solo si no ha sido aceptada)
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { provider: true }
    });

    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Verificar propiedad (o admin)
    if (quote.provider.userId !== userId && req.user?.role !== 'ADMIN') {
       return res.status(403).json({ error: 'No autorizado para eliminar esta cotización' });
    }

    if (quote.status === 'ACCEPTED') {
      return res.status(400).json({ error: 'No se puede eliminar una cotización aceptada' });
    }

    await prisma.quote.delete({
      where: { id }
    });

    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Error al eliminar cotización' });
  }
});

export default router;
