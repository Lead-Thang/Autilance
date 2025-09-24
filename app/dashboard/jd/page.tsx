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
  DollarSign,
  Tag,
  User,
  Calendar,
  CreditCard,
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

// Mock data for tasks (replacing job descriptions)
const mockTasks = [
  {
    id: "1",
    creator: "TechCorp Inc.",
    title: "Website Redesign Project",
    category: "Tech",
    price: 1200,
    verifiedCount: 24,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    updatedAt: "2 days ago",
    verifiedUsers: 12,
    location: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    remote: false,
    status: "open", // open, in_progress, completed
    description: "Need a complete redesign of our company website with modern UI/UX principles.",
    deadline: "2023-06-30",
  },
  {
    id: "2",
    creator: "DesignStudio",
    title: "Logo Design for Startup",
    category: "Design",
    price: 350,
    verifiedCount: 18,
    skills: ["Figma", "UI Design", "Prototyping", "User Research", "Wireframing"],
    updatedAt: "5 days ago",
    verifiedUsers: 8,
    location: "New York, NY",
    latitude: 40.7128,
    longitude: -74.0060,
    remote: true,
    status: "open",
    description: "Looking for a creative logo design for our new tech startup.",
    deadline: "2023-05-15",
  },
  {
    id: "3",
    creator: "GrowthCorp",
    title: "Social Media Marketing Campaign",
    category: "Marketing",
    price: 800,
    verifiedCount: 9,
    skills: ["SEO", "Social Media", "Analytics", "Content Marketing", "PPC", "Email Marketing", "Copywriting"],
    updatedAt: "1 week ago",
    verifiedUsers: 5,
    location: "Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
    remote: true,
    status: "in_progress",
    description: "Need an experienced marketer to run a 3-month social media campaign.",
    deadline: "2023-08-01",
  },
]

export default function FreelancePlatformPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [distanceFilter, setDistanceFilter] = useState<number>(50) // in kilometers
  const [selectedTask, setSelectedTask] = useState<any>(null)
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

  // Calculate distance to a task
  const getDistanceToTask = (taskLat: number, taskLon: number) => {
    if (!userLocation) return null
    return calculateDistance(userLocation.lat, userLocation.lon, taskLat, taskLon)
  }

  // Filter tasks by distance
  const filteredTasks = mockTasks.filter(task => {
    // Only show open tasks
    if (task.status !== "open") return false;
    
    // If user location not available or task is remote, show it
    if (!userLocation || !task.latitude || !task.longitude || task.remote) return true
    
    // Filter by distance for local tasks
    const distance = getDistanceToTask(task.latitude, task.longitude)
    return distance !== null && distance <= distanceFilter
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600">Browse freelance tasks or create your own</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Tasks</TabsTrigger>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="my-bids">My Bids</TabsTrigger>
          <TabsTrigger value="create">Create Task</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search tasks..." className="pl-10" />
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
                {filteredTasks.map((task) => {
                  const distance = userLocation && task.latitude && task.longitude && !task.remote
                    ? getDistanceToTask(task.latitude, task.longitude)?.toFixed(1)
                    : null

                  return (
                    <Card 
                      key={task.id} 
                      className={`hover:shadow-lg transition-shadow cursor-pointer ${
                        selectedTask?.id === task.id ? "border-blue-500 border-2" : ""
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-800">{task.category}</Badge>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-bold text-gray-600">${task.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>{task.creator.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{task.creator}</CardTitle>
                            <CardDescription>{task.title}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">{task.description}</p>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Required Skills</div>
                            <div className="flex flex-wrap gap-2">
                              {task.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="bg-slate-100">
                                  {skill}
                                </Badge>
                              ))}
                              {task.skills.length > 3 && (
                                <Badge variant="outline" className="bg-slate-100">
                                  +{task.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              Updated {task.updatedAt}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {task.verifiedUsers} verified users
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {task.deadline}
                            </div>
                            <div className="flex items-center text-gray-600">
                              {task.remote ? (
                                <span className="flex items-center">
                                  <Tag className="w-4 h-4 mr-1" />
                                  Remote
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {task.location}
                                </span>
                              )}
                            </div>
                            {distance && !task.remote && (
                              <div className="flex items-center text-blue-600 font-medium">
                                {distance} km away
                              </div>
                            )}
                          </div>
                          
                          <Button className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Task Details
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
                jobs={mockTasks} 
                onJobSelect={setSelectedTask} 
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>Manage your created tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Website Redesign Project</h3>
                    <p className="text-sm text-gray-600">Created 2 weeks ago • $1200</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-green-100 text-green-800">Open</Badge>
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
                    <h3 className="font-semibold">Logo Design for Startup</h3>
                    <p className="text-sm text-gray-600">Created 1 month ago • $350</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-bids" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Bids</CardTitle>
              <CardDescription>Track your submitted bids on tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">TechCorp Inc. - Website Redesign Project</h3>
                    <p className="text-sm text-gray-600">Bid submitted 3 days ago • $1100</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Accepted</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">DesignStudio - Logo Design</h3>
                    <p className="text-sm text-gray-600">Bid submitted on May 15, 2023 • $300</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Earnings</CardTitle>
              <CardDescription>Track your completed tasks and earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">Total Earnings</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-3">$2,450</p>
                  <Badge className="bg-green-100 text-green-800">+12% from last month</Badge>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">Completed Tasks</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-3">18</p>
                  <Badge className="bg-blue-100 text-blue-800">3 in progress</Badge>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold">Average Rating</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-3">4.8/5.0</p>
                  <Badge className="bg-amber-100 text-amber-800">Top Rated</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>Define the skills, budget, and requirements for your task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input placeholder="e.g., Website Redesign Project" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Company/Name</label>
                  <Input placeholder="Your company name or personal name" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="number"
                    placeholder="e.g., 500" 
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-600">Set a fair price for the task</p>
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
                <p className="text-sm text-gray-600">Enter a location or "Remote" for remote tasks</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="date"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 border rounded-md" 
                  placeholder="Describe the task in detail..."
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
                <label className="text-sm font-medium">Required Experience</label>
                <div className="border rounded-md p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input placeholder="Add experience requirement (e.g., 3+ years in web development)" className="flex-1" />
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
                    <Input placeholder="Title (e.g., Project Brief)" className="flex-1" />
                    <Input placeholder="URL (https://...)" className="flex-1" />
                    <Button size="sm">Add</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Post Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}