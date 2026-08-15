import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth as authenticateToken, AuthRequest } from '../middlewares/requireAuth.js';
import { validarRUT } from '../utils/rutValidator.js';

const router = Router();

// Estado de plataforma: demo mientras no existan prestadores reales inscritos
router.get('/demo-status', async (_req, res) => {
  try {
    const realProviderCount = await prisma.serviceProvider.count({
      where: { isDemo: false },
    });

    return res.json({
      demoMode: realProviderCount === 0,
      realProviderCount,
    });
  } catch (error) {
    console.error('Error fetching demo status:', error);
    return res.status(500).json({ error: 'Failed to fetch platform status' });
  }
});

// Search providers by location and type
router.get('/search', async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const rad = parseFloat((radius as string) || '10'); // km

    // Basic "bounding box" or approximate query since Prisma doesn't support PostGIS natively without raw SQL
    // 1 deg lat ~= 111km
    // 1 deg lng ~= 111km * cos(lat)
    const latDelta = rad / 111;
    const lngDelta = rad / (111 * Math.cos(latitude * (Math.PI / 180)));

    const whereClause: any = {
      status: 'ACTIVE',
      subscription: {
        status: 'ACTIVE'
      },
      latitude: {
        gte: latitude - latDelta,
        lte: latitude + latDelta
      },
      longitude: {
        gte: longitude - lngDelta,
        lte: longitude + lngDelta
      }
    };

    if (type) {
      whereClause.type = type;
    }

    if (req.query.certified === 'true') {
      whereClause.emailVerified = true;
    }

    const providers = await prisma.serviceProvider.findMany({
      where: whereClause,
      include: { user: true }
    });

    // Precise distance AND Specialty filtering
    const results = (providers as any[]).map(p => {
      if (!p.latitude || !p.longitude) return null;
      
      const dist = getDistanceFromLatLonInKm(latitude, longitude, p.latitude, p.longitude);
      
      // Filtro por especialidades (si se solicitan)
      if (req.query.specialties) {
        const searchSpecs = (req.query.specialties as string).split(',').map((s: string) => s.trim().toLowerCase());
        const providerSpecs = (p.specialties || '').split(',').map((s: string) => s.trim().toLowerCase());
        
        const matches = searchSpecs.some((s: string) => providerSpecs.includes(s));
        if (!matches) return null;
      }

      return { ...p, distance: dist };
    })
    .filter(p => p !== null && p.distance <= rad)
    .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));

    return res.json(results);
  } catch (error) {
    console.error("Error searching providers:", error);
    return res.status(500).json({ error: 'Failed to search providers' });
  }
});

// Helper function for Haversine distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

// Get provider profile
router.get('/:id', async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        jobs: true
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    return res.json(provider);
  } catch (error) {
    console.error("Error fetching provider:", error);
    return res.status(500).json({ error: 'Failed to fetch provider' });
  }
});

// Register new provider (always bound to authenticated user)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { 
        type, bio, vehicle, licensePlate, 
        latitude, longitude, 
        address, commune, region, phone, website, paymentMethods,
        rut, specialties, idDocumentUrl, backgroundCheckUrl
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Validate essential fields
    if (!type) {
        return res.status(400).json({ error: 'Falta campo obligatorio: tipo' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado para crear perfil de prestador' });
    }

    if (rut && !validarRUT(rut)) {
        return res.status(400).json({ error: "El RUT ingresado no es válido (Módulo 11)" });
    }

    // Check if user already has a provider profile
    const existingProfile = await prisma.serviceProvider.findUnique({
        where: { userId }
    });

    if (existingProfile) {
        return res.status(400).json({ error: "User is already a service provider" });
    }

    const newProvider = await prisma.serviceProvider.create({
      data: {
        userId,
        type, // MECHANIC, WORKSHOP, TOWING, INSURANCE
        bio,
        vehicle, 
        licensePlate,
        latitude,
        longitude,
        address,
        commune,
        region,
        phone,
        website,
        paymentMethods,
        rut,
        specialties,
        idDocumentUrl,
        backgroundCheckUrl,
        submittedAt: new Date(),
        isDemo: false,
        status: "ACTIVE" // Default to ACTIVE so they can get visibility once approved/linked
      },
      include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
      }
    });

    return res.status(201).json(newProvider);
  } catch (error: any) {
    console.error("Error registering provider:", error);
    // Devolver el mensaje de error real para debug
    const errorMessage = error?.message || error?.code || 'Unknown error';
    return res.status(500).json({ error: 'Failed to register provider', details: errorMessage });
  }
});

// Update provider profile
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const providerId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId as string }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const isOwner = provider.userId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permiso para modificar este perfil' });
    }

    const { bio, vehicle, licensePlate, status, latitude, longitude } = req.body;

    if (status !== undefined && status !== provider.status && !isAdmin) {
      return res.status(403).json({ error: 'Acceso denegado: Solo administradores pueden cambiar el estado del proveedor' });
    }

    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: providerId as string },
      data: {
        bio,
        vehicle,
        licensePlate,
        latitude,
        longitude,
        ...(isAdmin && status && { status })
      }
    });

    res.json(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

router.get('/me/quotes', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

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

        return res.json(quotes);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
});

// --- DASHBOARD FOR AUTHENTICATED PROVIDER ---
router.get('/me/dashboard', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId },
      include: {
        subscription: true,
        history: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: {
          select: { jobs: true }
        }
      }
    });

    if (!provider) return res.status(404).json({ error: 'Perfil de proveedor no encontrado' });

    // Calcular ganancias reales de jobs completados
    const earnings = await prisma.job.aggregate({
      where: {
        providerId: provider.id,
        status: 'CLOSED'
      },
      _sum: {
        estimatedCost: true
      }
    });

    // Ganancias del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEarnings = await prisma.job.aggregate({
      where: {
        providerId: provider.id,
        status: 'CLOSED',
        completedAt: { gte: firstDayOfMonth }
      },
      _sum: {
        estimatedCost: true
      }
    });

    return res.json({
      provider,
      stats: {
        totalEarnings: earnings._sum.estimatedCost || 0,
        monthEarnings: monthEarnings._sum.estimatedCost || 0,
        completedJobs: provider._count.jobs,
        avgRating: provider.rating,
        responseTime: "15 min", // Mock por ahora
        completionRate: 100 // Mock por ahora
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ error: 'Error al cargar dashboard' });
  }
});

router.get('/me/invoices', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
    if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

    const invoices = await prisma.invoice.findMany({
      where: { providerId: provider.id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(invoices);
  } catch (error) {
    console.error("Invoices error:", error);
    return res.status(500).json({ error: 'Error al obtener facturas' });
  }
});

router.get('/me/jobs', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;
        const provider = await prisma.serviceProvider.findUnique({ where: { userId } });
        if (!provider) return res.status(404).json({ error: 'Proveedor no encontrado' });

        const jobs = await prisma.job.findMany({
            where: { providerId: provider.id },
            include: {
                request: {
                    include: {
                        user: { select: { name: true, email: true } },
                        vehicle: true,
                        service: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return res.json(jobs);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener trabajos' });
    }
});

export default router;
