"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentLocation, calculateDistance } from "@/lib/geolocation"

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

interface SimpleMapProps {
  jobs: Job[]
  onJobSelect?: (job: Job) => void
}

const SimpleMap = ({ jobs, onJobSelect }: SimpleMapProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [center, setCenter] = useState({ x: 50, y: 50 })

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation()
      setUserLocation({ lat: location.latitude, lon: location.longitude })
      setMapError(null)
      // Center map on user location
      const { x, y } = latLonToXY(location.latitude, location.longitude)
      setCenter({ x, y })
    } catch (err) {
      console.error("Error getting location:", err)
      setMapError("Unable to get your location. Please enable location services.")
    }
  }

  // Calculate distance to a job
  const getDistanceToJob = (job: Job) => {
    if (!userLocation || !job.latitude || !job.longitude) return null
    return calculateDistance(userLocation.lat, userLocation.lon, job.latitude, job.longitude)
  }

  // Convert lat/lon to map coordinates (improved projection)
  const latLonToXY = (lat: number, lon: number) => {
    // Mercator projection simulation for better visualization
    const x = ((lon + 180) / 360) * 100
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)))
    const y = (1 - (mercN / Math.PI)) * 50
    
    // Apply zoom and center
    const zoomedX = 50 + (x - center.x) * zoomLevel
    const zoomedY = 50 + (y - center.y) * zoomLevel
    
    return { x: zoomedX, y: zoomedY }
  }

  // Pan the map
  const panMap = (dx: number, dy: number) => {
    setCenter(prev => ({
      x: prev.x - (dx / zoomLevel),
      y: prev.y - (dy / zoomLevel)
    }))
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

        <div className="relative w-full h-96 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          {/* Simplified map representation with more details */}
          <div className="absolute inset-0">
            {/* Detailed grid lines for visual reference */}
            <div className="absolute inset-0 bg-detailed-grid-pattern opacity-30"></div>
            
            {/* Continent-like areas for better visualization */}
            <div className="absolute top-10 left-5 w-20 h-16 bg-green-100 rounded-lg opacity-50"></div>
            <div className="absolute top-20 right-10 w-24 h-20 bg-amber-100 rounded-xl opacity-50"></div>
            <div className="absolute bottom-16 left-16 w-32 h-24 bg-emerald-100 rounded-lg opacity-50"></div>
            <div className="absolute top-8 right-20 w-28 h-18 bg-blue-100 rounded-lg opacity-50"></div>
            
            {/* Water bodies */}
            <div className="absolute top-32 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-40"></div>
            <div className="absolute bottom-20 right-16 w-20 h-8 bg-blue-200 rounded-lg opacity-40"></div>
            
            {/* Job markers */}
            {jobs
              .filter(job => job.latitude && job.longitude)
              .map((job, index) => {
                const { x, y } = latLonToXY(job.latitude!, job.longitude!)
                // Only show markers that are within view
                if (x < -20 || x > 120 || y < -20 || y > 120) return null
                
                return (
                  <div
                    key={job.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedJob?.id === job.id ? 'scale-125 z-10' : ''
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => {
                      setSelectedJob(job)
                      onJobSelect?.(job)
                    }}
                  >
                    <div className="relative">
                      <MapPin 
                        className={`w-6 h-6 ${
                          selectedJob?.id === job.id 
                            ? 'text-red-600 fill-red-200' 
                            : job.category === 'Tech' 
                              ? 'text-blue-600 fill-blue-200'
                              : job.category === 'Design'
                                ? 'text-purple-600 fill-purple-200'
                                : 'text-green-600 fill-green-200'
                        }`} 
                      />
                      {selectedJob?.id === job.id && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded shadow text-xs font-medium whitespace-nowrap border z-20">
                          <div className="font-bold">{job.company}</div>
                          <div>{job.title}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            
            {/* User location marker */}
            {userLocation && (() => {
              const { x, y } = latLonToXY(userLocation.lat, userLocation.lon)
              // Only show if within view
              if (x < -20 || x > 120 || y < -20 || y > 120) return null
              
              return (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                      You
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
          
          {/* Map controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
              className="flex items-center justify-center"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 0.5))}
              className="flex items-center justify-center"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Pan controls */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => panMap(0, -5)}
              className="w-8 h-8"
            >
              ↑
            </Button>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => panMap(-5, 0)}
                className="w-8 h-8"
              >
                ←
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => panMap(5, 0)}
                className="w-8 h-8"
              >
                →
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => panMap(0, 5)}
              className="w-8 h-8"
            >
              ↓
            </Button>
          </div>
          
          {/* Zoom level indicator */}
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
            Zoom: {zoomLevel.toFixed(1)}x
          </div>
        </div>

        {userLocation && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <style jsx>{`
        .bg-detailed-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @media (max-width: 768px) {
          .bg-detailed-grid-pattern {
            background-size: 10px 10px;
          }
        }
      `}</style>
    </Card>
  )
}

export default SimpleMap