"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Badge } from "../../../components/ui/badge"
import { StoreEditor } from "../../../components/store-builder/store-editor"
import { type StoreData, storeAI } from "../../../lib/store-ai"
import {
  Sparkles,
  Store,
  Package,
  Eye,
  Edit,
  Share,
  Plus,
  Wand2,
  Zap,
  ShoppingCart,
  TrendingUp,
  Users,
  Globe,
  Rocket,
} from "lucide-react"
import Image from "next/image"

export default function StorefrontPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreData | null>(null)
  const [stores, setStores] = useState<StoreData[]>([
    {
      id: "1",
      name: "Anime Fitness Hub",
      domain: "anime-fitness.Autilance.com",
      components: [],
      theme: { primaryColor: "#6366f1", secondaryColor: "#8b5cf6", fontFamily: "Inter", layout: "modern" },
      seo: {
        title: "Anime Fitness Hub",
        description: "Anime merchandise and fitness guides",
        keywords: ["anime", "fitness"],
      },
    },
    {
      id: "2",
      name: "Tech Gadgets Pro",
      domain: "tech-gadgets.Autilance.com",
      components: [],
      theme: { primaryColor: "#10b981", secondaryColor: "#3b82f6", fontFamily: "Inter", layout: "modern" },
      seo: {
        title: "Tech Gadgets Pro",
        description: "Latest tech gadgets and accessories",
        keywords: ["tech", "gadgets"],
      },
    },
  ])

  const [storeData, setStoreData] = useState({
    niche: "",
    description: "",
    targetAudience: "",
    priceRange: "",
  })

  const handleGenerate = async () => {
    if (!storeData.niche.trim()) return

    setIsGenerating(true)
    try {
      const prompt = `Create a ${storeData.niche} store for ${storeData.targetAudience} with products in the ${storeData.priceRange} price range. ${storeData.description}`
      const newStore = await storeAI.generateStoreLayout(prompt)
      setEditingStore(newStore)
    } catch (error) {
      console.error("Failed to generate store:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveStore = (store: StoreData) => {
    setStores((prev) => {
      const existing = prev.find((s) => s.id === store.id)
      if (existing) {
        return prev.map((s) => (s.id === store.id ? store : s))
      }
      return [...prev, store]
    })
    setEditingStore(null)
  }

  const handleEditStore = (store: StoreData) => {
    setEditingStore(store)
  }

  if (editingStore) {
    return <StoreEditor initialStore={editingStore} onSave={handleSaveStore} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section with AI Marketplace Image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/40 dark:to-purple-900/40" />
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Store Builder
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Build Intelligent Stores with AI
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Create professional e-commerce stores powered by AI. Like v0 for building apps, but designed
                  specifically for online marketplaces and stores.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    onClick={() =>
                      setEditingStore({
                        id: Date.now().toString(),
                        name: "New AI Store",
                        domain: "new-store.autilance.com",
                        components: [],
                        theme: {
                          primaryColor: "#6366f1",
                          secondaryColor: "#8b5cf6",
                          fontFamily: "Inter",
                          layout: "modern",
                        },
                        seo: { title: "", description: "", keywords: [] },
                      })
                    }
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Create Store with AI
                  </Button>

                  <Button variant="outline" size="lg" className="bg-transparent">
                    <Eye className="w-5 h-5 mr-2" />
                    View Demo
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/ai-marketplace-interface.jpeg"
                    alt="AI-powered marketplace interface with futuristic design"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Stats */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">AI Optimization</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">+300% Conversion</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Active Users</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">50,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12 space-y-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Store Generator */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">AI Store Generator</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Describe your business idea and let our AI create a complete, optimized store in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="niche" className="text-sm font-medium">
                    Business Niche *
                  </Label>
                  <Input
                    id="niche"
                    placeholder="e.g., Sustainable fashion for millennials"
                    value={storeData.niche}
                    onChange={(e) => setStoreData({ ...storeData, niche: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Store Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your products, brand vision, and what makes you unique..."
                    value={storeData.description}
                    onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-sm font-medium">
                      Target Audience
                    </Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Eco-conscious millennials"
                      value={storeData.targetAudience}
                      onChange={(e) => setStoreData({ ...storeData, targetAudience: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price Range
                    </Label>
                    <Input
                      id="price"
                      placeholder="e.g., $25-$200"
                      value={storeData.priceRange}
                      onChange={(e) => setStoreData({ ...storeData, priceRange: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !storeData.niche.trim()}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Generating Your Store...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Generate Store with AI
                    </>
                  )}
                </Button>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100 mb-1">AI Magic Included</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Complete layout, product catalog, SEO optimization, and conversion-focused design
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Network Visualization */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  AI-Powered Intelligence
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced AI network that understands your business and optimizes every aspect
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src="/images/ai-marketplace-network.jpeg"
                    alt="AI network visualization showing interconnected marketplace intelligence"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ShoppingCart className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Smart Commerce</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">AI-optimized product placement</p>
                      </div>

                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Growth Engine</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Predictive analytics & insights</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">300%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Boost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">50K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Stores Created</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Grid */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl mb-4">AI-Powered Store Building Features</CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Our intelligent system handles everything from design to optimization, so you can focus on growing your
                business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Wand2,
                    title: "Smart Layout Generation",
                    description: "AI analyzes your niche and creates optimized store layouts that convert",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Package,
                    title: "Product Intelligence",
                    description: "Automatically generates product descriptions, pricing strategies, and catalogs",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "Conversion Optimization",
                    description: "AI continuously optimizes your store for maximum sales and engagement",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: Globe,
                    title: "SEO & Marketing",
                    description: "Built-in SEO optimization and marketing automation powered by AI",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Existing Stores */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Store className="w-6 h-6" />
                Your AI-Generated Stores
              </CardTitle>
              <CardDescription className="text-base">Manage and customize your AI-created storefronts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Store Card */}
                <Card
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group bg-transparent"
                  onClick={() =>
                    setEditingStore({
                      id: Date.now().toString(),
                      name: "New Store",
                      domain: "new-store.autilance.com",
                      components: [],
                      theme: {
                        primaryColor: "#6366f1",
                        secondaryColor: "#8b5cf6",
                        fontFamily: "Inter",
                        layout: "modern",
                      },
                      seo: { title: "", description: "", keywords: [] },
                    })
                  }
                >
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Create New Store</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Start with AI generation or blank template
                    </p>
                  </CardContent>
                </Card>

                {/* Existing Stores */}
                {stores.map((store) => (
                  <Card key={store.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Store className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                      </div>

                      <h3 className="font-semibold text-lg mb-2">{store.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{store.domain}</p>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-600">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>

                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditStore(store)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
