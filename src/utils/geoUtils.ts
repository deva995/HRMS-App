import { Geofence } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the standard Haversine formula (in meters).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

/**
 * Request real device GPS coordinates via standard browser API with timeout and accuracy.
 */
export function getCurrentBrowserPosition(): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date(position.timestamp).toISOString(),
        });
      },
      (error) => {
        let message = 'Failed to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Geolocation permission denied by user in browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Position information is currently unavailable.';
            break;
          case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Evaluates whether a location coordinate falls within any configured geofences for an organization.
 */
export function evaluateGeofenceStatus(
  latitude: number,
  longitude: number,
  geofences: Geofence[]
): {
  status: 'inside' | 'outside';
  nearestGeofence: Geofence | null;
  distanceMeters: number;
} {
  if (!geofences || geofences.length === 0) {
    return { status: 'inside', nearestGeofence: null, distanceMeters: 0 };
  }

  let minDistance = Infinity;
  let nearest: Geofence | null = null;
  let isInsideAny = false;

  for (const fence of geofences) {
    const dist = calculateHaversineDistance(
      latitude,
      longitude,
      fence.latitude,
      fence.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = fence;
    }
    if (dist <= fence.radiusMeters) {
      isInsideAny = true;
    }
  }

  return {
    status: isInsideAny ? 'inside' : 'outside',
    nearestGeofence: nearest,
    distanceMeters: minDistance === Infinity ? 0 : minDistance,
  };
}

export function formatCoordinate(val: number, precision: number = 5): string {
  return val.toFixed(precision);
}
