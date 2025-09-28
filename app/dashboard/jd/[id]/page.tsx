"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  Users,
  FileText,
  BookOpen,
  Code,
  MessageSquare,
  Star,
  Building,
  Award,
  Link as LinkIcon,
  Upload,
  AlertCircle,
  ChevronLeft,
  Share,
  Download,
} from "lucide-react"
import Link from "next/link"

// Define the type for our job description data
type JobDescription = {
  id: string
  title: string
  companyName: string
  companyType: string
  companySize: string
  industry: string
  description: string
  skills: {
    level: string
    name: string
    type: string
    description: string
  }[]
  certifications: {
    name: string
    provider: string
    required: boolean
  }[]
  behaviors: {
    name: string
    priority: string
    description: string
  }[]
  resources: {
    title: string
    type: string
    size?: string
    url?: string
    duration?: string
    level?: string
    price?: string
  }[]
  verificationRate: number
  lastUpdated: string
  verifiedCount: number
}

export default function JobDescriptionPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [jdData, setJdData] = useState<JobDescription | null>(null);
  
  // In a real app, you would fetch the JD data based on the ID
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockJdData = {
        id: params.id,
        title: "Full Stack Developer",
        companyName: "TechCorp Inc.",
        companyType: "Technology Company",
        companySize: "50-200 employees",
        industry: "Tech",
        description: "We are seeking a talented Full Stack Developer to join our growing team. The ideal candidate will be responsible for developing and maintaining web applications using React, Node.js, and TypeScript. You will work closely with our product and design teams to build high-quality, scalable, and performant applications.",
        skills: [
          {
            level: "Advanced",
            name: "React",
            type: "Frontend",
            description: "Proficient in React with experience in hooks, context API, and state management libraries. Should be able to build complex, performant UIs and understand component lifecycle."
          },
          {
            level: "Intermediate",
            name: "Node.js",
            type: "Backend",
            description: "Experience with Node.js and Express for building RESTful APIs and server-side applications. Understanding of asynchronous programming and middleware concepts."
          },
          {
            level: "Advanced",
            name: "TypeScript",
            type: "Language",
            description: "Strong TypeScript skills including interfaces, generics, and type definitions. Ability to configure and optimize TypeScript projects."
          }
        ],
        certifications: [
          {
            name: "AWS Certified Developer",
            provider: "Amazon Web Services",
            required: false
          }
        ],
        behaviors: [
          {
            name: "Team Communication",
            priority: "Critical",
            description: "Must be responsive in team chats and meetings. Expected to provide regular updates on work progress and communicate any blockers or issues promptly. Should be able to clearly articulate technical concepts to both technical and non-technical team members."
          },
          {
            name: "Meeting Etiquette",
            priority: "High",
            description: "Camera must be ON during all video meetings. Be punctual and prepared for scheduled meetings. Actively participate in discussions and provide constructive feedback."
          },
          {
            name: "Code Quality Standards",
            priority: "Critical",
            description: "Must follow company coding standards and best practices. All code should be properly documented and tested. Pull requests should include comprehensive descriptions and be of manageable size."
          }
        ],
        resources: [
          {
            title: "Coding Standards Guide",
            type: "document",
            size: "2.4 MB"
          },
          {
            title: "Onboarding Process",
            type: "document",
            size: "1.8 MB"
          },
          {
            title: "Company Handbook",
            type: "link",
            url: "https://example.com/handbook"
          },
          {
            title: "GitHub Repository",
            type: "link",
            url: "https://github.com/example"
          },
          {
            title: "React Best Practices",
            type: "course",
            duration: "4 hours",
            level: "Beginner to Advanced",
            price: "Free"
          }
        ],
        verificationRate: 85,
        lastUpdated: "2 days ago",
        verifiedCount: 24
      };
      
      setJdData(mockJdData);
    }, 500);
  }, [params.id]);
  
  if (!jdData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job description...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Link href="/dashboard/jd">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to JDs
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Company & JD Info */}
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>TC</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{jdData.companyName}</CardTitle>
                  <CardDescription>{jdData.companyType}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">Tech</Badge>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">50-200 employees</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                TechCorp is a leading technology company specializing in web and mobile application development, 
                cloud solutions, and AI-powered products.
              </p>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Building className="w-4 h-4 mr-2" />
                  Company Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Description</CardTitle>
              <CardDescription>Full Stack Developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Updated {jdData.lastUpdated}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">{jdData.verifiedCount} verified</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verification Rate</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">JD ID</div>
                <div className="text-sm text-gray-600">{jdData.id}</div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Verification
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - JD Details */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Full Stack Developer</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <CardDescription>
                {jdData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="behaviors">Behaviors</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="verify">Verify</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-gray-600">
                      {jdData.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Code className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium">{jdData.skills.length} Skills</h4>
                        <p className="text-sm text-gray-600">Required technical abilities</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-medium">{jdData.behaviors.length} Behaviors</h4>
                        <p className="text-sm text-gray-600">Expected work conduct</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-medium">{jdData.resources.length} Resources</h4>
                        <p className="text-sm text-gray-600">Documents & links</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Verification Process</h3>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-600">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Review Requirements</h4>
                          <p className="text-sm text-gray-600">Understand the skills, behaviors, and certifications needed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-600">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Prepare Proof</h4>
                          <p className="text-sm text-gray-600">Gather evidence of your skills and experience</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-blue-600">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Submit Verification</h4>
                          <p className="text-sm text-gray-600">Upload your proof and wait for review</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Get Verified</h4>
                          <p className="text-sm text-gray-600">Receive your verification badge and showcase your skills</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Required Technical Skills</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                            <h4 className="font-medium">React</h4>
                          </div>
                          <Badge variant="outline">Frontend</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Proficient in React with experience in hooks, context API, and state management libraries.
                          Should be able to build complex, performant UIs and understand component lifecycle.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
                            <h4 className="font-medium">Node.js</h4>
                          </div>
                          <Badge variant="outline">Backend</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Experience with Node.js and Express for building RESTful APIs and server-side applications.
                          Understanding of asynchronous programming and middleware concepts.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                            <h4 className="font-medium">TypeScript</h4>
                          </div>
                          <Badge variant="outline">Language</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Strong TypeScript skills including interfaces, generics, and type definitions.
                          Ability to configure and optimize TypeScript projects.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Required Certifications</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Award className="w-5 h-5 text-yellow-600" />
                            <div>
                              <h4 className="font-medium">{jdData.certifications[0].name}</h4>
                              <p className="text-sm text-gray-600">{jdData.certifications[0].provider}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{jdData.certifications[0].required ? 'Required' : 'Optional'}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="behaviors" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Required Behaviors</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Team Communication</h4>
                          <Badge className="bg-red-100 text-red-800">Critical</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Must be responsive in team chats and meetings. Expected to provide regular updates on work progress
                          and communicate any blockers or issues promptly. Should be able to clearly articulate technical concepts
                          to both technical and non-technical team members.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Meeting Etiquette</h4>
                          <Badge className="bg-yellow-100 text-yellow-800">High</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Camera must be ON during all video meetings. Be punctual and prepared for scheduled meetings.
                          Actively participate in discussions and provide constructive feedback.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Code Quality Standards</h4>
                          <Badge className="bg-red-100 text-red-800">Critical</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Must follow company coding standards and best practices. All code should be properly documented
                          and tested. Pull requests should include comprehensive descriptions and be of manageable size.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Culture</h3>
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-gray-600">Async-first communication with core hours 10am-2pm EST</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-gray-600">Weekly team meetings on Mondays at 10am EST</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-gray-600">Remote-friendly with quarterly in-person meetups</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-gray-600">Focus on work-life balance with flexible hours</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Documents & Resources</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{jdData.resources[0].title}</h4>
                              <p className="text-sm text-gray-600">PDF • {jdData.resources[0].size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{jdData.resources[1].title}</h4>
                              <p className="text-sm text-gray-600">PDF • {jdData.resources[1].size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">External Links</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{jdData.resources[2].title}</h4>
                              <p className="text-sm text-gray-600">Notion Document</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{jdData.resources[3].title}</h4>
                              <p className="text-sm text-gray-600">Code Examples</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Training Courses</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">{jdData.resources[4].title}</h4>
                              <p className="text-sm text-gray-600">{jdData.resources[4].duration} • {jdData.resources[4].level}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">{jdData.resources[4].price}</Badge>
                        </div>
                        <Button size="sm" className="w-full">View Course</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="verify" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Verification Process</h4>
                          <p className="text-sm text-blue-700">
                            Submit proof of your skills and experience to get verified for this job description.
                            Once verified, you'll receive a badge that can be displayed on your profile.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Submit Your Verification</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Skill Proofs</label>
                          <div className="border rounded-md p-4">
                            <Button variant="outline" className="w-full h-24 border-dashed">
                              <Upload className="w-6 h-6 mr-2" />
                              Upload Skill Proofs
                            </Button>
                            <p className="text-xs text-gray-600 mt-2">
                              Upload certificates, project examples, or other evidence of your skills
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Behavior Proofs</label>
                          <div className="border rounded-md p-4">
                            <Button variant="outline" className="w-full h-24 border-dashed">
                              <Upload className="w-6 h-6 mr-2" />
                              Upload Behavior Proofs
                            </Button>
                            <p className="text-xs text-gray-600 mt-2">
                              Upload testimonials, performance reviews, or other evidence of your work behaviors
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Additional Notes</label>
                          <textarea 
                            className="w-full min-h-[100px] p-3 border rounded-md" 
                            placeholder="Add any additional information about your submission..."
                          ></textarea>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Submit Verification
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}