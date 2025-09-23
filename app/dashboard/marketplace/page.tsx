"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Users,
  TrendingUp,
  Tag,
  MapPin,
  Eye,
  Plus,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import Link from "next/link"

// Define the type for marketplace items
type MarketplaceItem = {
  id: number
  name: string
  seller: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  sold: number
  trending?: boolean
  category: string
  location: string
  image?: string
}

// Realistic product categories for a marketplace
const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
  "Health",
  "Jewelry",
  "Digital Products",
  "Services",
  "Other"
]

// This would typically come from an API in a real application
const mockMarketplaceItems: MarketplaceItem[] = []

const sortOptions = [
  { id: "popular", name: "Most Popular" },
  { id: "trending", name: "Trending" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "newest", name: "Newest Arrivals" },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [showFilters, setShowFilters] = useState(false)
  const [locationFilter, setLocationFilter] = useState("")

  const filteredItems = mockMarketplaceItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.seller.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
      const matchesLocation = locationFilter === "" || item.location.toLowerCase().includes(locationFilter.toLowerCase())
      return matchesSearch && matchesCategory && matchesPrice && matchesLocation
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "trending":
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
        case "popular":
        default:
          return b.sold - a.sold
      }
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-600">Discover and buy products from verified sellers</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Sell Your Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search marketplace..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <span>-</span>
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <Input 
                placeholder="City or Country" 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Sort By</h3>
              <div className="relative">
                <select 
                  className="w-full p-2 border rounded-md appearance-none bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results Info */}
      {filteredItems.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {mockMarketplaceItems.length} products
          </p>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <div className="relative">
              <select 
                className="p-2 border rounded-md appearance-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Marketplace Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.image} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    {item.trending && (
                      <Badge variant="destructive" className="text-xs py-1 px-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="mt-1">${item.price.toFixed(2)}</Badge>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{item.name}</CardTitle>
              <CardDescription>{item.seller}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span>{item.rating} ({item.reviews})</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{item.sold} sold</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No products listed yet</h3>
          <p className="text-gray-600 mb-4">Be the first to sell your products on this marketplace 😊</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Sell Your Product
          </Button>
        </div>
      )}
    </div>
  )
}