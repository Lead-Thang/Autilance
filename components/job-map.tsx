"use client"

import { useState, useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapPin, Navigation, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentLocation, calculateDistance } from "@/lib/geolocation"

import { Job } from "@/types/jobs";

interface JobMapProps {
  jobs: Job[]
  onJobSelect?: (job: Job) => void
}

const JobMap = ({ jobs, onJobSelect }: JobMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Clean up existing map if it exists
    if (mapRef.current) {
      try {
        mapRef.current.remove()
      } catch (error) {
        console.warn("Error removing map:", error)
      }
    }

    // Create a new map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [0, 0],
      zoom: 2,
    })

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Store map reference
    mapRef.current = map

    // Add markers when map is loaded
    map.on('load', () => {
      updateMarkers()
    })

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (error) {
          console.warn("Error removing map:", error)
        }
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when jobs change
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded && mapRef.current.isStyleLoaded()) {
      updateMarkers()
    }
  }, [jobs])

  // Update markers on the map
  const updateMarkers = () => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove()
      } catch (error) {
        console.warn("Error removing marker:", error)
      }
    })
    markersRef.current = []

    // Add new markers for each job
    jobs.forEach(job => {
      if (job.latitude && job.longitude && mapRef.current) {
        const el = document.createElement('div')
        el.className = 'job-marker'
        el.innerHTML = `
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:bg-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        `

        el.addEventListener('click', () => {
          setSelectedJob(job)
          onJobSelect?.(job)
          
          // Fly to the marker
          if (job.longitude && job.latitude && mapRef.current) {
            try {
              mapRef.current.flyTo({
                center: [job.longitude, job.latitude],
                zoom: 12,
                essential: true
              })
            } catch (error) {
              console.warn("Error flying to marker:", error)
            }
          }
        })

        try {
          const jobMarker = new maplibregl.Marker({
            element: el
          })
            .setLngLat([job.longitude, job.latitude])
            .addTo(mapRef.current)

          markersRef.current.push(jobMarker)
        } catch (error) {
          console.warn("Error adding job marker:", error)
        }
      }
    })

    // Add user location marker if available
    if (userLocation && mapRef.current) {
      const el = document.createElement('div')
      el.className = 'user-marker'
      el.innerHTML = `
        <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      `

      try {
        const userMarker = new maplibregl.Marker({
          element: el
        })
          .setLngLat([userLocation.lon, userLocation.lat])
          .addTo(mapRef.current)

        markersRef.current.push(userMarker)
      } catch (error) {
        console.warn("Error adding user marker:", error)
      }
    }
  }

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation()
      
      setUserLocation({ 
        lat: location.latitude, 
        lon: location.longitude 
      })
      
      setMapError(null)
      
      // Update the map with the new location
      if (mapRef.current) {
        try {
          mapRef.current.flyTo({
            center: [location.longitude, location.latitude],
            zoom: 10,
            essential: true
          })
          
          // Update markers to include user location
          setTimeout(updateMarkers, 100)
        } catch (error) {
          console.warn("Error flying to user location:", error)
        }
      }
    } catch (err) {
      console.error("Error getting location:", err)
      setMapError("Unable to get your location. Please enable location services and check your internet connection.")
    }
  }

  // Calculate distance to a job
  const getDistanceToJob = (job: Job) => {
    if (!userLocation || !job.latitude || !job.longitude) return null
    return calculateDistance(userLocation.lat, userLocation.lon, job.latitude, job.longitude)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Job Locations</CardTitle>
            <CardDescription>Find jobs near you</CardDescription>
          </div>
          <Button 
            onClick={handleGetLocation}
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
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

        <div className="relative w-full h-96 rounded-lg border border-gray-200 overflow-hidden">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full"
          />
        </div>

        {userLocation && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span>
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
          {jobs.map((job) => {
            const distance = getDistanceToJob(job)
            
            return (
              <div 
                key={job.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedJob?.id === job.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedJob(job)
                  onJobSelect?.(job)
                  
                  // Fly to the job location on map
                  if (mapRef.current && job.latitude && job.longitude) {
                    try {
                      mapRef.current.flyTo({
                        center: [job.longitude, job.latitude],
                        zoom: 12,
                        essential: true
                      })
                    } catch (error) {
                      console.warn("Error flying to job location:", error)
                    }
                  }
                }}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{job.creator}</h3>
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
                {job.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">${job.price}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default JobMap