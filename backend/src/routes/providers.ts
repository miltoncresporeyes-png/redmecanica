import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { validarRUT } from '../utils/rutValidator.js';

const router = Router();

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
    // For MVP/Demo: Fetch all of type (or all) and filter in JS. 
    // Optimization: Filter by lat/lng range (approx 1 deg = 111km)
    
    // 1 deg lat ~= 111km
    // 1 deg lng ~= 111km * cos(lat)
    const latDelta = rad / 111;
    const lngDelta = rad / (111 * Math.cos(latitude * (Math.PI / 180)));

    const whereClause: any = {
      status: { in: ['ACTIVE', 'APPROVED'] },
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
  return deg * (Math.PI/180)
}

// Get provider profile
router.get('/:id', async (req, res) => {
  try {
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
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

// Register new provider (creates or links to existing user)
router.post('/', async (req, res) => {
  try {
    const { 
        userId, type, bio, vehicle, licensePlate, 
        latitude, longitude, 
        address, commune, region, phone, website, paymentMethods,
        rut, specialties, idDocumentUrl, backgroundCheckUrl
    } = req.body;

    // Validate essential fields
    if (!userId || !type) {
        return res.status(400).json({ error: "Faltan campos obligatorios: userId, tipo" });
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
        status: "PENDING" // Default to pending approval
      },
      include: {
          user: true
      }
    });

    // Optionally update user role to reflect provider status if needed
    // await prisma.user.update({ where: { id: userId }, data: { role: type } });

    return res.status(201).json(newProvider);
  } catch (error) {
    console.error("Error registering provider:", error);
    return res.status(500).json({ error: 'Failed to register provider' });
  }
});

// Update provider profile
router.put('/:id', async (req, res) => {
  try {
    const { bio, vehicle, licensePlate, status, latitude, longitude } = req.body;
    
    const updatedProvider = await prisma.serviceProvider.update({
      where: { id: req.params.id },
      data: {
        bio,
        vehicle,
        licensePlate,
        status, 
        latitude,
        longitude
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
        status: 'COMPLETED'
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
        status: 'COMPLETED',
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
