import { prisma } from '../db.js';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ProviderSearchParams {
  lat: number;
  lng: number;
  radiusKm?: number;
  categoryId?: string;
  serviceType?: string;
  availableNow?: boolean;
  status?: string;
}

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function findNearbyProviders(params: ProviderSearchParams) {
  const {
    lat,
    lng,
    radiusKm = 15,
    categoryId,
    serviceType,
    availableNow = false,
    status = 'ACTIVE'
  } = params;

  const providers = await prisma.serviceProvider.findMany({
    where: {
      status,
      latitude: { not: null },
      longitude: { not: null },
      ...(categoryId && {
        categories: {
          some: { categoryId }
        }
      }),
      ...(serviceType && {
        type: serviceType
      })
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      subscription: true,
      categories: { include: { category: true } },
      zones: { include: { zone: true } },
      availability: availableNow ? {
        where: {
          dayOfWeek: new Date().getDay(),
          isActive: true
        }
      } : false
    }
  });

  const userLocation: GeoPoint = { lat, lng };
  
  const nearbyProviders = providers
    .map(provider => {
      const providerLocation: GeoPoint = {
        lat: provider.latitude!,
        lng: provider.longitude!
      };
      const distance = calculateDistance(userLocation, providerLocation);
      return { ...provider, distance };
    })
    .filter(provider => provider.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  return nearbyProviders;
}

export async function findNearbyProvidersRaw(lat: number, lng: number, radiusKm: number = 15) {
  const providers = await prisma.$queryRaw<Array<{
    id: string;
    type: string;
    status: string;
    rating: number;
    latitude: number;
    longitude: number;
    name: string;
    distance: number;
  }>>`
    SELECT 
      sp.id,
      sp.type,
      sp.status,
      sp.rating,
      sp.latitude,
      sp.longitude,
      u.name,
      (6371 * acos(
        cos(radians(${lat})) * cos(radians(sp.latitude)) * 
        cos(radians(sp.longitude) - radians(${lng})) + 
        sin(radians(${lat})) * sin(radians(sp.latitude))
      )) AS distance
    FROM "ServiceProvider" sp
    JOIN "User" u ON sp."userId" = u.id
    WHERE sp.status = 'ACTIVE'
      AND sp.latitude IS NOT NULL
      AND sp.longitude IS NOT NULL
      AND (6371 * acos(
        cos(radians(${lat})) * cos(radians(sp.latitude)) * 
        cos(radians(sp.longitude) - radians(${lng})) + 
        sin(radians(${lat})) * sin(radians(sp.latitude))
      )) <= ${radiusKm}
    ORDER BY distance ASC
    LIMIT 20
  `;

  return providers;
}

export function isProviderAvailableNow(providerAvailability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayAvailability = providerAvailability.filter(
    a => a.dayOfWeek === currentDay && a.isActive
  );

  for (const avail of todayAvailability) {
    const [startHour, startMin] = avail.startTime.split(':').map(Number);
    const [endHour, endMin] = avail.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (currentTime >= startTime && currentTime <= endTime) {
      return true;
    }
  }

  return false;
}

export function estimateArrivalTime(distanceKm: number, providerType: string): number {
  const avgSpeedKmh = providerType === 'TOWING' ? 50 : 40;
  const margin = 1.2;
  return Math.ceil((distanceKm / avgSpeedKmh) * 60 * margin);
}
