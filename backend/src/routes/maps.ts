import { Router } from 'express';
import { mapsService } from '../services/maps.js';

const router = Router();

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'address is required' });
    }

    const result = await mapsService.geocode(address);
    
    if (!result) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const result = await mapsService.reverseGeocode(Number(lat), Number(lng));
    
    if (!result) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode' });
  }
});

router.get('/directions', async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'origin and destination are required (format: lat,lng)' });
    }

    const [originLat, originLng] = (origin as string).split(',').map(Number);
    const [destLat, destLng] = (destination as string).split(',').map(Number);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return res.status(400).json({ error: 'Invalid coordinates format' });
    }

    const result = await mapsService.getDirections([originLng, originLat], [destLng, destLat]);
    
    if (!result) {
      return res.status(404).json({ error: 'No route found' });
    }

    res.json({
      duration: Math.round(result.duration / 60),
      distance: Math.round(result.distance / 1000 * 10) / 10,
      geometry: result.geometry,
    });
  } catch (error) {
    console.error('Directions error:', error);
    res.status(500).json({ error: 'Failed to get directions' });
  }
});

router.get('/static-map', async (req, res) => {
  try {
    const { lat, lng, zoom, width, height } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const url = mapsService.getStaticMapUrl(
      Number(lat),
      Number(lng),
      zoom ? Number(zoom) : 14,
      width ? Number(width) : 400,
      height ? Number(height) : 300
    );

    res.json({ url });
  } catch (error) {
    console.error('Static map error:', error);
    res.status(500).json({ error: 'Failed to generate static map URL' });
  }
});

export default router;
