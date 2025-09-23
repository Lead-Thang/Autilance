# Geolocation Implementation in Autilance

## Overview

This document describes the implementation of geolocation features in the Autilance platform. The implementation enables location-based job matching, allowing users to discover nearby opportunities efficiently.

## Features Implemented

1. **Location-Based Job Discovery**: Users can find jobs near their location
2. **Distance Filtering**: Jobs can be filtered by distance from the user
3. **Visual Map Component**: A map view shows job locations
4. **Location Enablement**: Users can opt-in to location services
5. **IP-Based Location Fallback**: When GPS is unavailable, IP geolocation is used as a fallback
6. **Multi-Provider Support**: Switch between different geolocation providers

## Technical Implementation

### Database Schema Updates

We've updated the Prisma schema to include location fields for both Companies and Job Descriptions:

```prisma
model Company {
  // ... existing fields
  location  String?  // Text location (e.g., "San Francisco, CA")
  latitude  Float?   // Precise latitude coordinate
  longitude Float?   // Precise longitude coordinate
}

model JobDescription {
  // ... existing fields
  location  String?  // Text location (e.g., "San Francisco, CA")
  latitude  Float?   // Precise latitude coordinate
  longitude Float?   // Precise longitude coordinate
}
```

### Geolocation Utility Functions

We've created a utility library (`lib/geolocation.ts`) with functions for:

- Getting current user location using the browser's Geolocation API
- Getting user location based on IP address using ipgeolocation.io API
- Calculating distance between two points using the Haversine formula
- Filtering items by proximity to the user
- Mock implementations for geocoding and reverse geocoding

### Multi-Provider Geolocation System

We've implemented a flexible geolocation system that supports multiple providers:

- Browser Geolocation API (primary)
- ipgeolocation.io API (fallback)
- IP2Location API (additional fallback)
- Smarty API (address-based geocoding and IP geolocation)
- Google Geolocation API (configurable)
- Mapbox Geolocation API (configurable)

### UI Components

We've implemented two map components:

1. **SimpleMap** (`components/simple-map.tsx`) - A lightweight, custom implementation without external dependencies
2. **JobMap** (`components/job-map.tsx`) - A more advanced implementation using Leaflet with multiple map providers

### Job Descriptions Page

We've updated the job descriptions page (`app/dashboard/jd/page.tsx`) to include location-based features:

- Location enablement button
- Distance slider for filtering jobs
- Visual indication of job distances
- Interactive map component for job browsing

## Available Map Solutions

### 1. Leaflet with Multiple Providers (Current Implementation)

This is the current implementation which uses Leaflet with multiple tile providers for detailed maps.

**Available Map Layers:**
- OpenStreetMap (Default)
- OpenTopoMap (Topographic view)
- Esri WorldStreetMap
- Esri WorldImagery (Satellite view)
- CartoDB Voyager
- Stamen Toner
- Stamen Watercolor

**Pros:**
- Completely free
- No usage limits
- Multiple detailed map options
- Good customization options
- Interactive features (hover, zoom, pan)

**Cons:**
- Requires internet connection
- Slightly more complex to implement

### 2. Simple Custom Map

A lightweight implementation without external dependencies.

**Pros:**
- No external dependencies
- Works offline
- Lightweight

**Cons:**
- Limited detail
- No real geographic data
- Less interactive

### 3. Google Maps API

Google Maps offers a generous free tier with limitations.

**Pros:**
- Very familiar to users
- Excellent documentation
- Rich features
- Good performance

**Cons:**
- Costs can add up with heavy usage
- Requires API key
- Privacy concerns for some users

### 4. Mapbox

Mapbox offers a free tier for low usage.

**Pros:**
- Highly customizable
- Good performance
- Strong developer tools

**Cons:**
- Costs can add up with heavy usage
- Requires API key

## IP Geolocation Integration

We've integrated with multiple IP geolocation services to provide location services as a fallback when GPS is unavailable or denied.

### Supported Services

1. **ipgeolocation.io** - IP-based geolocation service
2. **IP2Location** - Alternative IP-based geolocation service
3. **Smarty** - Address verification and IP geolocation service

### Features

1. **IP-Based Location**: Determine user location based on their IP address
2. **Fallback Mechanism**: Automatically try IP geolocation when GPS fails
3. **Enhanced Accuracy**: More accurate than simple country/city detection
4. **Multiple Providers**: Support for multiple IP geolocation services for redundancy

### Setup

To use ipgeolocation.io:

1. Sign up at [https://ipgeolocation.io](https://ipgeolocation.io)
2. Get your API key from the dashboard
3. Add the API key to your environment variables:
   ```env
   NEXT_PUBLIC_IPGEOLOCATION_API_KEY=your_ipgeolocation_api_key
   ```

To use IP2Location:

1. Sign up at [https://www.ip2location.io](https://www.ip2location.io)
2. Get your API key from the dashboard
3. Add the API key to your environment variables:
   ```env
   NEXT_PUBLIC_IP2LOCATION_API_KEY=your_ip2location_api_key
   ```

To use Smarty:

1. Sign up at [https://www.smarty.com](https://www.smarty.com)
2. Get your API key from the dashboard
3. Add the API key to your environment variables:
   ```env
   NEXT_PUBLIC_SMARTY_API_KEY=your_smarty_api_key
   ```

### API Functions

The following functions are available in `lib/geolocation.ts`:

- `getUserLocationByIP(apiKey)`: Get user's approximate location based on their IP
- `getIPLocation(apiKey, ip)`: Get detailed location information for a specific IP

## Multi-Provider Geolocation System

We've implemented a flexible system that allows switching between different geolocation providers.

### Supported Providers

1. **Browser Geolocation** (Default) - Uses the browser's native Geolocation API
2. **ipgeolocation.io** - IP-based geolocation service
3. **IP2Location** - Alternative IP-based geolocation service
4. **Smarty** - Address verification and IP geolocation service
5. **Google Geolocation** - Google's geolocation services (requires setup)
6. **Mapbox Geolocation** - Mapbox's geolocation services (requires setup)

### Configuration

The system can be configured through environment variables:

```env
# Enable/disable providers
NEXT_PUBLIC_GEOLOCATION_BROWSER_ENABLED=true
NEXT_PUBLIC_GEOLOCATION_IPGEOLOCATION_ENABLED=true
NEXT_PUBLIC_GEOLOCATION_IP2LOCATION_ENABLED=true
NEXT_PUBLIC_GEOLOCATION_SMARTY_ENABLED=true
NEXT_PUBLIC_GEOLOCATION_GOOGLE_ENABLED=false
NEXT_PUBLIC_GEOLOCATION_MAPBOX_ENABLED=false

# API Keys
NEXT_PUBLIC_IPGEOLOCATION_API_KEY=your_ipgeolocation_api_key
NEXT_PUBLIC_IP2LOCATION_API_KEY=your_ip2location_api_key
NEXT_PUBLIC_SMARTY_API_KEY=your_smarty_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key

# Fallback order (comma-separated)
NEXT_PUBLIC_GEOLOCATION_FALLBACK_ORDER=browser,ipgeolocation,ip2location,smarty

# Default provider
NEXT_PUBLIC_GEOLOCATION_DEFAULT_PROVIDER=browser
```

### Usage

The geolocation system automatically tries providers in the configured order and falls back to alternatives if one fails.

### Adding New Providers

To add a new geolocation provider:

1. Implement the [GeolocationService](file://d:\Autilance\lib\geolocationService.ts#L5-L8) interface
2. Register it with the [GeolocationServiceFactory](file://d:\Autilance\lib\geolocationService.ts#L190-L218)
3. Add configuration support in [geolocationConfig.ts](file://d:\Autilance\lib\geolocationConfig.ts#L64-L109)

## Implementation Options

### Option 1: Leaflet with Multiple Providers (Current Implementation)

This is the current implementation using Leaflet with multiple map providers. It provides a rich, detailed mapping experience with various map styles.

### Option 2: Simple Custom Map

This is a lightweight implementation that works without any external dependencies.

### Option 3: Google Maps

To integrate Google Maps:

1. Get a Google Maps API key
2. Install the Google Maps React library:
   ```bash
   pnpm add @googlemaps/react-wrapper
   ```
3. Create a GoogleMap component
4. Update the job descriptions page to use the new component

## Privacy Considerations

Our implementation follows best practices for user privacy:

1. **Opt-in Location Services**: Users must explicitly enable location services
2. **Clear Error Handling**: Users are informed when location services are unavailable
3. **No Automatic Tracking**: Location is only requested when the user clicks the "Use My Location" button
4. **Local Processing**: Distance calculations are performed client-side
5. **IP Geolocation Fallback**: Provides approximate location when GPS is unavailable
6. **User Control**: Users can choose when to enable location services

## Future Enhancements

1. **Geofencing**: Notify users when they enter areas with many job opportunities
2. **Real-Time Tracking**: Update job recommendations as the user moves
3. **Advanced Filtering**: Filter jobs by commute time rather than straight-line distance
4. **Routing Integration**: Show directions from user's location to job locations
5. **Clustering**: Group nearby jobs on the map for better visualization
6. **Heatmaps**: Show areas with high job concentration
7. **Search by Address**: Allow users to search for jobs near a specific address

## Usage Examples

### Getting User Location

```typescript
import { geolocationManager } from '@/lib/geolocationService'

const handleGetLocation = async () => {
  try {
    const location = await geolocationManager.getCurrentLocation()
    console.log(`User location: ${location.latitude}, ${location.longitude} from ${location.provider}`)
  } catch (err) {
    console.error("Error getting location:", err)
  }
}
```

### Configuring Providers

```typescript
import { geolocationManager } from '@/lib/geolocationService'

// Set a specific provider as default
geolocationManager.setCurrentProvider('smarty')

// Set fallback order
geolocationManager.setFallbackProviders(['smarty', 'ip2location', 'ipgeolocation', 'browser'])

// Add API key for a provider
geolocationManager.setApiKey('google', 'your_google_api_key')
```

### Getting User Location by IP

```typescript
import { getUserLocationByIP } from '@/lib/geolocation'

const handleGetIPLocation = async () => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY
    const location = await getUserLocationByIP(apiKey)
    console.log(`User IP location: ${location.latitude}, ${location.longitude}`)
  } catch (err) {
    console.error("Error getting IP location:", err)
  }
}
```

### Calculating Distance

```typescript
import { calculateDistance } from '@/lib/geolocation'

const distance = calculateDistance(
  userLat, userLon,    // User's location
  jobLat, jobLon       // Job's location
)
console.log(`Distance to job: ${distance} km`)
```

### Filtering by Proximity

```typescript
import { filterByProximity } from '@/lib/geolocation'

const nearbyJobs = filterByProximity(
  allJobs,      // Array of jobs
  userLat,      // User's latitude
  userLon,      // User's longitude
  50            // Max distance in km
)
```

## Map Features

### Current Features

1. **Multiple Map Layers**: Choose from 7 different map styles
2. **Custom Job Markers**: Color-coded markers based on job category
3. **Interactive Popups**: Detailed information on hover/click
4. **Zoom Controls**: Custom zoom in/out buttons
5. **Scale Indicator**: Shows map scale
6. **Layer Selector**: Switch between map types
7. **User Location Marker**: Animated marker for current position
8. **IP Geolocation Fallback**: When GPS is unavailable, IP location is used
9. **Multi-Provider Support**: Switch between different geolocation providers

### Planned Features

1. **Marker Clustering**: Group nearby jobs when zoomed out
2. **Search Functionality**: Search for locations or jobs
3. **Routing**: Show directions to job locations
4. **Geocoding**: Convert addresses to coordinates
5. **Heatmaps**: Visualize job density

## Conclusion

The geolocation implementation provides a solid foundation for location-based features in Autilance. The current implementation uses Leaflet with multiple map providers, offering detailed maps without any costs or API keys.

The implementation respects user privacy by requiring explicit opt-in for location services and performs all calculations client-side. The modular design allows for easy replacement of the map component without affecting other parts of the application.

Users can now:
- View jobs on a detailed map with multiple style options
- See their current location on the map (via GPS or IP)
- Get detailed information about jobs by hovering or clicking markers
- Switch between different map styles to suit their preferences
- Use zoom controls for detailed views
- Benefit from IP-based location when GPS is unavailable
- Switch between different geolocation providers based on configuration