
import { invalidateAuthCache } from '../middlewares/requireAuth.js';
import { providerReviewQueueWhere, VISIBLE_PROVIDER_STATUSES } from '../lib/providerStatus.js';
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
      ratedAgg,
      visibleProviders,
      verifiedProviders,
      paidAgg,
      cancellations24h,
      selectedJobs
    ] = await Promise.all([
      prisma.serviceProvider.count(),
      prisma.serviceProvider.count({ where: providerReviewQueueWhere }),
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
      // Satisfaccion: promedio de las calificaciones reales de los servicios (no de prestadores sin notas)
      prisma.job.aggregate({ where: { rating: { not: null } }, _avg: { rating: true }, _count: { rating: true } }),
      prisma.serviceProvider.count({ where: { status: { in: [...VISIBLE_PROVIDER_STATUSES] } } }),
      prisma.serviceProvider.count({ where: { status: 'APPROVED' } }),
      // Ingresos reales: comprobantes pagados
      prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
      prisma.job.count({ where: { status: 'CANCELLED', updatedAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } } }),
      prisma.job.count({ where: { selectedQuoteId: { not: null } } }),
    ]);

    const totalJobs = await prisma.job.count();
    // Conversion: de las solicitudes que llegaron a ser un trabajo, cuantas terminaron con una cotizacion aceptada
    const conversionRate = totalJobs > 0 ? Math.round((selectedJobs / totalJobs) * 1000) / 10 : 0;

    res.json({
      summary: {
        totalProviders,
        visibleProviders,
        verifiedProviders,
        pendingProviders,
        activeJobsCount,
        totalRevenue: paidAgg._sum.total || 0,
        avgRating: ratedAgg._avg.rating || 0,
        ratedJobs: ratedAgg._count.rating || 0,
        totalJobs,
        conversionRate,
      },
      jobsByStatus,
      topCommunes: communeStats,
      issues: {
        cancellations,
        cancellations24h,
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/providers/pending - Revisión de flota nueva
router.get('/providers/pending', async (_req, res, next) => {
  try {
    const providers = await prisma.serviceProvider.findMany({
      where: providerReviewQueueWhere,
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

// POST /api/admin/providers/:id/reject - Rechazar vitrina (queda oculta, con motivo visible para el prestador)
router.post('/providers/:id/reject', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim().slice(0, 500) : '';
    if (!reason) {
      return res.status(400).json({ error: 'Indica el motivo del rechazo' });
    }

    const exists = await prisma.serviceProvider.findUnique({ where: { id: String(id) }, select: { id: true } });
    if (!exists) throw new NotFoundError('Proveedor no encontrado');

    const updated = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedBy: req.user!.email,
      },
    });

    await prisma.providerHistory.create({
      data: {
        providerId: String(id),
        action: 'REJECTED',
        description: reason,
        metadata: JSON.stringify({ adminId: req.user?.id }),
      },
    });

    await auditLog({
      userId: req.user?.id,
      action: 'REJECT_PROVIDER',
      resource: 'ServiceProvider',
      resourceId: String(id),
      newValue: reason,
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown'),
    });

    res.json({ message: 'Proveedor rechazado', provider: updated });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/audit - Ver rastro de auditoría
router.get('/audit', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit ?? '25'), 10) || 25));
    const action = typeof req.query.action === 'string' ? req.query.action.trim() : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const from = typeof req.query.from === 'string' && req.query.from ? new Date(req.query.from) : null;
    const to = typeof req.query.to === 'string' && req.query.to ? new Date(req.query.to) : null;
    if (to) to.setHours(23, 59, 59, 999); // "hasta" incluye todo ese dia

    const where: any = {};
    if (action) where.action = action;
    if (from && !Number.isNaN(from.getTime())) where.createdAt = { ...where.createdAt, gte: from };
    if (to && !Number.isNaN(to.getTime())) where.createdAt = { ...where.createdAt, lte: to };
    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { resource: { contains: search, mode: 'insensitive' } },
        { userId: { contains: search, mode: 'insensitive' } },
        { resourceId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // @ts-ignore
    const [total, logs, actionRows] = await Promise.all([
      // @ts-ignore
      prisma.auditLog.count({ where }),
      // @ts-ignore
      prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      // @ts-ignore
      prisma.auditLog.groupBy({ by: ['action'], _count: { _all: true }, orderBy: { action: 'asc' } }),
    ]);

    res.json({
      logs,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      actions: (actionRows as any[]).map((r) => r.action),
    });
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
      // Nunca devolver el hash de contraseña ni tokens de verificacion
      select: {
        id: true, name: true, email: true, phone: true, role: true, status: true,
        emailVerified: true, createdAt: true, updatedAt: true,
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
        // Nunca devolver el hash de contraseña ni tokens de verificacion al panel
        user: { select: { id: true, name: true, email: true, phone: true, role: true, status: true, emailVerified: true, createdAt: true } },
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
      include: { user: { select: { id: true, name: true, email: true, phone: true, role: true, status: true } } }
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

    // Reactivar restaura el estado previo: verificada si ya fue revisada, publicada si no.
    const current = await prisma.serviceProvider.findUnique({ where: { id: String(id) }, select: { reviewedAt: true } });
    if (!current) throw new NotFoundError('Proveedor no encontrado');
    const provider = await prisma.serviceProvider.update({
      where: { id: String(id) },
      data: { status: current.reviewedAt ? 'APPROVED' : 'ACTIVE' }
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


// POST /api/admin/users/:id/suspend - Suspender usuario por administrador
router.post('/users/:id/suspend', async (req, res, next) => {
  try {
    const { id } = req.params;
    invalidateAuthCache(String(id));
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { status: 'SUSPENDED' }
    });
    await prisma.serviceProvider.updateMany({
      where: { userId: String(id) },
      data: { status: 'SUSPENDED' }
    });
    await auditLog({
      userId: req.user?.id,
      action: 'SUSPEND_USER',
      resource: 'User',
      resourceId: String(id),
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });
    res.json({ message: 'Usuario suspendido exitosamente', user });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/users/:id/reactivate - Reactivar usuario
router.post('/users/:id/reactivate', async (req, res, next) => {
  try {
    const { id } = req.params;
    invalidateAuthCache(String(id));
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { status: 'ACTIVE' }
    });
    await auditLog({
      userId: req.user?.id,
      action: 'REACTIVATE_USER',
      resource: 'User',
      resourceId: String(id),
      ipAddress: req.ip,
      userAgent: String(req.headers['user-agent'] || 'unknown')
    });
    res.json({ message: 'Usuario reactivado exitosamente', user });
  } catch (error) {
    next(error);
  }
});

export default router;
