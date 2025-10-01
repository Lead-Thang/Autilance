"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import dynamic from "next/dynamic"
import { JobFilters } from "@/components/job-filters"
import { calculateClientFitScore, getFitReasons, getRiskFactors } from "@/lib/client-fit-score"

// Dynamically import JobMap to prevent SSR issues with Leaflet
const JobMap = dynamic(() => import("@/components/job-map"), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center">Loading map...</div>
})

// Define types first
type JobSkill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

type JobBehavior = {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

type JobCertification = {
  name: string;
  required: boolean;
}

type JobDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
}

type JobLink = {
  title: string;
  url: string;
}

type JobRule = {
  title: string;
  description: string;
}

// Define type for filters
type JobFilters = {
  search?: string;
  verifiedPayment?: boolean;
  spendTier?: string;
  minHireRate?: number;
  minRating?: number;
  budgetType?: string;
  hourlyRate?: string;
  premiumWillingness?: boolean;
  industry?: string;
  projectType?: string;
  unpaidTest?: boolean;
  scopeCreepHistory?: boolean;
  extremeNDA?: boolean;
}

type Job = {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  skills: JobSkill[];
  behaviors: JobBehavior[];
  certifications?: JobCertification[];
  documents?: JobDocument[];
  links?: JobLink[];
  rules?: JobRule[];
  verifiedCount: number;
  verifiedUsers: number;
  updatedAt: string;
  coordinates?: { lat: number; lng: number };
  // Adding properties required by JobMap component
  creator: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  remote?: boolean;
  status?: string;
  deadline?: string;
  // Client quality metrics
  clientSpend?: string;
  clientHireRate?: number;
  clientRating?: number;
  clientVerified?: boolean;
  budgetType?: 'fixed' | 'hourly';
  hourlyRate?: string;
  projectType?: string;
  industry?: string;
  riskFlags?: string[];
}

type VerificationStatus = {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
}

type Badge = {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  verified: boolean;
}

export default function JobDescriptionsPage() {
  const [activeTab, setActiveTab] = useState("browse")
  // State for job data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [myVerifications, setMyVerifications] = useState<VerificationStatus[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyJobs, setLoadingMyJobs] = useState(true);
  const [loadingVerifications, setLoadingVerifications] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});

  // Load data from API
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call to fetch public jobs
        // const response = await fetch('/api/jobs'); 
        // const data = await response.json();
        // setJobs(data);
        
        // For now, setting to an empty array to prepare for real data
        // Mock data for testing type compatibility
        const mockJobs: Job[] = [{
          id: "1",
          title: "Frontend Developer",
          company: "Tech Corp",
          category: "Engineering",
          description: "Develop user-facing features",
          skills: [{ name: "React", level: "advanced" }],
          behaviors: [{ name: "Teamwork", description: "Collaborate effectively", priority: "high" }],
          verifiedCount: 5,
          verifiedUsers: 10,
          updatedAt: "2023-01-01",
          creator: "Tech Corp", // Required by JobMap
          location: "New York, NY", // Required by JobMap
          latitude: 40.7128,
          longitude: -74.0060,
          clientSpend: "5-50k",
          clientHireRate: 45,
          clientRating: 4.8,
          clientVerified: true,
          budgetType: "hourly",
          hourlyRate: "40-80",
          projectType: "new-build",
          industry: "saas"
        }, {
          id: "2",
          title: "UX Designer",
          company: "Design Studio",
          category: "Design",
          description: "Create beautiful user experiences",
          skills: [{ name: "Figma", level: "expert" }],
          behaviors: [{ name: "Creativity", description: "Think outside the box", priority: "high" }],
          verifiedCount: 12,
          verifiedUsers: 24,
          updatedAt: "2023-02-15",
          creator: "Design Studio",
          location: "San Francisco, CA",
          latitude: 37.7749,
          longitude: -122.4194,
          clientSpend: "50k+",
          clientHireRate: 60,
          clientRating: 4.9,
          clientVerified: true,
          budgetType: "fixed",
          projectType: "research",
          industry: "ecommerce",
          riskFlags: ["scope-creep"]
        }, {
          id: "3",
          title: "Backend Developer",
          company: "StartupXYZ",
          category: "Engineering",
          description: "Build scalable backend systems",
          skills: [{ name: "Node.js", level: "advanced" }, { name: "MongoDB", level: "intermediate" }],
          behaviors: [{ name: "Problem Solving", description: "Solve complex technical problems", priority: "critical" }],
          verifiedCount: 3,
          verifiedUsers: 7,
          updatedAt: "2023-03-10",
          creator: "StartupXYZ",
          location: "Austin, TX",
          latitude: 30.2672,
          longitude: -97.7431,
          clientSpend: "1-5k",
          clientHireRate: 20,
          clientRating: 4.2,
          clientVerified: false,
          budgetType: "fixed",
          projectType: "maintenance",
          industry: "fintech",
          riskFlags: ["unpaid-test", "extreme-nda"]
        }];
        // setJobs(mockJobs);
        setJobs([]); // Keep as empty array for now
        setFilteredJobs([]); // Keep as empty array for now
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Set to an empty array to avoid undefined issues
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchMyJobs = async () => {
      try {
        setLoadingMyJobs(true);
        // Replace with actual API call to fetch user's jobs
        // const response = await fetch('/api/my-jobs'); 
        // const data = await response.json();
        // setMyJobs(data);
        
        // For now, setting to an empty array to prepare for real data
        setMyJobs([]);
      } catch (error) {
        console.error('Error fetching my jobs:', error);
        setMyJobs([]);
      } finally {
        setLoadingMyJobs(false);
      }
    };

    const fetchVerifications = async () => {
      try {
        setLoadingVerifications(true);
        // Replace with actual API call to fetch user's verifications
        // const response = await fetch('/api/verifications'); 
        // const data = await response.json();
        // setMyVerifications(data);
        
        // For now, setting to an empty array to prepare for real data
        setMyVerifications([]);
      } catch (error) {
        console.error('Error fetching verifications:', error);
        setMyVerifications([]);
      } finally {
        setLoadingVerifications(false);
      }
    };

    const fetchBadges = async () => {
      try {
        setLoadingBadges(true);
        // Replace with actual API call to fetch user's badges
        // const response = await fetch('/api/badges'); 
        // const data = await response.json();
        // setBadges(data);
        
        // For now, setting to an empty array to prepare for real data
        setBadges([]);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setBadges([]);
      } finally {
        setLoadingBadges(false);
      }
    };

    // Initial data loading
    fetchJobData();
    fetchMyJobs();
    fetchVerifications();
    fetchBadges();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => {
      // Search filter
      if (filters.search && 
          !job.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !job.company.toLowerCase().includes(filters.search.toLowerCase()) &&
          !job.skills.some(skill => skill.name.toLowerCase().includes(filters.search!.toLowerCase()))) {
        return false;
      }

      // Client quality filters
      if (filters.verifiedPayment && !job.clientVerified) return false;
      if (filters.spendTier && job.clientSpend !== filters.spendTier) return false;
      if (filters.minHireRate && job.clientHireRate && job.clientHireRate < filters.minHireRate) return false;
      if (filters.minRating && job.clientRating && job.clientRating < filters.minRating) return false;

      // Budget filters
      if (filters.budgetType && job.budgetType !== filters.budgetType) return false;
      if (filters.hourlyRate && job.hourlyRate !== filters.hourlyRate) return false;
      if (filters.premiumWillingness) {
        // This would require additional data
      }

      // Project filters
      if (filters.industry && job.industry !== filters.industry) return false;
      if (filters.projectType && job.projectType !== filters.projectType) return false;

      // Risk filters
      if (filters.unpaidTest && (!job.riskFlags || !job.riskFlags.includes('unpaid-test'))) return false;
      if (filters.scopeCreepHistory && (!job.riskFlags || !job.riskFlags.includes('scope-creep'))) return false;
      if (filters.extremeNDA && (!job.riskFlags || !job.riskFlags.includes('extreme-nda'))) return false;

      return true;
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

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

        <TabsContent value="browse" className="space-y-4">
          <JobFilters onFilterChange={handleFilterChange} />
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Job Listings - Left side */}
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="flex justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No jobs found. Try adjusting your search criteria.
                  </div>
                ) : (
                  filteredJobs.map((job) => {
                    const fitScore = calculateClientFitScore(job);
                    const fitReasons = getFitReasons(job);
                    const riskFactors = getRiskFactors(job);
                    
                    return (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">{job.category}</Badge>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                className={`text-xs px-2 py-0.5 ${
                                  fitScore >= 70 
                                    ? "bg-green-100 text-green-800" 
                                    : fitScore >= 40 
                                      ? "bg-yellow-100 text-yellow-800" 
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {fitScore}/100 fit
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-gray-600">Verified: {job.verifiedCount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">{job.company.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{job.company}</CardTitle>
                              <CardDescription className="text-sm">{job.title}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <div className="text-xs font-medium">Required Skills</div>
                              <div className="flex flex-wrap gap-1">
                                {job.skills.map((skill: JobSkill, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-slate-100 text-xs px-1.5 py-0.5">
                                    {skill.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                Updated {job.updatedAt}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Users className="w-3 h-3 mr-1" />
                                {job.verifiedUsers} verified users
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {fitReasons.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-green-700">Why it's a fit:</div>
                                  <ul className="text-xs text-green-600 list-disc list-inside">
                                    {fitReasons.map((reason, index) => (
                                      <li key={index}>{reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {riskFactors.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-red-700">Risks to watch:</div>
                                  <ul className="text-xs text-red-600 list-disc list-inside">
                                    {riskFactors.map((risk, index) => (
                                      <li key={index}>{risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {job.clientVerified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Client
                                </Badge>
                              )}
                              {job.clientSpend && (
                                <Badge variant="secondary" className="text-xs">
                                  ${job.clientSpend} spent
                                </Badge>
                              )}
                              {job.clientHireRate && (
                                <Badge variant="secondary" className="text-xs">
                                  {job.clientHireRate}% hire rate
                                </Badge>
                              )}
                              {job.riskFlags && job.riskFlags.map((flag, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {flag.replace('-', ' ')}
                                </Badge>
                              ))}
                            </div>
                            
                            <Button className="w-full h-8 text-sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View Requirements
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Map - Right side */}
            <div className="w-full lg:w-1/3">
              <JobMap jobs={filteredJobs.map(job => ({
                id: job.id,
                creator: job.company,
                title: job.title,
                category: job.category,
                verifiedCount: job.verifiedCount,
                skills: job.skills, // Keep the original skills array instead of mapping to strings
                updatedAt: job.updatedAt,
                verifiedUsers: job.verifiedUsers,
                location: job.coordinates 
                  ? `${job.coordinates.lat}, ${job.coordinates.lng}` 
                  : "Location not specified",
                latitude: job.coordinates?.lat,
                longitude: job.coordinates?.lng,
                // Adding missing properties to satisfy the Job type
                company: job.company,
                description: job.description,
                behaviors: job.behaviors
              }))} />
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
              {loadingMyJobs ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  You haven't created any job descriptions yet.
                </div>
              ) : (
                myJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-600">Created recently • {job.verifiedUsers} verified users</p>
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
                ))
              )}
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
              {loadingVerifications ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : myVerifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  You don't have any verification submissions yet.
                </div>
              ) : (
                myVerifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="text-xs">{verification.company.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{verification.company} - {verification.jobTitle}</h3>
                        <p className="text-sm text-gray-600">Submitted {verification.submittedAt}</p>
                      </div>
                    </div>
                    {verification.status === 'pending' ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
                    ) : verification.status === 'verified' ? (
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
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Showcase your verified skills and qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBadges ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : badges.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  You don't have any badges yet. Complete verifications to earn badges.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="border rounded-lg p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{badge.company}</p>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                  ))}
                </div>
              )}
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