"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  CheckCircle,
  Clock,
  Users,
  FileText,
  BookOpen,
  Code,
  MessageSquare,
  Eye,
  Star,
  MapPin,
  Navigation,
} from "lucide-react"
import JobMap from "@/components/job-map"
import { calculateDistance } from "@/lib/geolocation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGeolocation } from "@/lib/geolocationContext"
import { geolocationManager } from "@/lib/geolocationService"

// Mock data for job descriptions
const mockJobDescriptions = [
  {
    id: "1",
    company: "TechCorp Inc.",
    title: "Full Stack Developer",
    category: "Tech",
    verifiedCount: 24,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    updatedAt: "2 days ago",
    verifiedUsers: 12,
    location: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: "2",
    company: "DesignStudio",
    title: "UI/UX Designer",
    category: "Design",
    verifiedCount: 18,
    skills: ["Figma", "UI Design", "Prototyping", "User Research", "Wireframing"],
    updatedAt: "5 days ago",
    verifiedUsers: 8,
    location: "New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: "3",
    company: "GrowthCorp",
    title: "Digital Marketing Specialist",
    category: "Marketing",
    verifiedCount: 9,
    skills: ["SEO", "Social Media", "Analytics", "Content Marketing", "PPC", "Email Marketing", "Copywriting"],
    updatedAt: "1 week ago",
    verifiedUsers: 5,
    location: "Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
  },
]

export default function JobDescriptionsPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [distanceFilter, setDistanceFilter] = useState<number>(50) // in kilometers
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const { selectedProvider, setSelectedProvider } = useGeolocation()

  // Get user's current location
  const handleGetLocation = async () => {
    try {
      // Set the provider before getting location
      geolocationManager.setCurrentProvider(selectedProvider);
      
      const location = await geolocationManager.getCurrentLocation()
      setUserLocation({ lat: location.latitude, lon: location.longitude })
      setLocationError(null)
    } catch (err) {
      console.error("Error getting location:", err)
      setLocationError("Unable to get your location. Please enable location services.")
    }
  }

  // Calculate distance to a job
  const getDistanceToJob = (jobLat: number, jobLon: number) => {
    if (!userLocation) return null
    return calculateDistance(userLocation.lat, userLocation.lon, jobLat, jobLon)
  }

  // Filter jobs by distance
  const filteredJobs = mockJobDescriptions.filter(job => {
    if (!userLocation || !job.latitude || !job.longitude) return true
    const distance = getDistanceToJob(job.latitude, job.longitude)
    return distance !== null && distance <= distanceFilter
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-gray-600">Browse company requirements or create your own JD</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create JD
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="my-jds">My Jobs</TabsTrigger>
          <TabsTrigger value="verifications">My Verifications</TabsTrigger>
          <TabsTrigger value="create">Create Job</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search job descriptions..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              {userLocation ? (
                <div className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
                  <Navigation className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    Nearby ({distanceFilter} km)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="browser">Browser Geolocation</SelectItem>
                      <SelectItem value="ipgeolocation">ipgeolocation.io</SelectItem>
                      <SelectItem value="ip2location">IP2Location</SelectItem>
                      <SelectItem value="smarty">Smarty</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={handleGetLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Enable Location
                  </Button>
                </div>
              )}
            </div>
          </div>

          {locationError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800 text-sm">{locationError}</p>
            </div>
          )}

          {userLocation && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Distance:</span>
              <Input
                type="range"
                min="5"
                max="200"
                step="5"
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(Number(e.target.value))}
                className="max-w-xs"
              />
              <span className="text-sm font-medium">{distanceFilter} km</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => {
                  const distance = userLocation && job.latitude && job.longitude 
                    ? getDistanceToJob(job.latitude, job.longitude)?.toFixed(1)
                    : null

                  return (
                    <Card 
                      key={job.id} 
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${
                        selectedJob?.id === job.id ? "border-blue-500 border-2" : ""
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-800">{job.category}</Badge>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Verified: {job.verifiedCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{job.company}</CardTitle>
                            <CardDescription>{job.title}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Required Skills</div>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="bg-slate-100">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 3 && (
                                <Badge variant="outline" className="bg-slate-100">
                                  +{job.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              Updated {job.updatedAt}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {job.verifiedUsers} verified users
                            </div>
                          </div>

                          {job.location && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </div>
                              {distance && (
                                <div className="flex items-center text-blue-600 font-medium">
                                  {distance} km away
                                </div>
                              )}
                            </div>
                          )}
                          
                          <Button className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Requirements
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
            
            <div>
              <JobMap 
                jobs={mockJobDescriptions} 
                onJobSelect={setSelectedJob} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-jds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Job Descriptions</CardTitle>
              <CardDescription>Manage your company's job descriptions and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Full Stack Developer</h3>
                    <p className="text-sm text-gray-600">Created 2 weeks ago • 24 verified users</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Product Manager</h3>
                    <p className="text-sm text-gray-600">Created 1 month ago • 15 verified users</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Verification Status</CardTitle>
              <CardDescription>Track your verification submissions and badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">TechCorp Inc. - Full Stack Developer</h3>
                    <p className="text-sm text-gray-600">Submitted 3 days ago</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">DesignStudio - UI/UX Designer</h3>
                    <p className="text-sm text-gray-600">Verified on May 15, 2023</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-1" />
                    View Badge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Showcase your verified skills and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">Full Stack Developer</h3>
                  <p className="text-sm text-gray-600 mb-3">TechCorp Inc.</p>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">UI/UX Designer</h3>
                  <p className="text-sm text-gray-600 mb-3">DesignStudio</p>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Job Description</CardTitle>
              <CardDescription>Define the skills, behaviors, and knowledge required for your role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input placeholder="e.g., Full Stack Developer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input placeholder="Your company name" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="e.g., San Francisco, CA or Remote" 
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-600">Enter a location or &quot;Remote&quot; for remote positions</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 border rounded-md" 
                  placeholder="Describe the role and your company..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Required Skills</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Add a skill (e.g., React)" className="flex-1" />
                    <select className="border rounded-md p-2">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                    <Button size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="flex items-center gap-1 px-3 py-1">
                      React
                      <span className="text-xs bg-blue-200 text-blue-800 rounded px-1">Advanced</span>
                      <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                    </Badge>
                    <Badge className="flex items-center gap-1 px-3 py-1">
                      Node.js
                      <span className="text-xs bg-blue-200 text-blue-800 rounded px-1">Intermediate</span>
                      <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Required Behaviors</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Add a behavior (e.g., Team Communication)" className="flex-1" />
                    <select className="border rounded-md p-2">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                    <Button size="sm">Add</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Team Communication</p>
                        <p className="text-xs text-gray-600">Must be responsive in team chats and meetings</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Required Certifications</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Add a certification (e.g., AWS Certified Developer)" className="flex-1" />
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Documents & Resources</label>
                <div className="border rounded-md p-4">
                  <Button variant="outline" className="w-full h-24 border-dashed">
                    <Plus className="w-6 h-6 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">External Links</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Title (e.g., Company Handbook)" className="flex-1" />
                    <Input placeholder="URL (https://...)" className="flex-1" />
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Rules & Culture</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Add a rule (e.g., Camera On Policy)" className="flex-1" />
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Publish Job Description
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}