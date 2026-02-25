
import { Router } from 'express';
import { prisma } from '../db.js';
import { Prisma } from '@prisma/client';
import { requireAuth, requireRole } from '../middlewares/requireAuth.js';
import { auditLog } from '../lib/audit.js';
import { AuthRequest } from '../middlewares/requireAuth.js';
import { NotFoundError } from '../lib/httpErrors.js';

const router = Router();

// Proteger todas las rutas de admin
router.use(requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']));

// GET /api/admin/stats - Panel de Control Total (KPIs)
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const [
      totalProviders,
      pendingProviders,
      activeJobsCount,
      jobsByStatus,
      communeStats,
      cancellations,
      avgRating
    ] = await Promise.all([
      prisma.serviceProvider.count(),
      prisma.serviceProvider.count({ where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
      prisma.job.count({ where: { status: { notIn: ['CLOSED', 'CANCELLED', 'REVIEWED'] } } }),
      prisma.job.groupBy({
        by: ['status'],
        _count: { _all: true }
      }),
      prisma.serviceProvider.groupBy({
        by: ['commune'],
        where: { commune: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { commune: 'desc' } },
        take: 5
      }),
      prisma.job.count({ where: { status: 'CANCELLED' } }),
      prisma.serviceProvider.aggregate({
        _avg: { rating: true }
      })
    ]);

    const totalRequests = await prisma.serviceRequest.count();
    const totalJobs = await prisma.job.count();
    const acceptanceRate = totalRequests > 0 ? (totalJobs / totalRequests) * 100 : 0;

    res.json({
      summary: {
        totalProviders,
        pendingProviders,
        activeJobsCount,
        totalRevenue: 0,
        avgRating: avgRating._avg.rating || 0,
        acceptanceRate: acceptanceRate.toFixed(2) + '%'
      },
      jobsByStatus,
      topCommunes: communeStats,
      issues: {
        cancellations
      }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'VIEW_ADMIN_STATS',
      resource: 'Dashboard',
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/providers/pending - Revisión de flota nueva
router.get('/providers/pending', async (_req, res, next) => {
  try {
    const providers = await prisma.serviceProvider.findMany({
      where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(providers);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/jobs/:id/timeline - Ver detalle técnico y eventos
router.get('/jobs/:id/timeline', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: String(id) },
      include: {
        request: { include: { service: true, vehicle: true, user: { select: { name: true } } } },
        provider: { include: { user: { select: { name: true } } } },
        // @ts-ignore
        events: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!job) throw new NotFoundError('Job no encontrado');
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/providers/:id/approve - Aprobar técnico
router.post('/providers/:id/approve', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const provider = await prisma.serviceProvider.findUnique({
       where: { id: String(id) },
       include: { user: true }
    });

    if (!provider) throw new NotFoundError('Proveedor no encontrado');

    const updated = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: req.user!.email,
        trustScore: 50.0
      }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'APPROVE_PROVIDER',
      resource: 'ServiceProvider',
      resourceId: String(id),
      newValue: updated,
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });

    res.json({ message: 'Proveedor aprobado', provider: updated });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/audit - Ver rastro de auditoría
router.get('/audit', async (_req, res, next) => {
  try {
    // @ts-ignore
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users - Lista de usuarios para gestión
router.get('/users', async (req, res, next) => {
  try {
    const { search, role, page = '1', limit = '50' } = req.query;

    const where: Prisma.UserWhereInput = {};
    if (role && role !== 'ALL') {
      where.role = { equals: String(role) };
    }
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        _count: { select: { serviceRequests: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/providers - Todos los Prestadores con filtros
router.get('/providers', async (req, res, next) => {
  try {
    const { status, type, search, page = '1', limit = '20' } = req.query;
    
    const where: Prisma.ServiceProviderWhereInput = {};
    
    if (status && status !== 'ALL') {
      where.status = { equals: String(status) };
    }
    
    if (type) {
      where.type = { equals: String(type) };
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: String(search) } } },
        { user: { email: { contains: String(search) } } },
        { rut: { contains: String(search) } },
        { commune: { contains: String(search) } }
      ];
    }

    const [providers, total] = await Promise.all([
      prisma.serviceProvider.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          subscription: true,
          _count: { select: { jobs: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit)
      }),
      prisma.serviceProvider.count({ where })
    ]);

    res.json({
      providers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/providers/:id - Detalle de proveedor
router.get('/providers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: String(id) },
      include: {
        user: true,
        subscription: true,
        categories: { include: { category: true } },
        zones: { include: { zone: true } },
        availability: true,
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { request: { include: { service: true, vehicle: true } } }
        },
        history: { orderBy: { createdAt: 'desc' }, take: 20 },
        _count: { select: { jobs: true, quotes: true } }
      }
    });

    if (!provider) throw new NotFoundError('Proveedor no encontrado');

    res.json(provider);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/providers/:id - Actualizar proveedor
router.patch('/providers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trustScore, type, bio, commune, region } = req.body;

    const provider = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: {
        ...(status && { status }),
        ...(trustScore !== undefined && { trustScore }),
        ...(type && { type }),
        ...(bio !== undefined && { bio }),
        ...(commune !== undefined && { commune }),
        ...(region !== undefined && { region })
      },
      include: { user: true }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'UPDATE_PROVIDER',
      resource: 'ServiceProvider',
      resourceId: String(id),
      newValue: JSON.stringify(req.body),
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });

    res.json(provider);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/providers/:id/suspend - Suspender proveedor
router.post('/providers/:id/suspend', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const provider = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: { status: 'SUSPENDED' }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: String(id),
        action: 'SUSPENDED',
        description: reason || 'Suspendido por administrador',
        metadata: JSON.stringify({ adminId: req.user?.id })
      }
    });

    await auditLog({
      userId: req.user?.id,
      action: 'SUSPEND_PROVIDER',
      resource: 'ServiceProvider',
      resourceId: String(id),
      newValue: reason || 'Unknown reason',
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });

    res.json({ message: 'Proveedor suspendido', provider });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/providers/:id/reactivate - Reactivar proveedor
router.post('/providers/:id/reactivate', async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: { status: 'APPROVED' }
    });

    await prisma.providerHistory.create({
      data: {
        providerId: String(id),
        action: 'REACTIVATED',
        description: 'Reactivado por administrador',
        metadata: JSON.stringify({ adminId: req.user?.id })
      }
    });

    res.json({ message: 'Proveedor reactivado', provider });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/subscriptions - Todas las suscripciones
router.get('/subscriptions', async (req, res, next) => {
  try {
    const { status, plan, page = '1', limit = '20' } = req.query;
    
    const where: Prisma.SubscriptionWhereInput = {};
    if (status && status !== 'ALL') where.status = { equals: String(status) };
    if (plan) where.plan = { equals: String(plan) };

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          provider: {
            include: { user: { select: { name: true, email: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit)
      }),
      prisma.subscription.count({ where })
    ]);

    res.json({
      subscriptions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/zones - Todas las zonas
router.get('/zones', async (_req, res, next) => {
  try {
    const zones = await prisma.zone.findMany({
      include: {
        _count: { select: { providers: true, jobs: true } },
        parent: true,
        children: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(zones);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/categories - Todas las categorías
router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        _count: { select: { services: true, providers: true } }
      },
      orderBy: { sortOrder: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/jobs - Todos los trabajos con filtros
router.get('/jobs', async (req, res, next) => {
  try {
    const { status, providerId, userId, page = '1', limit = '20' } = req.query;
    
    const where: Prisma.JobWhereInput = {};
    if (status && status !== 'ALL') where.status = { equals: String(status) };
    if (providerId) where.providerId = { equals: String(providerId) };
    if (userId) where.request = { is: { userId: String(userId) } };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          request: { include: { service: true, vehicle: true, user: { select: { name: true } } } },
          provider: { include: { user: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit)
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/launch-leads - Ver todos los registros de preventa
router.get('/launch-leads', async (req: AuthRequest, res, next) => {
  try {
    const leads = await prisma.launchLead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      leads,
      total: leads.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/launch-leads/stats - Estadísticas de leads
router.get('/launch-leads/stats', async (req: AuthRequest, res, next) => {
  try {
    const total = await prisma.launchLead.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.launchLead.count({
      where: { createdAt: { gte: today } }
    });

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekCount = await prisma.launchLead.count({
      where: { createdAt: { gte: thisWeek } }
    });

    res.json({
      total,
      today: todayCount,
      thisWeek: weekCount
    });
  } catch (error) {
    next(error);
  }
});

export default router;
