"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  Pin,
  Lock,
  Eye,
  TrendingUp,
  Users,
  Search
} from "lucide-react"

interface Topic {
  id: string
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  _count: {
    replies: number
    likes: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

export default function CommunityForumsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // New topic form
  const [newTopic, setNewTopic] = useState({
    categoryId: "",
    title: "",
    content: ""
  })

  useEffect(() => {
    fetchTopics()
    fetchCategories()
  }, [selectedCategory])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      const url = selectedCategory
        ? `/api/community/topics?categoryId=${selectedCategory}`
        : '/api/community/topics'

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setTopics(data.topics)
      } else {
        console.error("Error fetching topics:", data.error)
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // This would call an actual API - for now using mock data
      setCategories([
        { id: "1", name: "General Discussion", slug: "general", description: "Talk about anything" },
        { id: "2", name: "Job Search", slug: "jobs", description: "Tips and advice for finding work" },
        { id: "3", name: "Freelancing", slug: "freelancing", description: "Freelance tips and discussions" },
        { id: "4", name: "Tech & Tools", slug: "tech", description: "Discuss tools and technology" },
        { id: "5", name: "Success Stories", slug: "success", description: "Share your wins" },
      ])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleCreateTopic = async () => {
    if (!newTopic.title || !newTopic.content || !newTopic.categoryId) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch('/api/community/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopic)
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setNewTopic({ categoryId: "", title: "", content: "" })
        fetchTopics()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create topic")
      }
    } catch (error) {
      console.error("Error creating topic:", error)
      alert("An error occurred")
    }
  }

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            Community Forums
          </h1>
          <p className="text-gray-600">
            Connect, discuss, and learn from the community
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
              <DialogDescription>
                Start a new discussion in the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newTopic.categoryId}
                  onValueChange={(value) => setNewTopic({ ...newTopic, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="What's your topic about?"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Share your thoughts..."
                  rows={6}
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTopic}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  Create Topic
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-all ${!selectedCategory ? 'ring-2 ring-purple-600' : 'hover:shadow-md'}`}
          onClick={() => setSelectedCategory("")}
        >
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="font-semibold">All Topics</div>
          </CardContent>
        </Card>

        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all ${selectedCategory === category.id ? 'ring-2 ring-purple-600' : 'hover:shadow-md'}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold text-sm">{category.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredTopics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Topics Found</h3>
            <p className="text-gray-600 mb-4">
              Be the first to start a discussion in this category
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Topic
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {topic.isPinned && (
                        <Pin className="w-4 h-4 text-purple-600" />
                      )}
                      {topic.isLocked && (
                        <Lock className="w-4 h-4 text-gray-600" />
                      )}
                      <h3 className="text-lg font-semibold hover:text-purple-600">
                        {topic.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {topic.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={topic.author.image} />
                          <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{topic.author.name}</span>
                      </div>

                      <Badge variant="outline">{topic.category.name}</Badge>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{topic._count.replies}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{topic._count.likes}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{topic.viewCount}</span>
                      </div>

                      <span className="ml-auto">
                        {new Date(topic.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
