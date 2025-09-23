"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useUser } from "../../../hooks/use-user"
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
  X,
} from "lucide-react"

interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
  likes: number
  comments: number
  users: {
    id: string
    name: string
    avatar?: string
  }
  liked: boolean
}

export default function FeedPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("explore")
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/feed/posts')
      const data = await response.json()
      
      // Transform the data to match our interface
      const transformedPosts = data.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: new Date(post.created_at).toLocaleDateString(),
        likes: post.likes,
        comments: post.comments,
        users: {
          id: post.users?.id || post.user_id,
          name: post.users?.name || "User",
          avatar: post.users?.avatar || "/placeholder.svg?height=40&width=40"
        },
        liked: false // We would need to track this separately in a real app
      }))
      
      setPosts(transformedPosts)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return

    try {
      const response = await fetch('/api/feed/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost })
      })
      
      if (response.ok) {
        // Refresh the posts list
        fetchPosts()
        setNewPost("")
        setShowCreatePost(false)
      } else {
        console.error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          } 
        : post
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Network</h1>
          <p className="text-gray-600">
            Discover certifications, connect with companies, and showcase your verified skills
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => setShowCreatePost(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Create a Post</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCreatePost(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.name || "User"}</p>
                <Badge variant="secondary">Public</Badge>
              </div>
            </div>
            
            <Textarea
              placeholder="What do you want to talk about?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-600">No posts yet. Be the first to create one!</p>
                    <Button 
                      className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600"
                      onClick={() => setShowCreatePost(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.users.avatar || "/placeholder.svg?height=40&width=40"} />
                          <AvatarFallback>{post.users.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{post.users.name}</h3>
                            <Badge variant="secondary">User</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{post.content}</p>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
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
                ))
              )}
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
