// Geolocation Configuration
// This file manages the configuration for different geolocation providers

export interface GeolocationConfig {
  providers: {
    browser: {
      enabled: boolean;
    };
    ipgeolocation: {
      enabled: boolean;
      apiKey?: string;
    };
    ip2location: {
      enabled: boolean;
      apiKey?: string;
    };
    smarty: {
      enabled: boolean;
      apiKey?: string;
    };
    google: {
      enabled: boolean;
      apiKey?: string;
    };
    mapbox: {
      enabled: boolean;
      apiKey?: string;
    };
  };
  fallbackOrder: ('browser' | 'ipgeolocation' | 'ip2location' | 'smarty' | 'google' | 'mapbox')[];
  defaultProvider: 'browser' | 'ipgeolocation' | 'ip2location' | 'smarty' | 'google' | 'mapbox';
}

// Default configuration
export const defaultGeolocationConfig: GeolocationConfig = {
  providers: {
    browser: {
      enabled: true,
    },
    ipgeolocation: {
      enabled: true,
      apiKey: process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY,
    },
    ip2location: {
      enabled: true,
      apiKey: process.env.NEXT_PUBLIC_IP2LOCATION_API_KEY,
    },
    smarty: {
      enabled: true,
      apiKey: process.env.NEXT_PUBLIC_SMARTY_API_KEY,
    },
    google: {
      enabled: false, // Disabled by default as it requires special setup
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    mapbox: {
      enabled: false, // Disabled by default as it requires special setup
      apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
    },
  },
  fallbackOrder: ['browser', 'ipgeolocation', 'ip2location', 'smarty'],
  defaultProvider: 'browser',
};

// Function to load configuration from environment variables
export function loadGeolocationConfig(): GeolocationConfig {
  return {
    providers: {
      browser: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_BROWSER_ENABLED', true),
      },
      ipgeolocation: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_IPGEOLOCATION_ENABLED', true),
        apiKey: process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY,
      },
      ip2location: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_IP2LOCATION_ENABLED', true),
        apiKey: process.env.NEXT_PUBLIC_IP2LOCATION_API_KEY,
      },
      smarty: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_SMARTY_ENABLED', true),
        apiKey: process.env.NEXT_PUBLIC_SMARTY_API_KEY,
      },
      google: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_GOOGLE_ENABLED', false),
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
      mapbox: {
        enabled: getBooleanEnvVar('NEXT_PUBLIC_GEOLOCATION_MAPBOX_ENABLED', false),
        apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
      },
    },
    fallbackOrder: getArrayEnvVar('NEXT_PUBLIC_GEOLOCATION_FALLBACK_ORDER', ['browser', 'ipgeolocation', 'ip2location', 'smarty']) as any,
    defaultProvider: getStringEnvVar('NEXT_PUBLIC_GEOLOCATION_DEFAULT_PROVIDER', 'browser') as any,
  };
}

// Helper functions to get environment variables with defaults
function getBooleanEnvVar(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getStringEnvVar(name: string, defaultValue: string): string {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value;
}

function getArrayEnvVar(name: string, defaultValue: string[]): string[] {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.split(',').map(item => item.trim());
}