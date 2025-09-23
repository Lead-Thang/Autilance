/**
 * Geolocation utility functions for Autilance platform
 */

// Types for location data
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationWithAddress extends Location {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

/**
 * Get current user location using browser Geolocation API
 * @returns Promise resolving to user's current location
 */
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Check if a point is within a radius of another point
 * @param centerLat Latitude of center point
 * @param centerLon Longitude of center point
 * @param pointLat Latitude of point to check
 * @param pointLon Longitude of point to check
 * @param radius Radius in kilometers
 * @returns Boolean indicating if point is within radius
 */
export const isWithinRadius = (
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radius: number
): boolean => {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radius;
};

/**
 * Mock function to geocode an address to coordinates
 * In a real implementation, this would call a geocoding service like Google Maps API
 * @param address Address to geocode
 * @returns Promise resolving to geocoded coordinates
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  // This is a mock implementation - in a real app, you would integrate with a geocoding service
  // For example, with Google Maps Geocoding API or Mapbox Geocoding API
  
  // Mock response for demonstration
  return {
    latitude: 37.7749,
    longitude: -122.4194,
    formattedAddress: address,
    components: {
      city: "San Francisco",
      state: "CA",
      country: "USA"
    }
  };
};

/**
 * Mock function to reverse geocode coordinates to an address
 * In a real implementation, this would call a reverse geocoding service
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise resolving to reverse geocoded address
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodeResult> => {
  // This is a mock implementation - in a real app, you would integrate with a reverse geocoding service
  
  // Mock response for demonstration
  return {
    latitude,
    longitude,
    formattedAddress: "San Francisco, CA, USA",
    components: {
      city: "San Francisco",
      state: "CA",
      country: "USA"
    }
  };
};

/**
 * Filter items by proximity to a given location
 * @param items Array of items with location data
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param maxDistance Maximum distance in kilometers
 * @returns Filtered array of items within the specified distance
 */
export const filterByProximity = <T extends { latitude?: number; longitude?: number }>(
  items: T[],
  userLat: number,
  userLon: number,
  maxDistance: number
): T[] => {
  return items.filter(item => {
    if (item.latitude === undefined || item.longitude === undefined) {
      return false;
    }
    
    const distance = calculateDistance(userLat, userLon, item.latitude, item.longitude);
    return distance <= maxDistance;
  });
};

// IP Geolocation API types and functions
// -------------------------------------

/**
 * Interface for IP Geolocation API response
 * @see https://ipgeolocation.io/documentation/ip-geolocation-api.html
 */
export interface IPGeolocationResponse {
  ip: string;
  hostname: string;
  continent_code: string;
  continent_name: string;
  country_code2: string;
  country_code3: string;
  country_name: string;
  country_capital: string;
  state_prov: string;
  district: string;
  city: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  is_eu: boolean;
  calling_code: string;
  country_tld: string;
  languages: string;
  country_flag: string;
  geoname_id: string;
  isp: string;
  connection_type: string;
  organization: string;
  asn: string;
  currency: {
    name: string;
    code: string;
    symbol: string;
  };
  time_zone: {
    name: string;
    offset: number;
    current_time: string;
    current_time_unix: number;
    is_dst: boolean;
    dst_savings: number;
  };
}

/**
 * Get location information based on IP address using ipgeolocation.io API
 * @param apiKey - Your ipgeolocation.io API key
 * @param ip - IP address to look up (optional, will use requester's IP if not provided)
 * @returns Location information
 */
export async function getIPLocation(apiKey: string, ip?: string): Promise<IPGeolocationResponse> {
  try {
    const baseUrl = 'https://api.ipgeolocation.io/ipgeo';
    const params = new URLSearchParams({
      apiKey,
    });
    
    if (ip) {
      params.append('ip', ip);
    }
    
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: IPGeolocationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IP location:', error);
    throw new Error('Failed to fetch location data from IP Geolocation API');
  }
}

/**
 * Get user's approximate location based on their IP address
 * @param apiKey - Your ipgeolocation.io API key
 * @returns User's location with coordinates
 */
export async function getUserLocationByIP(apiKey: string): Promise<LocationWithAddress> {
  try {
    const data = await getIPLocation(apiKey);
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      state: data.state_prov,
      country: data.country_name,
      accuracy: 15000 // Approximate accuracy for IP geolocation (~15km)
    };
  } catch (error) {
    console.error('Error getting user location by IP:', error);
    throw new Error('Failed to determine user location');
  }
}

export default {
  getCurrentLocation,
  calculateDistance,
  isWithinRadius,
  geocodeAddress,
  reverseGeocode,
  filterByProximity,
  getIPLocation,
  getUserLocationByIP
};