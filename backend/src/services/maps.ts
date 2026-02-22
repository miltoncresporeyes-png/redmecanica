import axios from 'axios';
import { config } from '../config/index.js';

export interface MapDirectionsResult {
  duration: number;
  distance: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  commune?: string;
  region?: string;
}

class MapsService {
  private provider: 'mapbox' | 'google';
  private apiKey: string;

  constructor() {
    this.provider = (config.maps.provider as 'mapbox' | 'google') || 'mapbox';
    this.apiKey = config.maps.apiKey || '';
  }

  async geocode(address: string): Promise<GeocodingResult | null> {
    if (this.provider === 'mapbox') {
      return this.geocodeMapbox(address);
    }
    return this.geocodeGoogle(address);
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    if (this.provider === 'mapbox') {
      return this.reverseGeocodeMapbox(lat, lng);
    }
    return this.reverseGeocodeGoogle(lat, lng);
  }

  async getDirections(origin: [number, number], destination: [number, number]): Promise<MapDirectionsResult | null> {
    if (this.provider === 'mapbox') {
      return this.getDirectionsMapbox(origin, destination);
    }
    return this.getDirectionsGoogle(origin, destination);
  }

  async calculateDistanceMatrix(
    origins: [number, number][],
    destinations: [number, number][]
  ): Promise<Array<Array<{ duration: number; distance: number }>>> {
    if (this.provider === 'mapbox') {
      return this.calculateDistanceMatrixMapbox(origins, destinations);
    }
    return this.calculateDistanceMatrixGoogle(origins, destinations);
  }

  private async geocodeMapbox(address: string): Promise<GeocodingResult | null> {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
        {
          params: {
            access_token: this.apiKey,
            country: 'CL',
            limit: 1,
          },
        }
      );

      if (response.data.features?.length === 0) return null;

      const feature = response.data.features[0];
      const [lng, lat] = feature.center;

      const context = feature.context?.reduce((acc: Record<string, string>, ctx: { id: string; text: string }) => {
        if (ctx.id.startsWith('commune')) acc.commune = ctx.text;
        if (ctx.id.startsWith('region')) acc.region = ctx.text;
        return acc;
      }, {});

      return {
        lat,
        lng,
        address: feature.place_name,
        commune: context?.commune,
        region: context?.region,
      };
    } catch (error) {
      console.error('Mapbox geocoding error:', error);
      return null;
    }
  }

  private async reverseGeocodeMapbox(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        {
          params: {
            access_token: this.apiKey,
            types: 'address,place,locality',
          },
        }
      );

      if (response.data.features?.length === 0) return null;

      const feature = response.data.features[0];
      const context = feature.context?.reduce((acc: Record<string, string>, ctx: { id: string; text: string }) => {
        if (ctx.id.startsWith('commune')) acc.commune = ctx.text;
        if (ctx.id.startsWith('region')) acc.region = ctx.text;
        return acc;
      }, {});

      return {
        lat,
        lng,
        address: feature.place_name,
        commune: context?.commune,
        region: context?.region,
      };
    } catch (error) {
      console.error('Mapbox reverse geocoding error:', error);
      return null;
    }
  }

  private async getDirectionsMapbox(
    origin: [number, number],
    destination: [number, number]
  ): Promise<MapDirectionsResult | null> {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}`,
        {
          params: {
            access_token: this.apiKey,
            geometries: 'geojson',
            overview: 'full',
          },
        }
      );

      if (response.data.routes?.length === 0) return null;

      const route = response.data.routes[0];
      return {
        duration: route.duration,
        distance: route.distance,
        geometry: route.geometry,
      };
    } catch (error) {
      console.error('Mapbox directions error:', error);
      return null;
    }
  }

  private async calculateDistanceMatrixMapbox(
    origins: [number, number][],
    destinations: [number, number][]
  ): Promise<Array<Array<{ duration: number; distance: number }>>> {
    const coordinates = [
      ...origins.map(o => `${o[0]},${o[1]}`),
      ...destinations.map(d => `${d[0]},${d[1]}`),
    ].join(';');

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`,
        {
          params: {
            access_token: this.apiKey,
            annotations: 'duration,distance',
          },
        }
      );

      const results: Array<Array<{ duration: number; distance: number }>> = [];
      let idx = 0;

      for (let i = 0; i < origins.length; i++) {
        const row: Array<{ duration: number; distance: number }> = [];
        for (let j = 0; j < destinations.length; j++) {
          if (response.data.durations?.[idx]) {
            row.push({
              duration: response.data.durations[idx],
              distance: response.data.distances?.[idx] || 0,
            });
          } else {
            row.push({ duration: 0, distance: 0 });
          }
          idx++;
        }
        results.push(row);
      }

      return results;
    } catch (error) {
      console.error('Mapbox matrix error:', error);
      return origins.map(() => destinations.map(() => ({ duration: 0, distance: 0 })));
    }
  }

  private async geocodeGoogle(address: string): Promise<GeocodingResult | null> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            region: 'cl',
            key: this.apiKey,
          },
        }
      );

      if (response.data.status !== 'OK' || response.data.results.length === 0) return null;

      const result = response.data.results[0];
      const location = result.geometry.location;

      const components = result.address_components.reduce((acc: Record<string, string>, comp: { types: string[]; long_name: string }) => {
        if (comp.types.includes('locality')) acc.commune = comp.long_name;
        if (comp.types.includes('administrative_area_level_1')) acc.region = comp.long_name;
        return acc;
      }, {});

      return {
        lat: location.lat,
        lng: location.lng,
        address: result.formatted_address,
        commune: components.commune,
        region: components.region,
      };
    } catch (error) {
      console.error('Google geocoding error:', error);
      return null;
    }
  }

  private async reverseGeocodeGoogle(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${lat},${lng}`,
            key: this.apiKey,
          },
        }
      );

      if (response.data.status !== 'OK' || response.data.results.length === 0) return null;

      const result = response.data.results[0];
      const components = result.address_components.reduce((acc: Record<string, string>, comp: { types: string[]; long_name: string }) => {
        if (comp.types.includes('locality')) acc.commune = comp.long_name;
        if (comp.types.includes('administrative_area_level_1')) acc.region = comp.long_name;
        return acc;
      }, {});

      return {
        lat,
        lng,
        address: result.formatted_address,
        commune: components.commune,
        region: components.region,
      };
    } catch (error) {
      console.error('Google reverse geocoding error:', error);
      return null;
    }
  }

  private async getDirectionsGoogle(
    origin: [number, number],
    destination: [number, number]
  ): Promise<MapDirectionsResult | null> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin: `${origin[0]},${origin[1]}`,
            destination: `${destination[0]},${destination[1]}`,
            mode: 'driving',
            key: this.apiKey,
          },
        }
      );

      if (response.data.status !== 'OK' || response.data.routes.length === 0) return null;

      const route = response.data.routes[0];
      const leg = route.legs[0];

      const coordinates: [number, number][] = [];
      for (const step of route.overview_path) {
        coordinates.push([step.lng, step.lat]);
      }

      return {
        duration: leg.duration.value,
        distance: leg.distance.value,
        geometry: {
          coordinates,
          type: 'LineString',
        },
      };
    } catch (error) {
      console.error('Google directions error:', error);
      return null;
    }
  }

  private async calculateDistanceMatrixGoogle(
    origins: [number, number][],
    destinations: [number, number][]
  ): Promise<Array<Array<{ duration: number; distance: number }>>> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            origins: origins.map(o => `${o[0]},${o[1]}`).join('|'),
            destinations: destinations.map(d => `${d[0]},${d[1]}`).join('|'),
            mode: 'driving',
            key: this.apiKey,
          },
        }
      );

      if (response.data.status !== 'OK') {
        return origins.map(() => destinations.map(() => ({ duration: 0, distance: 0 })));
      }

      return response.data.rows.map((row: { elements: Array<{ duration: { value: number }; distance: { value: number } }> }) =>
        row.elements.map(el => ({
          duration: el.duration?.value || 0,
          distance: el.distance?.value || 0,
        }))
      );
    } catch (error) {
      console.error('Google matrix error:', error);
      return origins.map(() => destinations.map(() => ({ duration: 0, distance: 0 })));
    }
  }

  getStaticMapUrl(lat: number, lng: number, zoom: number = 14, width: number = 400, height: number = 300): string {
    const center = `${lat},${lng}`;
    const markers = `pin-s+2ecc71(${lat},${lng})`;
    
    if (this.provider === 'mapbox') {
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${markers}/${center}/${zoom}/${width}x${height}?access_token=${this.apiKey}`;
    }
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${width}x${height}&markers=color:green|${lat},${lng}&key=${this.apiKey}`;
  }
}

export const mapsService = new MapsService();
