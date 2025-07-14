"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Progress } from "../../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Award, Calendar, Download, Eye, Share, Star, Trophy, CheckCircle, Clock, Users } from "lucide-react"

export default function CertificationsPage() {
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="earned" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earned">Earned Certificates</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">TechCorp Inc.</h3>
                      <p className="text-sm text-gray-600">Technology</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Full Stack Developer</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Certified proficiency in React, Node.js, and database management
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Dec 2023
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

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>DS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">DesignStudio</h3>
                      <p className="text-sm text-gray-600">Creative Agency</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">UI/UX Designer</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Expert-level design skills with Figma, user research, and prototyping
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Nov 2023
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      8.8/10
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

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">AI Innovations</h3>
                      <p className="text-sm text-gray-600">AI/ML Company</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">AI Specialist</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Advanced knowledge in machine learning, neural networks, and AI ethics
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Oct 2023
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      9.5/10
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
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>BC</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Blockchain Developer</h3>
                      <p className="text-sm text-gray-600">CryptoTech Solutions</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Application Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Applied:</span>
                    <p className="font-medium">Dec 10, 2023</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Work Submitted:</span>
                    <p className="font-medium">Dec 12, 2023</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Result:</span>
                    <p className="font-medium">Dec 20, 2023</p>
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Marketing Specialist</h3>
                      <p className="text-sm text-gray-600">GrowthCorp</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Application Progress</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Applied:</span>
                    <p className="font-medium">Dec 8, 2023</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Step:</span>
                    <p className="font-medium">Submit Portfolio</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span>
                    <p className="font-medium">Dec 18, 2023</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    Continue Application
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    View Requirements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>FS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">FinanceSecure</h3>
                      <p className="text-sm text-gray-600">Financial Services</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Financial Analyst</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Demonstrate expertise in financial modeling, risk assessment, and market analysis
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      23 applied
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />5 days left
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="font-medium text-sm">Requirements:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Excel financial model</li>
                    <li>• Market research report</li>
                    <li>• Risk assessment presentation</li>
                  </ul>
                </div>

                <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>CS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">CyberShield</h3>
                      <p className="text-sm text-gray-600">Cybersecurity</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Security Specialist</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Prove your skills in network security, penetration testing, and incident response
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      12 applied
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />8 days left
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="font-medium text-sm">Requirements:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Security audit report</li>
                    <li>• Penetration test demo</li>
                    <li>• Incident response plan</li>
                  </ul>
                </div>

                <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>DM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">DataMind</h3>
                      <p className="text-sm text-gray-600">Data Science</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Data Scientist</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Showcase expertise in machine learning, statistical analysis, and data visualization
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      31 applied
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />3 days left
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h5 className="font-medium text-sm">Requirements:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• ML model with 85%+ accuracy</li>
                    <li>• Data visualization dashboard</li>
                    <li>• Statistical analysis report</li>
                  </ul>
                </div>

                <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
