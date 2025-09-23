// Geolocation Service Abstraction
// This module provides a unified interface for different geolocation providers

import { loadGeolocationConfig } from '@/lib/geolocationConfig';

export type GeolocationProvider = 'browser' | 'ipgeolocation' | 'ip2location' | 'smarty' | 'google' | 'mapbox';

export interface GeolocationService {
  getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }>;
  getName(): string;
}

// Browser Geolocation Service
class BrowserGeolocationService implements GeolocationService {
  getName(): string {
    return 'Browser Geolocation';
  }

  getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Unable to retrieve your location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }
}

// IP Geolocation Service using ipgeolocation.io
class IPGeolocationService implements GeolocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'IP Geolocation (ipgeolocation.io)';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required for ipgeolocation.io service');
    }

    try {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: 5000 // Approximate accuracy for IP-based geolocation (in meters)
      };
    } catch (error) {
      console.error('Error fetching IP location:', error);
      throw new Error('Failed to fetch location data from IP Geolocation API');
    }
  }
}

// IP Geolocation Service using IP2Location
class IP2LocationService implements GeolocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'IP Geolocation (IP2Location)';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required for IP2Location service');
    }

    try {
      // Using IP2Location.io API (similar to ipgeolocation.io but different endpoint)
      const response = await fetch(`https://api.ip2location.io/?key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: 5000 // Approximate accuracy for IP-based geolocation (in meters)
      };
    } catch (error) {
      console.error('Error fetching IP location from IP2Location:', error);
      throw new Error('Failed to fetch location data from IP2Location API');
    }
  }
}

// Geolocation Service using Smarty (address-based geocoding)
class SmartyGeolocationService implements GeolocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'Smarty Geolocation';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required for Smarty service');
    }

    try {
      // For Smarty, we would typically geocode an address
      // But for IP-based location, we can use their IP geolocation endpoint
      const response = await fetch(`https://iplocation.smarty.net/locate?key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Note: Smarty's response structure may vary, this is a simplified example
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        accuracy: 5000 // Approximate accuracy for IP-based geolocation (in meters)
      };
    } catch (error) {
      console.error('Error fetching IP location from Smarty:', error);
      throw new Error('Failed to fetch location data from Smarty API');
    }
  }
}

// Google Geolocation Service (Placeholder)
class GoogleGeolocationService implements GeolocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'Google Geolocation';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required for Google Geolocation service');
    }

    // This is a placeholder implementation
    // Google's Geolocation API requires cell tower or WiFi access point data
    // For browser-based location, Google Maps JavaScript API would be used instead
    throw new Error('Google Geolocation API requires additional context data. Use Google Maps JavaScript API for browser-based geolocation.');
  }
}

// Mapbox Geolocation Service (Placeholder)
class MapboxGeolocationService implements GeolocationService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'Mapbox Geolocation';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
    if (!this.apiKey) {
      throw new Error('API key is required for Mapbox Geolocation service');
    }

    // This is a placeholder implementation
    // Mapbox doesn't have a direct geolocation API like ipgeolocation.io
    // They provide client-side geolocation through their Maps SDK
    throw new Error('Mapbox does not provide a direct geolocation API. Use Mapbox Maps SDK for geolocation functionality.');
  }
}

// Geolocation Service Factory
class GeolocationServiceFactory {
  static create(provider: GeolocationProvider, apiKey?: string): GeolocationService {
    switch (provider) {
      case 'browser':
        return new BrowserGeolocationService();
      case 'ipgeolocation':
        return new IPGeolocationService(apiKey || '');
      case 'ip2location':
        return new IP2LocationService(apiKey || '');
      case 'smarty':
        return new SmartyGeolocationService(apiKey || '');
      case 'google':
        return new GoogleGeolocationService(apiKey || '');
      case 'mapbox':
        return new MapboxGeolocationService(apiKey || '');
      default:
        throw new Error(`Unsupported geolocation provider: ${provider}`);
    }
  }
}

// Main Geolocation Manager
class GeolocationManager {
  private services: Map<GeolocationProvider, GeolocationService> = new Map();
  private fallbackProviders: GeolocationProvider[] = ['browser', 'ipgeolocation', 'ip2location'];
  private currentProvider: GeolocationProvider = 'browser';
  private config = loadGeolocationConfig();

  constructor() {
    this.initializeServices();
  }

  // Initialize services based on configuration
  private initializeServices(): void {
    const { providers } = this.config;
    
    // Initialize browser service if enabled
    if (providers.browser.enabled) {
      this.services.set('browser', new BrowserGeolocationService());
    }
    
    // Initialize ipgeolocation service if enabled and API key is available
    if (providers.ipgeolocation.enabled && providers.ipgeolocation.apiKey) {
      this.services.set('ipgeolocation', new IPGeolocationService(providers.ipgeolocation.apiKey));
    }
    
    // Initialize IP2Location service if enabled and API key is available
    if (providers.ip2location.enabled && providers.ip2location.apiKey) {
      this.services.set('ip2location', new IP2LocationService(providers.ip2location.apiKey));
    }
    
    // Initialize Smarty service if enabled and API key is available
    if (providers.smarty.enabled && providers.smarty.apiKey) {
      this.services.set('smarty', new SmartyGeolocationService(providers.smarty.apiKey));
    }
    
    // Initialize Google service if enabled and API key is available
    if (providers.google.enabled && providers.google.apiKey) {
      this.services.set('google', new GoogleGeolocationService(providers.google.apiKey));
    }
    
    // Initialize Mapbox service if enabled and API key is available
    if (providers.mapbox.enabled && providers.mapbox.apiKey) {
      this.services.set('mapbox', new MapboxGeolocationService(providers.mapbox.apiKey));
    }
    
    // Set fallback providers
    this.fallbackProviders = this.config.fallbackOrder.filter(provider => 
      this.services.has(provider as GeolocationProvider)
    ) as GeolocationProvider[];
    
    // Set current provider
    if (this.services.has(this.config.defaultProvider)) {
      this.currentProvider = this.config.defaultProvider;
    }
  }

  // Add a new service
  addService(provider: GeolocationProvider, service: GeolocationService): void {
    this.services.set(provider, service);
  }

  // Set API key for a provider
  setApiKey(provider: GeolocationProvider, apiKey: string): void {
    switch (provider) {
      case 'ipgeolocation':
        this.services.set(provider, new IPGeolocationService(apiKey));
        break;
      case 'ip2location':
        this.services.set(provider, new IP2LocationService(apiKey));
        break;
      case 'smarty':
        this.services.set(provider, new SmartyGeolocationService(apiKey));
        break;
      case 'google':
        this.services.set(provider, new GoogleGeolocationService(apiKey));
        break;
      case 'mapbox':
        this.services.set(provider, new MapboxGeolocationService(apiKey));
        break;
      default:
        console.warn(`Cannot set API key for provider: ${provider}`);
    }
  }

  // Set fallback providers order
  setFallbackProviders(providers: GeolocationProvider[]): void {
    this.fallbackProviders = providers.filter(provider => 
      this.services.has(provider)
    );
  }

  // Set current provider
  setCurrentProvider(provider: GeolocationProvider): void {
    if (!this.services.has(provider)) {
      throw new Error(`Service for provider ${provider} is not configured`);
    }
    this.currentProvider = provider;
  }

  // Get current location with fallback
  async getCurrentLocation(): Promise<{ 
    latitude: number; 
    longitude: number; 
    accuracy?: number;
    provider: GeolocationProvider;
  }> {
    // Try current provider first
    try {
      const service = this.services.get(this.currentProvider);
      if (service) {
        const location = await service.getCurrentLocation();
        return { ...location, provider: this.currentProvider };
      }
    } catch (error) {
      console.warn(`Failed to get location from ${this.currentProvider}:`, error);
    }

    // Try fallback providers
    for (const provider of this.fallbackProviders) {
      if (provider === this.currentProvider) continue; // Skip already tried provider
      
      try {
        const service = this.services.get(provider);
        if (service) {
          const location = await service.getCurrentLocation();
          return { ...location, provider };
        }
      } catch (error) {
        console.warn(`Failed to get location from fallback provider ${provider}:`, error);
      }
    }

    // If all providers fail, throw an error
    throw new Error('Unable to get location from any provider');
  }

  // Get available providers
  getAvailableProviders(): GeolocationProvider[] {
    return Array.from(this.services.keys());
  }

  // Get current provider name
  getCurrentProviderName(): string {
    const service = this.services.get(this.currentProvider);
    return service ? service.getName() : 'Unknown';
  }
  
  // Reload configuration
  reloadConfig(): void {
    this.config = loadGeolocationConfig();
    this.initializeServices();
  }
}

// Create a singleton instance
const geolocationManager = new GeolocationManager();

export { 
  GeolocationServiceFactory, 
  GeolocationManager, 
  geolocationManager,
  BrowserGeolocationService,
  IPGeolocationService,
  IP2LocationService,
  SmartyGeolocationService,
  GoogleGeolocationService,
  MapboxGeolocationService
};