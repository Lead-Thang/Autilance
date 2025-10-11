'use client'

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { Input } from "../../../../../components/ui/input"
import { Plus, Package, Search, Filter, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react"
import Image from "next/image"

// Simplified Product interface for a user's store
interface StoreProduct {
  id: string
  name: string
  price: number
  stock: number
  imageUrl: string
  status: 'active' | 'draft' | 'archived'
}

export default function StoreProductsPage() {
  const params = useParams()
  const storeId = params.storeId as string

  const [products, setProducts] = useState<StoreProduct[]>([])
  const [storeName, setStoreName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Memoize the fetcher so it can be safely used in useEffect
  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/stores/${storeId}/products`)
      if (!response.ok) {
        throw new Error("Failed to fetch products for this store.")
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch products for this store."
      setError(message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [storeId])

  // Now depend on the memoized function (and storeId for the name)
  useEffect(() => {
    if (!storeId) return
    fetchProducts()
    // In a real app, you'd also fetch store details like the name
    setStoreName(`Store #${storeId.substring(0, 6)}...`) // Placeholder
  }, [fetchProducts, storeId])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Products</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchProducts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Products for {storeName}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage inventory, pricing, and details for your store's products.
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Product Management Area */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <Package className="w-5 h-5" />
                All Products ({filteredProducts.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group border-0 shadow-lg">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 relative">
                      <Image
                        src={product.imageUrl || 'https://via.placeholder.com/300x300.png?text=No+Image'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-contain max-h-48 group-hover:scale-105 transition-transform duration-300"
                      />
                       <Badge className={`absolute top-2 right-2 border-0 ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {product.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-2 h-12">{product.name}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <p>Price: ${product.price.toFixed(2)}</p>
                        <p>Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "No products match your search." : "Add your first product to get started."}
                </p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Search
                  </Button>
                ) : (
                   <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
