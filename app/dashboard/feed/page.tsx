"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Store,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  DollarSign,
  CheckCircle,
} from "lucide-react"

import React from "react";

export default function FeedPage() {
  const [companyName, setCompanyName] = useState("");
  const [activeTab, setActiveTab] = useState("explore")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Network</h1>
          <p className="text-gray-600">
            Discover certifications, connect with companies, and showcase your verified skills
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="stores">Live Stores</TabsTrigger>
          <TabsTrigger value="partners">Find Partners</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search posts, stores, or creators..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Post 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">John Doe</h3>
                        <Badge variant="secondary">Creator</Badge>
                      </div>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Just launched my new AI-generated anime merchandise store! 🎌 Check out these amazing designs
                    created entirely by AI. What do you think?
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Store className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="aspect-square bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <Store className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        24
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />8
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Post 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">Sarah Miller</h3>
                        <Badge className="bg-blue-100 text-blue-800">Developer</Badge>
                      </div>
                      <p className="text-sm text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Looking for a business partner to help scale my SaaS platform! 🚀 I handle the tech, need someone
                    for marketing and sales. Revenue sharing opportunity!
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Partnership Opportunity</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Industry:</span>
                        <p className="font-medium">AI/SaaS</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Stage:</span>
                        <p className="font-medium">Early Growth</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Looking for:</span>
                        <p className="font-medium">Marketing Partner</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Equity:</span>
                        <p className="font-medium">20-30%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        15
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        12
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Interested
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Post 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{companyName || "TechCorp Inc."}</h3>
                        <Badge className="bg-green-100 text-green-800">Company</Badge>
                      </div>
                      <p className="text-sm text-gray-600">6 hours ago</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We're hiring! Looking for talented developers to join our team. Here's what we're looking for:</p>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">What We Want From Our Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Strong coding skills (React, Node.js, Python)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>AI/ML knowledge preferred</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Engineering mindset and problem-solving skills</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>Team collaboration and communication</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Certified in React</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        32
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        18
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span>Trending</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#AIStorefront</span>
                    <Badge variant="secondary">234 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#WRVTasks</span>
                    <Badge variant="secondary">156 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#BusinessPartners</span>
                    <Badge variant="secondary">89 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#StartupLife</span>
                    <Badge variant="secondary">67 posts</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Suggested Connections</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Mike Johnson</p>
                      <p className="text-xs text-gray-600">UI/UX Designer</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>LW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lisa Wang</p>
                      <p className="text-xs text-gray-600">Marketing Expert</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>RB</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Robert Brown</p>
                      <p className="text-xs text-gray-600">Full Stack Dev</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <Store className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Anime Fitness Hub</h3>
                <p className="text-sm text-gray-600 mb-2">Anime-themed fitness gear and guides</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    1.2k views
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $2.5k revenue
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  Visit Store
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg mb-3 flex items-center justify-center">
                  <Store className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Tech Gadgets Pro</h3>
                <p className="text-sm text-gray-600 mb-2">Latest tech accessories and gadgets</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    856 views
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $1.8k revenue
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  Visit Store
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg mb-3 flex items-center justify-center">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Eco Living Store</h3>
                <p className="text-sm text-gray-600 mb-2">Sustainable and eco-friendly products</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    2.1k views
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    $3.2k revenue
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  Visit Store
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Opportunities</CardTitle>
                <CardDescription>Connect with potential business partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Sarah Miller</h4>
                        <p className="text-sm text-gray-600">SaaS Developer</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Tech Partner</Badge>
                  </div>
                  <p className="text-sm mb-3">Looking for marketing partner for AI platform. 20-30% equity.</p>
                  <Button size="sm" className="w-full">
                    Connect
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">John Davis</h4>
                        <p className="text-sm text-gray-600">E-commerce Expert</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Business Partner</Badge>
                  </div>
                  <p className="text-sm mb-3">Seeking tech co-founder for dropshipping automation tool.</p>
                  <Button size="sm" className="w-full">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shark Tank Style Proposals</CardTitle>
                <CardDescription>Pitch your ideas or invest in others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">AI Content Generator</h4>
                    <Badge className="bg-purple-100 text-purple-800">Seeking $50k</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Revolutionary AI tool for content creators. 15% equity for $50k investment.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Pitch
                    </Button>
                    <Button size="sm" className="flex-1">
                      Make Offer
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Eco Fashion Brand</h4>
                    <Badge className="bg-green-100 text-green-800">Seeking $25k</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Sustainable fashion startup with proven sales. Looking for growth capital.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Pitch
                    </Button>
                    <Button size="sm" className="flex-1">
                      Make Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Opportunities</CardTitle>
                <CardDescription>Team's requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">TechCorp Inc.</h4>
                    <Badge className="bg-blue-100 text-blue-800">Remote</Badge>
                  </div>
                  <p className="text-sm font-medium mb-2">Full Stack Developer</p>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>• Strong coding skills (React, Node.js)</p>
                    <p>• AI/ML knowledge preferred</p>
                    <p>• Engineering mindset</p>
                    <p>• Team collaboration</p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Certified in React</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Apply Now
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">StartupXYZ</h4>
                    <Badge className="bg-green-100 text-green-800">Hybrid</Badge>
                  </div>
                  <p className="text-sm font-medium mb-2">Marketing Specialist</p>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>• Digital marketing experience</p>
                    <p>• Social media expertise</p>
                    <p>• Analytics and data-driven</p>
                    <p>• Creative thinking</p>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Google Ads Certified</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Requirements</CardTitle>
                <CardDescription>Skills companies want - start learning today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Most In-Demand Skills</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI/Machine Learning</span>
                      <Badge variant="secondary">89% demand</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">React Development</span>
                      <Badge variant="secondary">76% demand</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Digital Marketing</span>
                      <Badge variant="secondary">68% demand</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">UI/UX Design</span>
                      <Badge variant="secondary">54% demand</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Recommended Learning Path</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Based on current job postings, we recommend focusing on AI and web development skills.
                  </p>
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    View Learning Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
