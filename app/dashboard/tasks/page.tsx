"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardCheck, Plus, DollarSign, Clock, User, Eye, Lock, Unlock, Star, MessageSquare } from "lucide-react"

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("browse")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Diploma System</h1>
          <p className="text-gray-600">Create certifications, verify skills, and issue professional diplomas</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Certification
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Certifications</TabsTrigger>
          <TabsTrigger value="my-tasks">My Certifications</TabsTrigger>
          <TabsTrigger value="responses">My Applications</TabsTrigger>
          <TabsTrigger value="post">Create Certification</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800">Web Development</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $500
                  </div>
                </div>
                <CardTitle className="text-lg">React Landing Page with Stripe</CardTitle>
                <CardDescription>
                  Need a modern landing page built with React and integrated with Stripe payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />3 days ago
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-1" />5 responses
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">Design</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $200
                  </div>
                </div>
                <CardTitle className="text-lg">Logo Design for Tech Startup</CardTitle>
                <CardDescription>
                  Looking for a modern, minimalist logo for our AI-powered SaaS platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />1 day ago
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      12 responses
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800">Content</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $150
                  </div>
                </div>
                <CardTitle className="text-lg">Blog Content Writing</CardTitle>
                <CardDescription>Need 5 SEO-optimized blog posts about AI and machine learning trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />2 hours ago
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-1" />3 responses
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Posted Tasks</CardTitle>
              <CardDescription>Manage tasks you've posted and review responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">React Landing Page</h3>
                    <p className="text-sm text-gray-600">Posted 3 days ago • $500 budget</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">5 responses</Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Lock className="w-4 h-4 mr-1" />3 Locked
                      </Button>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">Logo Design</h3>
                    <p className="text-sm text-gray-600">Posted 1 day ago • $200 budget</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">12 responses</Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Lock className="w-4 h-4 mr-1" />8 Locked
                      </Button>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Task Responses</CardTitle>
              <CardDescription>Track your responses and unlock status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">E-commerce Website</h3>
                    <p className="text-sm text-gray-600">Responded 2 days ago • $800 budget</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-green-100 text-green-800">
                      <Unlock className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1" />
                      4.8
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">Mobile App UI</h3>
                    <p className="text-sm text-gray-600">Responded 5 hours ago • $600 budget</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked Preview
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post New WRV Task</CardTitle>
              <CardDescription>Create a new task with work requirement verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="e.g., Build a React landing page" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements, deliverables, and expectations..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Web Development" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Verification Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="What should responders include in their locked preview? (e.g., wireframes, code samples, design mockups)"
                  rows={3}
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Post Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
