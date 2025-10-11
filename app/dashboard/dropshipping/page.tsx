"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { 
  Package,
  Zap,
  Globe,
  Search,
  Plus,
  Settings,
  Truck,
  RefreshCw,
  Filter,
  Upload,
  ExternalLink,
  AlertCircle,
  Store
} from "lucide-react"

interface Supplier {
  id: string
  name: string
  connected: boolean
  lastSync?: string
  products?: number
  status?: "active" | "inactive" | "pending"
}

interface Product {
  id: string
  name: string
  supplier: string
  price: number
  retailPrice: number
  stock: number
  imageUrl: string
  status: "available" | "low-stock" | "out-of-stock"
}

export default function DropshippingHubPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load suppliers and products on component mount
  useEffect(() => {
    fetchDropshippingData()
  }, [])

  const fetchDropshippingData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/dropshipping?action=suppliers')
      if (!response.ok) throw new Error('Failed to fetch dropshipping data')
      
      const data = await response.json()
      setSuppliers(data.suppliers || [])
      setProducts(data.products || [])
    } catch (err) {
      setError('Failed to load dropshipping data')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectSupplier = async (supplierId: string) => {
    try {
      const response = await fetch('/api/dropshipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', supplierId })
      })
      
      if (!response.ok) throw new Error('Failed to connect supplier')
      
      const result = await response.json()
      if (result.success) {
        // Update the local state
        setSuppliers(prev => prev.map(supplier => 
          supplier.id === supplierId 
            ? { ...supplier, connected: true, status: "active", lastSync: new Date().toISOString() } 
            : supplier
        ))
      }
    } catch (err) {
      setError('Failed to connect supplier')
      console.error(err)
    }
  }

  const handleSyncProducts = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/dropshipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      })
      
      if (!response.ok) throw new Error('Failed to sync products')
      
      const result = await response.json()
      if (result.success) {
        setProducts(result.products || [])
      }
    } catch (err) {
      setError('Failed to sync products')
      console.error(err)
    } finally {
      setIsSyncing(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier
    return matchesSearch && matchesSupplier
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dropshipping hub...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchDropshippingData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Unified Dropshipping Hub
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect suppliers, import products, and sell them on your custom storefront.
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/storefront'}>
              <Store className="w-4 h-4 mr-2" />
              Manage Storefront
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected Suppliers</p>
                  <p className="text-2xl font-bold mt-1">
                    {suppliers.filter(s => s.connected).length}/{suppliers.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Profit Margin</p>
                  <p className="text-2xl font-bold mt-1">65%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Sync</p>
                  <p className="text-2xl font-bold mt-1">
                    {suppliers.some(s => s.lastSync) 
                      ? new Date(Math.max(...suppliers.filter(s => s.lastSync).map(s => new Date(s.lastSync!).getTime()))).toLocaleDateString() 
                      : "Never"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Connections */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  Connected Suppliers
                </CardTitle>
                <CardDescription>Manage your supplier connections and sync settings</CardDescription>
              </div>
              <Button onClick={handleSyncProducts} disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <Card 
                  key={supplier.id} 
                  className={`border-2 ${
                    supplier.connected 
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  } transition-all hover:shadow-md`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{supplier.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {supplier.connected && supplier.lastSync ? `Synced: ${new Date(supplier.lastSync).toLocaleDateString()}` : "Not connected"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {supplier.connected ? (
                        <>
                          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                            Connected
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleConnectSupplier(supplier.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Management */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  Supplier Products
                </CardTitle>
                <CardDescription>Import and manage products from connected suppliers</CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedSupplier || ""} onValueChange={(value) => setSelectedSupplier(value || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.filter(s => s.connected).map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="object-contain max-h-48"
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium line-clamp-2">{product.name}</h3>
                      {product.status === "out-of-stock" ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : product.status === "low-stock" ? (
                        <Badge variant="default" className="bg-yellow-500">Low Stock</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-500">In Stock</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <p>Supplier: {product.supplier}</p>
                      <p>Cost: ${product.price.toFixed(2)}</p>
                      <p>Est. Retail: ${product.retailPrice.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        Stock: {product.stock}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="Import to your store">
                          <Upload className="w-4 h-4 mr-1" />
                          Import to Store
                        </Button>
                        <Button size="sm" title="View on supplier's website">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? "No products match your search" : "Connect suppliers to import products"}
                </p>
                <Button onClick={() => setSearchQuery("")}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}