"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import { useUser } from "../../../hooks/use-user"
import { MapPin, Globe, Calendar, Award, Star, Eye, Share, Edit, Mail, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { EditProfileModal } from "@/components/edit-profile-modal"

interface Certification {
  id: string
  name: string
  issuer: string
  issuedAt: string
  score: number
}

interface Skill {
  id: string
  name: string
}

interface Activity {
  id: string
  action: string
  timestamp: string
  description: string
}

export default function ProfilePage() {
  const { user, isLoading, setUser } = useUser()
  const { toast } = useToast()
  const [currentContextIndex, setCurrentContextIndex] = useState(0)
  const [userContexts, setUserContexts] = useState([
    { name: "Professional" },
    { name: "Personal" },
    { name: "Freelance" }
  ])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    profileViews: 0,
    connections: 0,
    certifications: 0,
    skillScore: 0
  })
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const switchUserContext = (index: number) => {
    setCurrentContextIndex(index)
    // Additional context switching logic could be added here
  }

  useEffect(() => {
    if (user?.id) {
      fetchUserData()
    }
  }, [user?.id])

  const fetchUserData = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()
      // Fetch certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from('badges')
        .select('id, name, company:companies(name), issued_at')
        .eq('user_id', user.id)
      
      if (certificationsError) {
        console.error("Error fetching certifications:", certificationsError)
      } else {
        setCertifications(certificationsData.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.company && cert.company.length > 0 ? cert.company[0].name : "Unknown",
          issuedAt: new Date(cert.issued_at).toLocaleDateString(),
          score: Math.floor(Math.random() * 3) + 8 // Random score between 8-10 for demo
        })))
      }

      // Fetch skills
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('skills')
        .eq('id', user.id)
        .single()
      
      if (userError) {
        console.error("Error fetching user skills:", userError)
      } else {
        setSkills((userData.skills || []).map((skill: string, index: number) => ({
          id: `skill-${index}`,
          name: skill
        })))
      }

      // Fetch activities (simplified - in a real app this would come from a dedicated table)
      const activitiesData = [
        {
          id: "1",
          action: "Earned certification",
          timestamp: "2 days ago",
          description: `from ${certificationsData && certificationsData.length > 0 && certificationsData[0].company && certificationsData[0].company.length > 0 ? certificationsData[0].company[0].name : "a company"}`
        },
        {
          id: "2",
          action: "Applied for",
          timestamp: "5 days ago",
          description: "Blockchain Developer certification"
        },
        {
          id: "3",
          action: "Updated profile",
          timestamp: "1 week ago",
          description: "with new skills"
        },
        {
          id: "4",
          action: "Connected with",
          timestamp: "1 week ago",
          description: "5 new professionals"
        }
      ]
      setActivities(activitiesData)

      // Set stats (simplified - in a real app this would come from actual data)
      setStats({
        profileViews: Math.floor(Math.random() * 1000) + 500,
        connections: Math.floor(Math.random() * 100) + 50,
        certifications: certificationsData?.length || 0,
        skillScore: Math.floor(Math.random() * 3) + 7 // Random score between 7-9 for demo
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
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
                  {user?.bio || "Professional with expertise in various fields. Add a bio to tell others about yourself."}
                </p>

                <Button 
                  className="w-full mb-4 bg-transparent" 
                  variant="outline"
                  onClick={() => setIsEditingProfile(true)}
                >
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
                    <span>{user?.location || "Location not set"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{user?.website || "Website not set"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Unknown"}</span>
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
                <span className="font-semibold">{stats.profileViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="font-semibold">{stats.connections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Certifications</span>
                <span className="font-semibold">{stats.certifications}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skill Score</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{stats.skillScore.toFixed(1)}/10</span>
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
                {certifications.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{cert.issuer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.issuedAt}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{cert.score.toFixed(1)}</span>
                    </div>
                  </div>
                ))}

                {certifications.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No certifications earned yet</p>
                )}
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
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="justify-center py-2">
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-3 py-4">No skills added yet</p>
                )}
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
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span> {activity.description}
                      </p>
                      <p className="text-xs text-gray-600">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <EditProfileModal 
        open={isEditingProfile} 
        onOpenChange={setIsEditingProfile} 
      />
    </div>
  )
}