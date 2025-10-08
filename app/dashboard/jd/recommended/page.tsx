"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sparkles,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Briefcase
} from "lucide-react"

interface MatchScore {
  totalScore: number
  breakdown: {
    skillsMatch: number
    budgetFit: number
    clientQuality: number
    jobTypePreference: number
    locationMatch: number
    riskAssessment: number
  }
  reasons: string[]
  warnings: string[]
}

interface Job {
  id: string
  title: string
  jobType: string
  industry?: string
  isRemote: boolean
  location?: string
  budgetMinCents?: number
  budgetMaxCents?: number
  hourlyRateMin?: number
  hourlyRateMax?: number
  clientVerified: boolean
  clientRating?: number
  createdAt: string
  company: {
    id: string
    name: string
    logo?: string
  }
  requiredSkills: Array<{ name: string; level: string }>
  matchScore: MatchScore
}

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [minScore, setMinScore] = useState(60)

  useEffect(() => {
    fetchRecommendedJobs()
  }, [minScore])

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jd/recommended?minScore=${minScore}&limit=20`)
      const data = await response.json()

      if (response.ok) {
        setJobs(data.jobs)
      } else {
        console.error("Error fetching recommended jobs:", data.error)
      }
    } catch (error) {
      console.error("Error fetching recommended jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const formatBudget = (job: Job) => {
    if (job.hourlyRateMin && job.hourlyRateMax) {
      return `$${job.hourlyRateMin}-${job.hourlyRateMax}/hr`
    }
    if (job.budgetMinCents && job.budgetMaxCents) {
      const min = (job.budgetMinCents / 100).toFixed(0)
      const max = (job.budgetMaxCents / 100).toFixed(0)
      return `$${min}-${max}`
    }
    return "Budget not specified"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Recommended for You
          </h1>
          <p className="text-gray-600">
            Jobs matched to your skills, preferences, and work history
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Match Threshold</CardTitle>
          <CardDescription>Minimum match score to display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="flex-1"
            />
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {minScore}+
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Matching Jobs Found</h3>
            <p className="text-gray-600 mb-4">
              Try lowering the match threshold or update your profile to get better recommendations
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              Update Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.company.logo} />
                      <AvatarFallback>{job.company.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        {job.clientVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{job.company.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{job.jobType}</Badge>
                        {job.isRemote && <Badge variant="outline">Remote</Badge>}
                        {job.location && <Badge variant="outline">{job.location}</Badge>}
                        {job.industry && <Badge variant="outline">{job.industry}</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(job.matchScore.totalScore).split(' ')[0]}`}>
                      {job.matchScore.totalScore}
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                    <Badge className={`mt-1 ${getScoreColor(job.matchScore.totalScore)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {job.matchScore.totalScore >= 80 ? 'Excellent' :
                       job.matchScore.totalScore >= 60 ? 'Good' : 'Fair'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Budget */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="font-semibold">{formatBudget(job)}</span>
                </div>

                {/* Skills Match */}
                <div>
                  <div className="text-sm font-medium mb-2">Required Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                        <span className="ml-1 text-xs opacity-70">({skill.level})</span>
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 6 && (
                      <Badge variant="outline">+{job.requiredSkills.length - 6} more</Badge>
                    )}
                  </div>
                </div>

                {/* Match Breakdown */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Match Breakdown</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Skills</div>
                      <div className="text-blue-600 font-bold">{job.matchScore.breakdown.skillsMatch}/30</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-medium">Budget</div>
                      <div className="text-green-600 font-bold">{job.matchScore.breakdown.budgetFit}/20</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <div className="font-medium">Client</div>
                      <div className="text-purple-600 font-bold">{job.matchScore.breakdown.clientQuality}/20</div>
                    </div>
                  </div>
                </div>

                {/* Why It's a Good Match */}
                {job.matchScore.reasons.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-700 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Why this matches
                    </div>
                    <ul className="text-sm text-green-600 space-y-1">
                      {job.matchScore.reasons.slice(0, 3).map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {job.matchScore.warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-yellow-700 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Things to consider
                    </div>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {job.matchScore.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
