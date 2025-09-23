// IP Geolocation API utility functions
// API Documentation: https://ipgeolocation.io/documentation/ip-geolocation-api.html

interface IPGeolocationResponse {
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
export async function getUserLocationByIP(apiKey: string): Promise<{ latitude: number; longitude: number; city: string; country: string }> {
  try {
    const data = await getIPLocation(apiKey);
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name
    };
  } catch (error) {
    console.error('Error getting user location by IP:', error);
    throw new Error('Failed to determine user location');
  }
}

/**
 * Reverse geocode coordinates to get address information
 * Note: ipgeolocation.io doesn't have a direct reverse geocoding endpoint,
 * but we can use the IP geolocation with additional parameters
 * @param apiKey - Your ipgeolocation.io API key
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Address information (limited compared to dedicated reverse geocoding)
 */
export async function reverseGeocode(apiKey: string, lat: number, lon: number): Promise<{ city: string; state: string; country: string }> {
  try {
    // ipgeolocation.io doesn't have a direct reverse geocoding API
    // We'll use a workaround by making a geolocation request with coordinates
    // This is a limitation of this service compared to Google Maps or similar
    
    // For now, we'll just return a basic structure
    // In a real implementation, you might want to use a different service for reverse geocoding
    return {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown'
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw new Error('Reverse geocoding not available with ipgeolocation.io');
  }
}