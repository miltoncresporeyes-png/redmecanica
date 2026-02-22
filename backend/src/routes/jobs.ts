
import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { auditLog } from '../lib/audit.js';
import { AuthRequest } from '../middlewares/requireAuth.js';
import { validate } from '../middlewares/validate.js';
import { createJobSchema, updateJobStatusSchema, rateJobSchema } from '../modules/jobs/jobs.schemas.js';
import { ForbiddenError, NotFoundError, BadRequestError } from '../lib/httpErrors.js';

const router = Router();

// Helper to check job access
async function checkJobAccess(jobId: string, userId: string, role: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      request: { select: { userId: true } },
      provider: { select: { userId: true } }
    }
  });

  if (!job) throw new NotFoundError('Job no encontrado');

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return job;
  if (job.request.userId === userId) return job;
  if (job.provider.userId === userId) return job;

  throw new ForbiddenError('No tienes permiso para acceder a este job');
}

// POST /api/jobs - Create a new job
router.post('/', requireAuth, validate(createJobSchema), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id; 
    const { vehicleId, serviceId, providerId, problemDescription, damagePhoto } = req.body;

    let finalVehicleId = vehicleId || null;

    if (finalVehicleId) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: String(finalVehicleId) } });
      if (!vehicle || vehicle.userId !== userId) {
        throw new BadRequestError('El vehiculo no pertenece al usuario o no existe');
      }
    } else {
      const fallbackVehicle = await prisma.vehicle.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
      if (fallbackVehicle) {
        finalVehicleId = fallbackVehicle.id;
      }
    }

    if (!finalVehicleId) {
      throw new BadRequestError('Debes registrar un vehiculo antes de crear una solicitud.');
    }

    let finalServiceId = serviceId || null;
    if (finalServiceId) {
      const service = await prisma.service.findUnique({ where: { id: String(finalServiceId) } });
      if (!service) {
        throw new BadRequestError('El servicio seleccionado no existe');
      }
    } else {
      const fallbackService = await prisma.service.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });
      if (!fallbackService) {
        throw new BadRequestError('No hay servicios activos disponibles');
      }
      finalServiceId = fallbackService.id;
    }

    // Default provider if none selected
    let finalProviderId = providerId;
    if (!finalProviderId) {
      const provider = await prisma.serviceProvider.findFirst({
        where: { status: { in: ['APPROVED', 'ACTIVE'] } },
        orderBy: { createdAt: 'asc' }
      });
      finalProviderId = provider?.id;
    }

    if (!finalProviderId) {
       throw new BadRequestError('No hay Prestadores disponibles en este momento');
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId,
        vehicleId: String(finalVehicleId),
        serviceId: String(finalServiceId),
        problemDescription,
        damagePhoto,
        status: "PENDING"
      }
    });

    const job = await prisma.job.create({
      data: {
        requestId: serviceRequest.id,
        customerId: userId,
        providerId: finalProviderId,
        status: "SEARCHING",
        etaMinutes: 15
      },
      include: {
        request: { include: { service: true, vehicle: true } },
        provider: { include: { user: true } }
      }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'CREATE_JOB',
      resource: 'Job',
      resourceId: job.id,
      newValue: job,
      ipAddress: req.ip,
      userAgent: (req.headers['user-agent'] as string) || undefined
    });

    // @ts-ignore
    await prisma.jobEvent.create({
      data: {
        jobId: job.id,
        status: job.status,
        description: 'Servicio iniciado y técnico asignado.',
        metadata: JSON.stringify({ eta: job.etaMinutes })
      }
    });

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs - List jobs for current user/provider/admin
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;

    const where =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? {}
        : {
            OR: [
              { customerId: user.id },
              { provider: { userId: user.id } }
            ]
          };

    const jobs = await prisma.job.findMany({
      where,
      include: {
        request: { include: { service: true, vehicle: true } },
        provider: { include: { user: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id - Get job status
router.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await checkJobAccess(String(req.params.id), req.user!.id, req.user!.role);

    const job = await prisma.job.findUnique({
      where: { id: String(req.params.id) },
      include: {
        request: { include: { service: true, vehicle: true } },
        provider: { include: { user: true } },
        // @ts-ignore
        events: { orderBy: { createdAt: 'desc' } }
      }
    });
    
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/jobs/:id/status - Actualizar estado del job
router.patch('/:id/status', requireAuth, validate(updateJobStatusSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, metadata } = req.body;

    await checkJobAccess(String(id), req.user!.id, req.user!.role);

    if (req.user!.role === 'USER' && status !== 'CANCELLED') {
      throw new ForbiddenError('Los clientes solo pueden cancelar solicitudes.');
    }

    const updateData: any = { status };

    switch (status) {
      case 'CONFIRMED':
        updateData.confirmedAt = new Date();
        break;
      case 'PROVIDER_EN_ROUTE':
        if (metadata?.estimatedArrival) {
          updateData.estimatedArrival = new Date(metadata.estimatedArrival);
        }
        break;
      case 'IN_PROGRESS':
        updateData.startedAt = new Date();
        break;
      case 'WORK_COMPLETED':
        updateData.completedAt = new Date();
        break;
      case 'DELIVERED':
        updateData.deliveredAt = new Date();
        break;
      case 'REVIEWED':
        updateData.reviewedAt = new Date();
        if (metadata?.rating) updateData.rating = metadata.rating;
        if (metadata?.review) updateData.review = metadata.review;
        break;
      case 'CLOSED':
        updateData.closedAt = new Date();
        break;
    }

    const job = await prisma.job.update({
      where: { id: String(id) },
      data: updateData,
      include: {
        request: true,
        provider: { include: { user: true } }
      }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'UPDATE_JOB_STATUS',
      resource: 'Job',
      resourceId: String(id),
      newValue: { status },
      ipAddress: req.ip,
      userAgent: (req.headers['user-agent'] as string) || undefined
    });

    // @ts-ignore
    await prisma.jobEvent.create({
      data: {
        jobId: job.id,
        status: job.status,
        description: `Estado cambiado a ${status}`,
        metadata: JSON.stringify(metadata || {})
      }
    });

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/jobs/:id/advance - Advance to next logical status
router.patch('/:id/advance', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await checkJobAccess(String(id), req.user!.id, req.user!.role);

    const current = await prisma.job.findUnique({ where: { id: String(id) } });
    if (!current) throw new NotFoundError('Job no encontrado');

    const nextByStatus: Record<string, string> = {
      SEARCHING: 'QUOTING',
      QUOTING: 'COMPARING_QUOTES',
      COMPARING_QUOTES: 'CONFIRMED',
      CONFIRMED: 'PROVIDER_EN_ROUTE',
      PROVIDER_EN_ROUTE: 'PROVIDER_ARRIVED',
      PROVIDER_ARRIVED: 'DIAGNOSING',
      DIAGNOSING: 'IN_PROGRESS',
      IN_PROGRESS: 'WORK_COMPLETED',
      WORK_COMPLETED: 'DELIVERED',
      DELIVERED: 'REVIEWED',
      REVIEWED: 'CLOSED'
    };

    const nextStatus = nextByStatus[current.status];
    if (!nextStatus) {
      throw new BadRequestError(`No existe un siguiente estado para ${current.status}`);
    }

    const updated = await prisma.job.update({
      where: { id: String(id) },
      data: { status: nextStatus },
      include: {
        request: { include: { service: true, vehicle: true } },
        provider: { include: { user: true } }
      }
    });

    await prisma.jobEvent.create({
      data: {
        jobId: updated.id,
        status: updated.status,
        description: `Estado avanzado automaticamente a ${updated.status}`,
        metadata: JSON.stringify({ by: req.user!.id })
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs/:id/cancel - Cancelar un job
router.post('/:id/cancel', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await checkJobAccess(String(id), req.user!.id, req.user!.role);

    const job = await prisma.job.update({
      where: { id: String(id) },
      data: { status: 'CANCELLED' },
      include: {
        request: true,
        provider: { include: { user: true } }
      }
    });

    // @ts-ignore
    await prisma.jobEvent.create({
      data: {
        jobId: job.id,
        status: 'CANCELLED',
        description: 'Servicio cancelado.',
        metadata: JSON.stringify({ cancelledBy: req.user!.role })
      }
    });

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs/:id/rate - Calificar un job completado
router.post('/:id/rate', requireAuth, validate(rateJobSchema), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const job = await checkJobAccess(String(id), req.user!.id, req.user!.role);
    
    if (job.status !== 'WORK_COMPLETED' && job.status !== 'DELIVERED') {
      throw new BadRequestError('Solo se pueden calificar trabajos finalizados');
    }

    const updatedJob = await prisma.job.update({
      where: { id: String(id) },
      data: {
        status: 'REVIEWED',
        rating,
        review: review || null,
        reviewedAt: new Date()
      },
      include: {
        request: true,
        provider: { include: { user: true } }
      }
    });

    // @ts-ignore
    await prisma.jobEvent.create({
      data: {
        jobId: updatedJob.id,
        status: 'REVIEWED',
        description: `Servicio calificado con ${rating} estrellas.`,
        metadata: JSON.stringify({ rating, review })
      }
    });

    const allJobsForProvider = await prisma.job.findMany({
      where: {
        providerId: job.providerId,
        rating: { not: null }
      },
      select: { rating: true }
    });

    const avgRating = allJobsForProvider.length > 0 
      ? allJobsForProvider.reduce((sum, j) => sum + (j.rating || 0), 0) / allJobsForProvider.length
      : rating;

    await prisma.serviceProvider.update({
      where: { id: job.providerId },
      data: { rating: avgRating }
    });

    res.json(updatedJob);
  } catch (error) {
    next(error);
  }
});

export default router;
