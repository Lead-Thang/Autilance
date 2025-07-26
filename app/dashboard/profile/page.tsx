"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import { useUser } from "../../../hooks/use-user"
import { MapPin, Globe, Calendar, Award, Star, Eye, Share, Edit, Mail, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const { user, isLoading } = useUser()
  const [currentContextIndex, setCurrentContextIndex] = useState(0)
  const [userContexts, setUserContexts] = useState([
    { name: "Professional" },
    { name: "Personal" },
    { name: "Freelance" }
  ])

  const switchUserContext = (index: number) => {
    setCurrentContextIndex(index)
    // Additional context switching logic could be added here
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Your professional profile and achievements</p>
        </div>
        <div className="flex space-x-4 items-center">
          {/* Profile Selector Dropdown */}
          <select
            className="border rounded px-3 py-1 text-sm"
            value={currentContextIndex}
            onChange={(e) => {
              const selectedIndex = Number(e.target.value)
              switchUserContext(selectedIndex)
            }}
          >
            {userContexts.map((profile, index) => (
              <option key={index} value={index}>
                {profile.name || `Profile ${index + 1}`}
              </option>
            ))}
          </select>

          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Share className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user?.displayName?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold mb-1">{user?.name || "User Name"}</h2>
                <p className="text-gray-600 mb-2">@{user?.displayName?.toLowerCase().replace(" ", "") || "username"}</p>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {user?.provider === "google" ? "Google" : user?.provider === "github" ? "GitHub" : "Email"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Full-stack developer passionate about AI and creating innovative solutions. Certified in React,
                  Node.js, and machine learning.
                </p>

                <Button className="w-full mb-4 bg-transparent" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user?.email || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>alexjohnson.dev</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined December 2023</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Certifications</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skill Score</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">8.7/10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Recent Certifications</span>
              </CardTitle>
              <CardDescription>Your latest verified achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">Full Stack Developer</h4>
                    <p className="text-sm text-gray-600">TechCorp Inc. • December 2023</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">9.2</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">UI/UX Designer</h4>
                    <p className="text-sm text-gray-600">DesignStudio • November 2023</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">8.8</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">AI Specialist</h4>
                    <p className="text-sm text-gray-600">AI Innovations • October 2023</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">9.5</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Certifications
              </Button>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Your verified professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Badge variant="secondary" className="justify-center py-2">
                  React
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  Node.js
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  TypeScript
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  Python
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  AI/ML
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  UI/UX Design
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  PostgreSQL
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  AWS
                </Badge>
                <Badge variant="secondary" className="justify-center py-2">
                  Docker
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest platform interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Earned certification</span> from TechCorp Inc.
                    </p>
                    <p className="text-xs text-gray-600">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Applied for</span> Blockchain Developer certification
                    </p>
                    <p className="text-xs text-gray-600">5 days ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Updated profile</span> with new skills
                    </p>
                    <p className="text-xs text-gray-600">1 week ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Connected with</span> 5 new professionals
                    </p>
                    <p className="text-xs text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
