"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, ZoomIn, ZoomOut, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { geolocationManager } from "@/lib/geolocationService"
import { calculateDistance } from "@/lib/geolocation"
import { useGeolocation } from "@/lib/geolocationContext"

// Extend the L object with the provider function from leaflet-providers
declare module 'leaflet' {
  interface TileLayerStatic {
    provider: (provider: string) => any;
  }
}

// Define the Job type
interface Job {
  id: string
  company: string
  title: string
  category: string
  verifiedCount: number
  skills: string[]
  updatedAt: string
  verifiedUsers: number
  location: string
  latitude?: number
  longitude?: number
}

interface JobMapProps {
  jobs: Job[]
  onJobSelect?: (job: Job) => void
}

const JobMap = ({ jobs, onJobSelect }: JobMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [locationProvider, setLocationProvider] = useState<string | null>(null)
  const { selectedProvider } = useGeolocation()

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    let L: any;
    let map: any;
    
    const initMap = async () => {
      try {
        // Dynamically import leaflet only on client side
        const leafletModule = await import('leaflet');
        L = leafletModule.default;
        
        // Import leaflet providers for more map options
        await import('leaflet-providers');

        // Fix for default marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
          iconUrl: require('leaflet/dist/images/marker-icon.png').default,
          shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
        });

        // Create map instance with more detailed configuration
        map = L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: false, // We'll add custom controls
          layers: []
        });
        mapInstanceRef.current = map;

        // Add multiple tile layers for more detail
        const baseLayers = {
          "OpenStreetMap": L.tileLayer.provider('OpenStreetMap.Mapnik'),
          "OpenTopoMap": L.tileLayer.provider('OpenTopoMap'),
          "Esri WorldStreetMap": L.tileLayer.provider('Esri.WorldStreetMap'),
          "Esri WorldImagery": L.tileLayer.provider('Esri.WorldImagery'),
          "CartoDB Voyager": L.tileLayer.provider('CartoDB.Voyager'),
          "OpenStreetMap DE": L.tileLayer.provider('OpenStreetMap.DE'),
          "OpenStreetMap France": L.tileLayer.provider('OpenStreetMap.France')
        };

        // Add default layer
        baseLayers["OpenStreetMap"].addTo(map);

        // Add layer control
        L.control.layers(baseLayers).addTo(map);

        // Add scale control
        L.control.scale({ imperial: false }).addTo(map);

        // Add job markers
        updateMarkers();

        setMapLoaded(true);

        return () => {
          if (map) {
            map.remove();
          }
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to initialize map. Please try again.");
      }
    };

    initMap();

    // Clean up function
    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [isClient, jobs, selectedProvider]);

  // Update markers when jobs or user location change
  const updateMarkers = async () => {
    if (!mapInstanceRef.current) return;

    // Dynamically import leaflet only on client side
    const leafletModule = await import('leaflet');
    const L = leafletModule.default;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Custom icons for different job categories
    const techIcon = L.divIcon({
      className: 'custom-icon',
      html: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg transform hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
               </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const designIcon = L.divIcon({
      className: 'custom-icon',
      html: `<div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg transform hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" />
               </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marketingIcon = L.divIcon({
      className: 'custom-icon',
      html: `<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg transform hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                 <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
               </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add markers for jobs
    jobs.forEach(job => {
      if (job.latitude && job.longitude) {
        // Choose icon based on category
        let icon = techIcon;
        if (job.category === 'Design') {
          icon = designIcon;
        } else if (job.category === 'Marketing') {
          icon = marketingIcon;
        }

        const marker = L.marker([job.latitude, job.longitude], { icon }).addTo(mapInstanceRef.current);
        
        // Add detailed popup
        marker.bindPopup(`
          <div class="min-w-[250px]">
            <h3 class="font-bold text-lg text-gray-800">${job.company}</h3>
            <p class="text-blue-600 font-medium mb-2">${job.title}</p>
            <div class="space-y-1">
              <p class="text-sm"><span class="font-medium">📍 Location:</span> ${job.location}</p>
              <p class="text-sm"><span class="font-medium">💼 Category:</span> ${job.category}</p>
              <p class="text-sm"><span class="font-medium">👥 Verified Users:</span> ${job.verifiedUsers}</p>
              <p class="text-sm"><span class="font-medium">✅ Total Verifications:</span> ${job.verifiedCount}</p>
            </div>
            <div class="mt-3">
              <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                ${job.skills.slice(0, 3).join(', ')}${job.skills.length > 3 ? ` +${job.skills.length - 3} more` : ''}
              </span>
            </div>
          </div>
        `, {
          className: 'custom-popup',
          maxWidth: 300
        });
        
        // Add mouse events for better interaction
        marker.on('click', () => {
          setSelectedJob(job);
          onJobSelect?.(job);
        });
        
        marker.on('mouseover', function (this: any) {
          this.openPopup();
        });
        
        marker.on('mouseout', function (this: any) {
          if (selectedJob?.id !== job.id) {
            this.closePopup();
          }
        });
        
        markersRef.current.push(marker);
      }
    });

    // Add user location marker if available
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lon], {
        icon: L.divIcon({
          className: 'user-marker',
          html: `<div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(mapInstanceRef.current);
      
      userMarker.bindPopup(`<b>Your Location (${locationProvider})</b>`, {
        className: 'custom-popup'
      });
      markersRef.current.push(userMarker);
      
      // Center map on user location
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lon], 10);
    }
  };

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      // Set the provider before getting location
      geolocationManager.setCurrentProvider(selectedProvider);
      
      // Get location with better accuracy
      const location = await geolocationManager.getCurrentLocation();
      
      setUserLocation({ 
        lat: location.latitude, 
        lon: location.longitude 
      });
      setLocationProvider(location.provider);
      setMapError(null);
      
      // Update markers to show user location
      updateMarkers();
    } catch (err) {
      console.error("Error getting location:", err);
      setMapError("Unable to get your location. Please enable location services and check your internet connection.");
    }
  };

  // Cleanup function to remove geolocation resources
  useEffect(() => {
    return () => {
      // Any necessary cleanup is handled by the browser automatically
    };
  }, []);

  // Calculate distance to a job
  const getDistanceToJob = (job: Job) => {
    if (!userLocation || !job.latitude || !job.longitude) return null;
    return calculateDistance(userLocation.lat, userLocation.lon, job.latitude, job.longitude);
  };

  // Map controls
  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Only render map on client side
  if (!isClient) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Job Locations</CardTitle>
              <CardDescription>Find jobs near you on the map</CardDescription>
            </div>
            <Button 
              onClick={handleGetLocation}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Use My Location
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full h-96 rounded-lg border border-gray-200 flex items-center justify-center">
            <p>Loading map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Job Locations</CardTitle>
            <CardDescription>Find jobs near you on the map</CardDescription>
          </div>
          <Button 
            onClick={handleGetLocation}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Use My Location
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">{mapError}</p>
          </div>
        )}

        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-200 relative"
          style={{ minHeight: '300px' }}
        >
          {/* Map will be initialized here by Leaflet */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p>Loading detailed map...</p>
            </div>
          )}
        </div>

        {/* Custom map controls */}
        {mapLoaded && (
          <div className="absolute top-20 right-4 flex flex-col gap-2 z-[1000]">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={zoomIn}
              className="flex items-center justify-center w-10 h-10 shadow-lg"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={zoomOut}
              className="flex items-center justify-center w-10 h-10 shadow-lg"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
          </div>
        )}

        {userLocation && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span>
              Your location ({locationProvider}): {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const distance = getDistanceToJob(job);
            
            return (
              <div 
                key={job.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedJob?.id === job.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedJob(job);
                  onJobSelect?.(job);
                }}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{job.company}</h3>
                  {distance && (
                    <span className="text-sm text-blue-600 font-medium">
                      {distance.toFixed(1)} km away
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{job.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{job.location}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-control-layers {
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .leaflet-control-layers-toggle {
          border-radius: 4px;
        }
        .leaflet-control-layers-expanded {
          border-radius: 8px;
          padding: 6px 10px;
        }
        .leaflet-control-layers label {
          font-size: 14px;
        }
        .leaflet-control-scale {
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          border-radius: 4px;
          padding: 2px 5px;
        }
        .custom-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </Card>
  )
}

export default JobMap