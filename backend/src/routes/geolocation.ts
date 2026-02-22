import { Router } from 'express';
import { prisma } from '../db.js';
import { z } from 'zod';
import { 
  findNearbyProviders, 
  findNearbyProvidersRaw,
  isProviderAvailableNow,
  estimateArrivalTime 
} from '../services/geolocation.js';

const router = Router();

const searchProvidersSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().max(100).optional().default(15),
  categoryId: z.string().uuid().optional(),
  serviceType: z.enum(['MECHANIC', 'WORKSHOP', 'TOWING', 'INSURANCE']).optional(),
  availableNow: z.coerce.boolean().optional().default(false),
  status: z.enum(['ACTIVE', 'PENDING', 'UNDER_REVIEW', 'SUSPENDED']).optional().default('ACTIVE'),
  useRawQuery: z.coerce.boolean().optional().default(false),
});

router.get('/search', async (req, res) => {
  try {
    const params = searchProvidersSchema.parse(req.query);

    let providers;
    if (params.useRawQuery) {
      providers = await findNearbyProvidersRaw(params.lat, params.lng, params.radiusKm);
    } else {
      providers = await findNearbyProviders({
        lat: params.lat,
        lng: params.lng,
        radiusKm: params.radiusKm,
        categoryId: params.categoryId,
        serviceType: params.serviceType,
        availableNow: params.availableNow,
        status: params.status,
      });
    }

    const response = providers.map(p => {
      const provider = 'distance' in p ? p : { ...p, distance: 0 };
      const etaMinutes = estimateArrivalTime(provider.distance, 'type' in p ? p.type : 'MECHANIC');
      
      return {
        id: provider.id,
        name: 'user' in provider ? provider.user?.name : provider.name,
        type: provider.type,
        status: provider.status,
        rating: provider.rating,
        latitude: provider.latitude,
        longitude: provider.longitude,
        distance: Math.round(provider.distance * 10) / 10,
        etaMinutes,
        isAvailableNow: 'availability' in provider ? isProviderAvailableNow(provider.availability || []) : null,
      };
    });

    res.json({
      providers: response,
      total: response.length,
      searchParams: {
        lat: params.lat,
        lng: params.lng,
        radiusKm: params.radiusKm,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error searching providers:', error);
    res.status(500).json({ error: 'Failed to search providers' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const { lat, lng, radiusKm = '15' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const providers = await findNearbyProvidersRaw(
      Number(lat),
      Number(lng),
      Number(radiusKm)
    );

    const providerIds = providers.map(p => p.id);
    const categoriesWithCount = await prisma.serviceProvider.findMany({
      where: { id: { in: providerIds } },
      include: {
        categories: {
          include: { category: true }
        }
      }
    });

    const categoryMap = new Map();
    for (const provider of categoriesWithCount) {
      for (const pc of provider.categories) {
        const cat = pc.category;
        const current = categoryMap.get(cat.id) || { ...cat, count: 0 };
        current.count += 1;
        categoryMap.set(cat.id, current);
      }
    }

    const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/emergency', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const towingProviders = await findNearbyProviders({
      lat: Number(lat),
      lng: Number(lng),
      radiusKm: 30,
      serviceType: 'TOWING',
      availableNow: true,
    });

    const response = towingProviders.map(p => ({
      id: p.id,
      name: p.user.name,
      phone: p.phone,
      rating: p.rating,
      latitude: p.latitude,
      longitude: p.longitude,
      distance: Math.round(p.distance * 10) / 10,
      etaMinutes: estimateArrivalTime(p.distance, 'TOWING'),
    }));

    res.json({
      providers: response,
      total: response.length,
    });
  } catch (error) {
    console.error('Error fetching emergency providers:', error);
    res.status(500).json({ error: 'Failed to fetch emergency providers' });
  }
});

export default router;
