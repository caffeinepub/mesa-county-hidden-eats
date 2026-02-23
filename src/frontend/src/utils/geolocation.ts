// Geolocation utility functions for restaurant proximity filtering

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Get user's current location using browser Geolocation API
 */
export async function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please enable location access.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'));
            break;
          default:
            reject(new Error('An unknown error occurred.'));
        }
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
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter and sort restaurants by proximity to user location
 */
export function filterByProximity<T extends { coordinates: Coordinates; name: string }>(
  restaurants: T[],
  userLocation: Coordinates,
  radiusMiles: number = 10
): Array<T & { distance: number }> {
  const restaurantsWithDistance = restaurants.map((restaurant) => ({
    ...restaurant,
    distance: calculateDistance(userLocation, restaurant.coordinates),
  }));

  return restaurantsWithDistance
    .filter((r) => r.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}
