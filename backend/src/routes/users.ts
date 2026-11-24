import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';
import { generateTokens, COOKIE_SAMESITE } from '../utils/auth.js';
import { invalidateAuthCache } from '../middlewares/requireAuth.js';
import { withUtc } from '../lib/pgJson.js';

const router = Router();

const isAdmin = (role?: string) => role === 'ADMIN' || role === 'SUPER_ADMIN';

// Nunca devolver hashes ni tokens de verificacion
const publicUser = (user: any) => {
  if (!user) return user;
  const { password: _p, emailVerificationToken: _t, emailVerificationExpiresAt: _e, ...safe } = user;
  return safe;
};

// Datos del perfil con vehiculos e historial. El prestador solo expone su nombre (no su cuenta completa).
const profileInclude = {
  vehicles: { orderBy: { createdAt: 'asc' as const } },
  serviceRequests: {
    include: {
      service: true,
      vehicle: true,
      job: {
        include: {
          provider: { select: { id: true, businessName: true, phone: true, user: { select: { name: true } } } },
          quotes: { select: { id: true, status: true } },
        },
      },
    },
    orderBy: [{ createdAt: 'desc' as const }],
  },
};

// POST /api/users/me/vehicles - Registrar un vehiculo propio
router.post('/me/vehicles', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const make = String(req.body?.make ?? '').trim().slice(0, 60);
    const model = String(req.body?.model ?? '').trim().slice(0, 60);
    const year = Number.parseInt(String(req.body?.year ?? ''), 10);
    const plateRaw = String(req.body?.licensePlate ?? '').trim().toUpperCase();
    const licensePlate = plateRaw ? plateRaw.replace(/[^A-Z0-9-]/g, '').slice(0, 10) : null;

    if (!make || !model) return res.status(400).json({ error: 'Indica la marca y el modelo del vehículo' });
    const maxYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1950 || year > maxYear) {
      return res.status(400).json({ error: `El año debe estar entre 1950 y ${maxYear}` });
    }

    const count = await prisma.vehicle.count({ where: { userId: req.user!.id } });
    if (count >= 10) return res.status(400).json({ error: 'Alcanzaste el máximo de 10 vehículos' });

    const vehicle = await prisma.vehicle.create({
      data: { userId: req.user!.id, make, model, year, licensePlate },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'No se pudo guardar el vehículo' });
  }
});

// DELETE /api/users/me/vehicles/:id - Eliminar un vehiculo propio (si no tiene solicitudes)
router.delete('/me/vehicles/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: String(req.params.id) },
      include: { _count: { select: { requests: true } } },
    });
    if (!vehicle || vehicle.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    if (vehicle._count.requests > 0) {
      return res.status(409).json({ error: 'Este vehículo tiene solicitudes en tu historial y no se puede eliminar.' });
    }
    await prisma.vehicle.delete({ where: { id: vehicle.id } });
    res.json({ message: 'Vehículo eliminado' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'No se pudo eliminar el vehículo' });
  }
});

// GET /api/users/me/panel - Todo el panel del cliente en UNA consulta (antes: 3 endpoints y ~15 consultas en serie)
router.get('/me/panel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const rows = await prisma.$queryRaw<Array<{ data: any }>>`
      SELECT jsonb_build_object(
        'user', (
          SELECT (to_jsonb(u) - 'password' - 'emailVerificationToken' - 'emailVerificationExpiresAt') || jsonb_build_object(
            'vehicles', COALESCE((SELECT jsonb_agg(to_jsonb(v) ORDER BY v."createdAt") FROM "Vehicle" v WHERE v."userId" = u.id), '[]'::jsonb),
            'serviceRequests', COALESCE((
              SELECT jsonb_agg(x.row ORDER BY x."createdAt" DESC) FROM (
                SELECT r."createdAt",
                       to_jsonb(r) || jsonb_build_object(
                         'service', to_jsonb(sv),
                         'vehicle', to_jsonb(v2),
                         'job', (
                           SELECT to_jsonb(j) || jsonb_build_object(
                             'provider', jsonb_build_object('id', p.id, 'businessName', p."businessName", 'phone', p.phone,
                                                            'user', jsonb_build_object('name', pu.name)),
                             'quotes', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', q.id, 'status', q.status))
                                                 FROM "Quote" q WHERE q."jobId" = j.id), '[]'::jsonb))
                           FROM "Job" j
                           JOIN "ServiceProvider" p ON p.id = j."providerId"
                           JOIN "User" pu ON pu.id = p."userId"
                           WHERE j."requestId" = r.id)
                       ) AS row
                FROM "ServiceRequest" r
                LEFT JOIN "Service" sv ON sv.id = r."serviceId"
                LEFT JOIN "Vehicle" v2 ON v2.id = r."vehicleId"
                WHERE r."userId" = u.id
                ORDER BY r."createdAt" DESC LIMIT 100
              ) x), '[]'::jsonb)
          )
          FROM "User" u WHERE u.id = ${userId}
        ),
        'quotes', COALESCE((
          SELECT jsonb_agg(x.row ORDER BY x."createdAt" DESC) FROM (
            SELECT q."createdAt",
                   to_jsonb(q) || jsonb_build_object(
                     'job', to_jsonb(j) || jsonb_build_object('request',
                              to_jsonb(r) || jsonb_build_object('vehicle', to_jsonb(v), 'service', to_jsonb(sv))),
                     -- Solo datos publicos del prestador: nunca RUT, documentos ni cuenta.
                     'provider', jsonb_build_object('id', p.id, 'type', p.type, 'businessName', p."businessName", 'experience', p.experience,
                                                    'rating', p.rating, 'completedJobs', p."completedJobs", 'commune', p.commune,
                                                    'region', p.region, 'phone', p.phone, 'status', p.status,
                                                    'user', jsonb_build_object('name', pu.name))) AS row
            FROM "Quote" q
            JOIN "Job" j ON j.id = q."jobId"
            JOIN "ServiceRequest" r ON r.id = j."requestId"
            LEFT JOIN "Vehicle" v ON v.id = r."vehicleId"
            LEFT JOIN "Service" sv ON sv.id = r."serviceId"
            JOIN "ServiceProvider" p ON p.id = q."providerId"
            JOIN "User" pu ON pu.id = p."userId"
            WHERE r."userId" = ${userId}
            ORDER BY q."createdAt" DESC LIMIT 100
          ) x), '[]'::jsonb),
        'invoices', COALESCE((
          SELECT jsonb_agg(to_jsonb(i) ORDER BY i."createdAt" DESC)
          FROM (SELECT * FROM "Invoice" WHERE "userId" = ${userId} ORDER BY "createdAt" DESC LIMIT 100) i
        ), '[]'::jsonb)
      ) AS data
    `;

    const data = rows?.[0]?.data ? withUtc(rows[0].data) : null;
    if (!data?.user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.set('Cache-Control', 'private, no-store');
    return res.json(data);
  } catch (error) {
    console.error('Client panel error:', error);
    return res.status(500).json({ error: 'No se pudo cargar tu panel' });
  }
});

// GET /api/users/me/invoices - Comprobantes de pagos del cliente
router.get('/me/invoices', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'No se pudieron cargar los comprobantes' });
  }
});

// POST /api/users/me/password - Cambiar contraseña (exige la actual)
router.post('/me/password', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword ?? '');
    const newPassword = String(req.body?.newPassword ?? '');

    if (newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener entre 8 y 128 caracteres' });
    }
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(400).json({ error: 'La nueva contraseña debe incluir letras y números' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const stored = user.password || '';
    const valid = stored.startsWith('$2') ? await bcrypt.compare(currentPassword, stored) : stored === currentPassword;
    if (!valid) return res.status(400).json({ error: 'La contraseña actual no es correcta' });
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'La nueva contraseña debe ser distinta de la actual' });
    }

    const updated = await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 10) } });

    // Las demas sesiones (refresh tokens con la huella anterior) quedan invalidadas; esta se renueva.
    const tokens = generateTokens(updated.id, updated.password);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: COOKIE_SAMESITE,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Contraseña actualizada', token: tokens.accessToken });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'No se pudo cambiar la contraseña' });
  }
});

// Get user profile (with vehicles and job history)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;

    if (req.user?.id !== userId && !isAdmin(req.user?.role)) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para acceder a este perfil' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      include: profileInclude,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(publicUser(user));
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile. El correo NO se cambia desde aqui (requeriria verificarlo); solo un administrador puede.
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = String(req.params.id);

    if (req.user?.id !== userId && !isAdmin(req.user?.role)) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para modificar este perfil' });
    }

    const data: { name?: string; phone?: string | null; email?: string } = {};

    if (req.body?.name !== undefined) {
      const name = String(req.body.name).trim();
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
      }
      data.name = name;
    }

    if (req.body?.phone !== undefined) {
      const phone = String(req.body.phone ?? '').trim();
      if (phone === '') {
        data.phone = null;
      } else if (!/^\+?[\d\s()-]{8,20}$/.test(phone)) {
        return res.status(400).json({ error: 'El teléfono no es válido' });
      } else {
        data.phone = phone;
      }
    }

    if (req.body?.email !== undefined && isAdmin(req.user?.role)) {
      const email = String(req.body.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }
      const taken = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' }, NOT: { id: userId } } });
      if (taken) return res.status(409).json({ error: 'Ese correo ya está asociado a otra cuenta' });
      data.email = email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      include: profileInclude,
    });

    res.json(publicUser(updatedUser));
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// DELETE /api/users/me/deactivate - Dar de baja mi propia cuenta
router.delete('/me/deactivate', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    // No se puede cerrar la cuenta con servicios en curso ni pagos en custodia: dejaria a la otra parte sin respuesta.
    const IN_PROGRESS = ['CONFIRMED', 'PROVIDER_EN_ROUTE', 'PROVIDER_ARRIVED', 'DIAGNOSING', 'IN_PROGRESS', 'WORK_COMPLETED'];
    const blocking = await prisma.job.count({
      where: {
        AND: [
          { OR: [{ customerId: userId }, { provider: { userId } }] },
          { OR: [{ status: { in: IN_PROGRESS } }, { paymentStatus: 'HELD' }] },
          { status: { notIn: ['CANCELLED', 'CLOSED', 'REFUNDED'] } },
        ],
      },
    });
    if (blocking > 0) {
      return res.status(409).json({ error: 'Tienes servicios en curso o pagos en custodia. Finalízalos o cancélalos antes de cerrar tu cuenta.' });
    }

    const timestamp = Date.now();
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          status: 'DELETED',
          email: 'deleted_' + timestamp + '_' + req.user!.email,
          name: 'Usuario dado de baja',
          phone: null
        }
      });

      await tx.serviceProvider.updateMany({
        where: { userId },
        data: { status: 'SUSPENDED' }
      });
    });

    invalidateAuthCache(userId);
    res.clearCookie('refresh_token');
    res.json({ message: 'Tu cuenta ha sido dada de baja exitosamente.' });
  } catch (error: any) {
    console.error('Error al dar de baja cuenta:', error);
    res.status(500).json({ error: 'Error al procesar la baja de la cuenta' });
  }
});

export default router;
