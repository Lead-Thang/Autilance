"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, 
  Calendar, 
  Download, 
  Eye, 
  Share, 
  Star, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Users,
  Loader2
} from "lucide-react"
import { getUserCertifications } from "@/app/actions/certificationActions"

// Types for our certification data
type Company = {
  id: string
  name: string
  logo?: string | null
  industry?: string | null
}

type JobDescription = {
  id: string
  title: string
}

type EarnedCertification = {
  id: string
  name: string
  description?: string | null
  issuedAt: Date
  expiresAt?: Date | null
  company: Company
  jobDescription: JobDescription
}

type InProgressCertification = {
  id: string
  status: string
  submittedAt: Date
  reviewedAt?: Date | null
  notes?: string | null
  jobDescription: JobDescription
  company: Company
}

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState("earned")
  const [isLoading, setIsLoading] = useState(true)
  const [earnedCertifications, setEarnedCertifications] = useState<EarnedCertification[]>([])
  const [inProgressCertifications, setInProgressCertifications] = useState<InProgressCertification[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true)
        const result = await getUserCertifications()
        
        if (result.success && result.data) {
          setEarnedCertifications(result.data.earnedCertifications.map(cert => ({...cert, company: {...cert.company, industry: cert.company.industry || null}})))
          setInProgressCertifications(result.data.inProgressCertifications.map(cert => ({...cert, company: {...cert.company, industry: cert.company.industry || null}})))
        } else {
          setError(result.error || "Failed to load certifications")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  // Calculate stats
  const earnedCount = earnedCertifications.length
  const inProgressCount = inProgressCertifications.length
  
  // Mock data for other stats (you can replace with real data)
  const profileViews = 234
  const skillScore = 8.7

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Error loading certifications</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Certifications</h1>
          <p className="text-gray-600">Your verified professional credentials and achievements</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Share className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedCount}</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileViews}</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillScore}</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earned">Earned Certificates</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          {earnedCertifications.length === 0 ? (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No certificates yet</h3>
              <p className="mt-1 text-gray-500">Complete verification processes to earn your first certificate.</p>
              <div className="mt-6">
                <Button>Explore Opportunities</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedCertifications.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          {cert.company.logo ? (
                            <AvatarImage src={cert.company.logo} alt={cert.company.name} />
                          ) : (
                            <AvatarFallback>
                              {cert.company.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{cert.company.name}</h3>
                          <p className="text-sm text-gray-600">{cert.company.industry || "Industry"}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2">{cert.name}</h4>
                      {cert.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {cert.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          9.2/10
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {inProgressCertifications.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No certifications in progress</h3>
              <p className="mt-1 text-gray-500">Start a verification process to work toward your next certificate.</p>
              <div className="mt-6">
                <Button>Find Opportunities</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {inProgressCertifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          {cert.company.logo ? (
                            <AvatarImage src={cert.company.logo} alt={cert.company.name} />
                          ) : (
                            <AvatarFallback>
                              {cert.company.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{cert.jobDescription.title}</h3>
                          <p className="text-sm text-gray-600">{cert.company.name}</p>
                        </div>
                      </div>
                      <Badge 
                        className={cert.status === "approved" ? "bg-green-100 text-green-800" : cert.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                      >
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Application Progress</span>
                        <span>{cert.status === "approved" ? "100%" : cert.status === "rejected" ? "0%" : "75%"}</span>
                      </div>
                      <Progress value={cert.status === "approved" ? 100 : cert.status === "rejected" ? 0 : 75} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Applied:</span>
                        <p className="font-medium">{new Date(cert.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">{cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}:</span>
                        <p className="font-medium">{cert.reviewedAt ? new Date(cert.reviewedAt).toLocaleDateString() : "Pending"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Result:</span>
                        <p className="font-medium">{cert.status === "approved" ? "Completed" : cert.status === "rejected" ? "Closed" : new Date(new Date(cert.submittedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        View Submission
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Contact Reviewer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Explore certification opportunities</h3>
            <p className="mt-1 text-gray-500">Browse available certifications from partner companies.</p>
            <div className="mt-6">
              <Button>Browse Certifications</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}