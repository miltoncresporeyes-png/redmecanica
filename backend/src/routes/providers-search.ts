import { Router } from 'express';
import { prisma } from '../db.js';
import { findNearbyProviders, estimateArrivalTime } from '../services/geolocation.js';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { lat, lng, radius = '15', type, certified, specialties, region, commune } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const providers = await findNearbyProviders({
      lat: Number(lat),
      lng: Number(lng),
      radiusKm: Number(radius),
      serviceType: type as string | undefined,
    });

    let filtered = providers;

    if (certified === 'true') {
      filtered = filtered.filter((p: any) => p.emailVerified);
    }

    if (specialties) {
      const specList = (specialties as string).split(',');
      filtered = filtered.filter((p: any) => 
        p.specialties && specList.some((spec: string) => 
          p.specialties.toLowerCase().includes(spec.toLowerCase())
        )
      );
    }

    if (region) {
      filtered = filtered.filter((p: any) => 
        p.region && p.region.toLowerCase().includes((region as string).toLowerCase())
      );
    }

    if (commune) {
      filtered = filtered.filter((p: any) => 
        p.commune && p.commune.toLowerCase().includes((commune as string).toLowerCase())
      );
    }

    const response = filtered.map((p: any) => ({
      id: p.id,
      name: p.user?.name,
      type: p.type,
      status: p.status,
      rating: p.rating,
      bio: p.bio,
      specialties: p.specialties,
      commune: p.commune,
      region: p.region,
      phone: p.phone,
      latitude: p.latitude,
      longitude: p.longitude,
      emailVerified: p.emailVerified,
      phoneVerified: p.phoneVerified,
      trustScore: p.trustScore,
      distance: Math.round(p.distance * 10) / 10,
      etaMinutes: estimateArrivalTime(p.distance, p.type),
    }));

    res.json(response);
  } catch (error) {
    console.error('Error searching providers:', error);
    res.status(500).json({ error: 'Failed to search providers' });
  }
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = '15' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const providers = await findNearbyProviders({
      lat: Number(lat),
      lng: Number(lng),
      radiusKm: Number(radius),
    });

    res.json(providers);
  } catch (error) {
    console.error('Error fetching nearby providers:', error);
    res.status(500).json({ error: 'Failed to fetch nearby providers' });
  }
});

export default router;
