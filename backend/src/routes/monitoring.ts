
import { Router } from 'express';
import { prisma } from '../prisma/index.js';

const router = Router();

// GET /health - Basic health check
router.get('/health', async (_req, res) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        database: 'UP',
        api: 'UP'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /metrics - Simple metrics for observability
router.get('/metrics', async (_req, res) => {
  try {
    const [
      userCount,
      providerCount,
      activeJobs,
      completedJobs,
      totalAuditLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.serviceProvider.count(),
      prisma.job.count({ where: { status: { notIn: ['CLOSED', 'CANCELLED', 'DELIVERED', 'REVIEWED'] } } }),
      prisma.job.count({ where: { status: { in: ['DELIVERED', 'REVIEWED', 'CLOSED'] } } }),
      // @ts-ignore
      prisma.auditLog.count()
    ]);

    res.json({
      users_total: userCount,
      providers_total: providerCount,
      jobs_active: activeJobs,
      jobs_completed: completedJobs,
      audit_logs_total: totalAuditLogs,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
