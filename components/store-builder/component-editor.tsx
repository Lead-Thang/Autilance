"use client"

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { Slider } from "../../components/ui/slider"
import type { StoreComponent } from "../../lib/store-ai"
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Palette,
  Type,
  Monitor,
  Smartphone,
  Tablet,
  Settings,
  Grid,
  Eye,
  Code,
  Copy,
  Move,
  MoreHorizontal
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"

interface ComponentEditorProps {
  component: StoreComponent
  onUpdate: (updates: Partial<StoreComponent>) => void
  storeTheme: any
}

export function ComponentEditor({
  component,
  onUpdate,
  storeTheme,
}: ComponentEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "advanced">("content")
  const [contentTab, setContentTab] = useState("main")

  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: { ...component.content, [key]: value },
    })
  }

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      styles: { ...component.styles, [key]: value },
    })
  }

  const renderContentEditor = () => {
    switch (component.type) {
      case "hero":
        return (
          <Tabs defaultValue="main" value={contentTab} onValueChange={setContentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="main">Main</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="cta">CTA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={component.content.title || ""}
                  onChange={(e) => updateContent("title", e.target.value)}
                  placeholder="Welcome to Our Store"
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={component.content.subtitle || ""}
                  onChange={(e) => updateContent("subtitle", e.target.value)}
                  placeholder="Discover amazing products"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div>
                <Label htmlFor="hero-bg">Background Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="hero-bg"
                    value={component.content.backgroundImage || ""}
                    onChange={(e) => updateContent("backgroundImage", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Background Video</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/video.mp4"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cta" className="space-y-4">
              <div>
                <Label htmlFor="hero-cta">Call to Action Text</Label>
                <Input
                  id="hero-cta"
                  value={component.content.ctaText || ""}
                  onChange={(e) => updateContent("ctaText", e.target.value)}
                  placeholder="Shop Now"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-cta-link">CTA Link</Label>
                <Input
                  id="hero-cta-link"
                  value={component.content.ctaLink || ""}
                  onChange={(e) => updateContent("ctaLink", e.target.value)}
                  placeholder="/products"
                />
              </div>
              
              <div>
                <Label>CTA Style</Label>
                <Select defaultValue="primary">
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        )

      case "product-grid":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="grid-title">Section Title</Label>
              <Input
                id="grid-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Featured Products"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Products</Label>
                <Button
                  size="sm"
                  onClick={() => {
                    const newProduct = {
                      id: Date.now().toString(),
                      name: "New Product",
                      price: "$0.00",
                      image: "/placeholder.svg?height=300&width=300",
                      description: "Product description",
                    }
                    updateContent("products", [...(component.content.products || []), newProduct])
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(component.content.products || []).map((product: any, index: number) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Product {index + 1}</span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Move className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const products = [...component.content.products]
                            const newProduct = { ...product, id: Date.now().toString() }
                            products.splice(index + 1, 0, newProduct)
                            updateContent("products", products)
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const products = component.content.products.filter((_: any, i: number) => i !== index)
                            updateContent("products", products)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Product Image</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input
                            value={product.image}
                            onChange={(e) => {
                              const products = [...component.content.products]
                              products[index] = { ...product, image: e.target.value }
                              updateContent("products", products)
                            }}
                            placeholder="Image URL"
                          />
                          <Button variant="outline" size="icon">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={product.name}
                          onChange={(e) => {
                            const products = [...component.content.products]
                            products[index] = { ...product, name: e.target.value }
                            updateContent("products", products)
                          }}
                          placeholder="Product name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Price</Label>
                          <Input
                            value={product.price}
                            onChange={(e) => {
                              const products = [...component.content.products]
                              products[index] = { ...product, price: e.target.value }
                              updateContent("products", products)
                            }}
                            placeholder="$99.99"
                          />
                        </div>
                        <div>
                          <Label>Compare Price</Label>
                          <Input
                            value={product.comparePrice || ""}
                            onChange={(e) => {
                              const products = [...component.content.products]
                              products[index] = { ...product, comparePrice: e.target.value }
                              updateContent("products", products)
                            }}
                            placeholder="$129.99"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={product.description}
                          onChange={(e) => {
                            const products = [...component.content.products]
                            products[index] = { ...product, description: e.target.value }
                            updateContent("products", products)
                          }}
                          placeholder="Product description"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label>Product Tags</Label>
                        <Input
                          value={product.tags?.join(", ") || ""}
                          onChange={(e) => {
                            const products = [...component.content.products]
                            products[index] = { ...product, tags: e.target.value.split(",").map(tag => tag.trim()) }
                            updateContent("products", products)
                          }}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "about":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="about-title">Title</Label>
              <Input
                id="about-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="About Us"
              />
            </div>
            
            <div>
              <Label htmlFor="about-description">Description</Label>
              <Textarea
                id="about-description"
                value={component.content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="Tell your story..."
                rows={8}
              />
            </div>
            
            <div>
              <Label htmlFor="about-image">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="about-image"
                  value={component.content.image || ""}
                  onChange={(e) => updateContent("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Contact Us"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={component.content.email || ""}
                  onChange={(e) => updateContent("email", e.target.value)}
                  placeholder="hello@store.com"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={component.content.phone || ""}
                  onChange={(e) => updateContent("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contact-address">Address</Label>
              <Textarea
                id="contact-address"
                value={component.content.address || ""}
                onChange={(e) => updateContent("address", e.target.value)}
                placeholder="123 Store Street, City, State 12345"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Business Hours</Label>
              <Textarea
                value={component.content.hours || ""}
                onChange={(e) => updateContent("hours", e.target.value)}
                placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 10AM-4PM&#10;Sun: Closed"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Social Media Links</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="w-24">Facebook</Label>
                  <Input
                    value={component.content.facebook || ""}
                    onChange={(e) => updateContent("facebook", e.target.value)}
                    placeholder="https://facebook.com/yourstore"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="w-24">Twitter</Label>
                  <Input
                    value={component.content.twitter || ""}
                    onChange={(e) => updateContent("twitter", e.target.value)}
                    placeholder="https://twitter.com/yourstore"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="w-24">Instagram</Label>
                  <Input
                    value={component.content.instagram || ""}
                    onChange={(e) => updateContent("instagram", e.target.value)}
                    placeholder="https://instagram.com/yourstore"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "text":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="text-heading">Heading</Label>
              <Input
                id="text-heading"
                value={component.content.heading || ''}
                onChange={(e) => onUpdate({ content: { ...component.content, heading: e.target.value } })}
              />
            </div>
            
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <div className="border rounded-md">
                <div className="flex items-center p-2 border-b bg-muted">
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Underline className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="h-5 w-px bg-border mx-2"></div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="h-5 w-px bg-border mx-2"></div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="text-content"
                  value={component.content.text || ''}
                  onChange={(e) => onUpdate({ content: { ...component.content, text: e.target.value } })}
                  rows={6}
                  className="border-0 rounded-none"
                />
              </div>
            </div>
            
            <div>
              <Label>Text Alignment</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["left", "center", "right"].map((align) => (
                  <Button
                    key={align}
                    variant={component.content.alignment === align ? "default" : "outline"}
                    onClick={() => onUpdate({ content: { ...component.content, alignment: align } })}
                    className="justify-start"
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  value={component.styles.textColor || '#000000'}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, textColor: e.target.value } })}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={component.styles.textColor || '#000000'}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, textColor: e.target.value } })}
                />
              </div>
            </div>
            
            <div>
              <Label>Font Family</Label>
              <Select 
                value={component.styles.fontFamily || 'Inter'}
                onValueChange={(value) => onUpdate({ styles: { ...component.styles, fontFamily: value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Font Size</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  min={12}
                  max={72}
                  step={1}
                  value={[parseInt(component.styles.fontSize || '16')]}
                  onValueChange={(value) => onUpdate({ styles: { ...component.styles, fontSize: value[0] + 'px' } })}
                  className="flex-1"
                />
                <Input
                  id="font-size"
                  type="number"
                  min="12"
                  max="72"
                  value={parseInt(component.styles.fontSize || '16')}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, fontSize: e.target.value + 'px' } })}
                  className="w-20"
                />
              </div>
            </div>
            
            <div>
              <Label>Text Style</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={component.styles.fontWeight === 'bold' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ styles: { ...component.styles, fontWeight: component.styles.fontWeight === 'bold' ? undefined : 'bold' } })}
                >
                  B
                </Button>
                <Button
                  variant={component.styles.fontStyle === 'italic' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ styles: { ...component.styles, fontStyle: component.styles.fontStyle === 'italic' ? undefined : 'italic' } })}
                >
                  I
                </Button>
                <Button
                  variant={component.styles.textDecoration === 'underline' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ styles: { ...component.styles, textDecoration: component.styles.textDecoration === 'underline' ? undefined : 'underline' } })}
                >
                  U
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Text List Style</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['none', 'bulleted', 'numbered'].map((listType) => (
                  <Button
                    key={listType}
                    variant={component.content.listType === listType ? "default" : "outline"}
                    onClick={() => onUpdate({ content: { ...component.content, listType } })}
                    className="justify-start"
                  >
                    {listType.charAt(0).toUpperCase() + listType.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="line-height">Line Height</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  min={1}
                  max={2}
                  step={0.1}
                  value={[parseFloat(component.styles.lineHeight || '1.5')]}
                  onValueChange={(value) => onUpdate({ styles: { ...component.styles, lineHeight: value[0].toString() } })}
                  className="flex-1"
                />
                <Input
                  id="line-height"
                  type="number"
                  step="0.1"
                  min="1"
                  max="2"
                  value={parseFloat(component.styles.lineHeight || '1.5')}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, lineHeight: e.target.value } })}
                  className="w-20"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="letter-spacing">Letter Spacing</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  min={-0.1}
                  max={0.5}
                  step={0.01}
                  value={[parseFloat(component.styles.letterSpacing || '0')]}
                  onValueChange={(value) => onUpdate({ styles: { ...component.styles, letterSpacing: value[0] + 'em' } })}
                  className="flex-1"
                />
                <Input
                  id="letter-spacing"
                  type="number"
                  step="0.01"
                  min="-0.1"
                  max="0.5"
                  value={parseFloat(component.styles.letterSpacing || '0')}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, letterSpacing: e.target.value + 'em' } })}
                  className="w-20"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Value in em units (0.1 = 10%)</p>
            </div>
            
            <div>
              <Label>Responsive Sizing</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label htmlFor="mobile-font-size">Mobile Font Size</Label>
                  <Input
                    id="mobile-font-size"
                    type="number"
                    min="12"
                    max="24"
                    value={parseInt(component.styles.mobileFontSize || '14')}
                    onChange={(e) => onUpdate({ styles: { ...component.styles, mobileFontSize: e.target.value + 'px' } })}
                  />
                </div>
                <div>
                  <Label htmlFor="tablet-font-size">Tablet Font Size</Label>
                  <Input
                    id="tablet-font-size"
                    type="number"
                    min="14"
                    max="28"
                    value={parseInt(component.styles.tabletFontSize || '16')}
                    onChange={(e) => onUpdate({ styles: { ...component.styles, tabletFontSize: e.target.value + 'px' } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "header":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="header-logo">Logo Text</Label>
              <Input
                id="header-logo"
                value={component.content.logo || ""}
                onChange={(e) => updateContent("logo", e.target.value)}
                placeholder="Store Logo"
              />
            </div>
            
            <div>
              <Label>Navigation Items</Label>
              <div className="space-y-2 mt-2">
                {(component.content.navigation || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const navigation = [...component.content.navigation]
                        navigation[index] = e.target.value
                        updateContent("navigation", navigation)
                      }}
                      placeholder="Navigation item"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const navigation = component.content.navigation.filter((_: any, i: number) => i !== index)
                        updateContent("navigation", navigation)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const navigation = [...(component.content.navigation || []), "New Item"]
                    updateContent("navigation", navigation)
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Navigation Item
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Header Style</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "testimonials":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="testimonials-title">Section Title</Label>
              <Input
                id="testimonials-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="What Our Customers Say"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Testimonials</Label>
                <Button
                  size="sm"
                  onClick={() => {
                    const newTestimonial = {
                      id: Date.now().toString(),
                      name: "Customer Name",
                      role: "Customer",
                      content: "This is a great testimonial",
                      avatar: "/placeholder.svg?height=100&width=100",
                    }
                    updateContent("testimonials", [...(component.content.testimonials || []), newTestimonial])
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(component.content.testimonials || []).map((testimonial: any, index: number) => (
                  <Card key={testimonial.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Testimonial {index + 1}</span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const testimonials = component.content.testimonials.filter((_: any, i: number) => i !== index)
                            updateContent("testimonials", testimonials)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Avatar Image</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input
                            value={testimonial.avatar}
                            onChange={(e) => {
                              const testimonials = [...component.content.testimonials]
                              testimonials[index] = { ...testimonial, avatar: e.target.value }
                              updateContent("testimonials", testimonials)
                            }}
                            placeholder="Image URL"
                          />
                          <Button variant="outline" size="icon">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={testimonial.name}
                            onChange={(e) => {
                              const testimonials = [...component.content.testimonials]
                              testimonials[index] = { ...testimonial, name: e.target.value }
                              updateContent("testimonials", testimonials)
                            }}
                            placeholder="Customer Name"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={testimonial.role}
                            onChange={(e) => {
                              const testimonials = [...component.content.testimonials]
                              testimonials[index] = { ...testimonial, role: e.target.value }
                              updateContent("testimonials", testimonials)
                            }}
                            placeholder="Customer"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Testimonial Content</Label>
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => {
                            const testimonials = [...component.content.testimonials]
                            testimonials[index] = { ...testimonial, content: e.target.value }
                            updateContent("testimonials", testimonials)
                          }}
                          placeholder="Testimonial content"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "faq":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="faq-title">Section Title</Label>
              <Input
                id="faq-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Frequently Asked Questions"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>FAQ Items</Label>
                <Button
                  size="sm"
                  onClick={() => {
                    const newFaq = {
                      id: Date.now().toString(),
                      question: "New Question",
                      answer: "Answer to the question",
                    }
                    updateContent("faqs", [...(component.content.faqs || []), newFaq])
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(component.content.faqs || []).map((faq: any, index: number) => (
                  <Card key={faq.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">FAQ {index + 1}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const faqs = component.content.faqs.filter((_: any, i: number) => i !== index)
                          updateContent("faqs", faqs)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Question</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => {
                            const faqs = [...component.content.faqs]
                            faqs[index] = { ...faq, question: e.target.value }
                            updateContent("faqs", faqs)
                          }}
                          placeholder="Question"
                        />
                      </div>
                      
                      <div>
                        <Label>Answer</Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const faqs = [...component.content.faqs]
                            faqs[index] = { ...faq, answer: e.target.value }
                            updateContent("faqs", faqs)
                          }}
                          placeholder="Answer"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="image-src">Image Source</Label>
              <div className="flex space-x-2">
                <Input
                  id="image-src"
                  value={component.content.src || ""}
                  onChange={(e) => updateContent("src", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enter a URL or upload an image
              </p>
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={component.content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                placeholder="Describe the image"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Important for accessibility
              </p>
            </div>
            
            <div>
              <Label htmlFor="image-caption">Caption</Label>
              <Input
                id="image-caption"
                value={component.content.caption || ""}
                onChange={(e) => updateContent("caption", e.target.value)}
                placeholder="Add a caption (optional)"
              />
            </div>
            
            <div>
              <Label htmlFor="image-link">Link</Label>
              <Input
                id="image-link"
                value={component.content.link || ""}
                onChange={(e) => updateContent("link", e.target.value)}
                placeholder="https://example.com (optional)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Make the image clickable
              </p>
            </div>
          </div>
        )
    }
  }

  const renderStyleEditor = () => {
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="padding">Padding</Label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            <div>
              <Label className="text-xs">Top</Label>
              <Input
                id="padding-top"
                value={component.styles.paddingTop || component.styles.padding?.split(" ")[0] || ""}
                onChange={(e) => updateStyle("paddingTop", e.target.value)}
                placeholder="20px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <Input
                id="padding-right"
                value={component.styles.paddingRight || component.styles.padding?.split(" ")[1] || ""}
                onChange={(e) => updateStyle("paddingRight", e.target.value)}
                placeholder="20px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <Input
                id="padding-bottom"
                value={component.styles.paddingBottom || component.styles.padding?.split(" ")[2] || ""}
                onChange={(e) => updateStyle("paddingBottom", e.target.value)}
                placeholder="20px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <Input
                id="padding-left"
                value={component.styles.paddingLeft || component.styles.padding?.split(" ")[3] || ""}
                onChange={(e) => updateStyle("paddingLeft", e.target.value)}
                placeholder="20px"
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="margin">Margin</Label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            <div>
              <Label className="text-xs">Top</Label>
              <Input
                id="margin-top"
                value={component.styles.marginTop || component.styles.margin?.split(" ")[0] || ""}
                onChange={(e) => updateStyle("marginTop", e.target.value)}
                placeholder="0px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Right</Label>
              <Input
                id="margin-right"
                value={component.styles.marginRight || component.styles.margin?.split(" ")[1] || ""}
                onChange={(e) => updateStyle("marginRight", e.target.value)}
                placeholder="0px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Bottom</Label>
              <Input
                id="margin-bottom"
                value={component.styles.marginBottom || component.styles.margin?.split(" ")[2] || ""}
                onChange={(e) => updateStyle("marginBottom", e.target.value)}
                placeholder="0px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Left</Label>
              <Input
                id="margin-left"
                value={component.styles.marginLeft || component.styles.margin?.split(" ")[3] || ""}
                onChange={(e) => updateStyle("marginLeft", e.target.value)}
                placeholder="0px"
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="color"
              value={component.styles.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <Input
              value={component.styles.backgroundColor || ""}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="color"
              value={component.styles.textColor || "#000000"}
              onChange={(e) => updateStyle("textColor", e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <Input
              value={component.styles.textColor || ""}
              onChange={(e) => updateStyle("textColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <Label>Border</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                value={component.styles.borderWidth || "0"}
                onChange={(e) => updateStyle("borderWidth", e.target.value)}
                placeholder="0px"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Style</Label>
              <Select 
                value={component.styles.borderStyle || "none"}
                onValueChange={(value) => updateStyle("borderStyle", value)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={component.styles.borderColor || "#000000"}
                  onChange={(e) => updateStyle("borderColor", e.target.value)}
                  className="w-6 h-6 rounded border cursor-pointer"
                />
                <Input
                  value={component.styles.borderColor || ""}
                  onChange={(e) => updateStyle("borderColor", e.target.value)}
                  placeholder="#000000"
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label>Border Radius</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Slider
              min={0}
              max={50}
              step={1}
              value={[parseInt(component.styles.borderRadius || '0')]}
              onValueChange={(value) => updateStyle("borderRadius", value[0] + 'px')}
              className="flex-1"
            />
            <Input
              type="number"
              min="0"
              max="50"
              value={parseInt(component.styles.borderRadius || '0')}
              onChange={(e) => updateStyle("borderRadius", e.target.value + 'px')}
              className="w-20"
            />
          </div>
        </div>

        <div>
          <Label>Box Shadow</Label>
          <Select 
            value={component.styles.boxShadow || "none"}
            onValueChange={(value) => updateStyle("boxShadow", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shadow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {component.type === "hero" && (
          <div>
            <Label htmlFor="text-align">Text Alignment</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Button
                variant={component.styles.textAlign === "left" ? "default" : "outline"}
                onClick={() => updateStyle("textAlign", "left")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={component.styles.textAlign === "center" ? "default" : "outline"}
                onClick={() => updateStyle("textAlign", "center")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={component.styles.textAlign === "right" ? "default" : "outline"}
                onClick={() => updateStyle("textAlign", "right")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {component.type === "product-grid" && (
          <div>
            <Label htmlFor="columns">Columns</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Slider
                min={1}
                max={6}
                step={1}
                value={[component.styles.columns || 3]}
                onValueChange={(value) => updateStyle("columns", value[0])}
                className="flex-1"
              />
              <Input
                id="columns"
                type="number"
                min="1"
                max="6"
                value={component.styles.columns || 3}
                onChange={(e) => updateStyle("columns", Number.parseInt(e.target.value))}
                className="w-20"
              />
            </div>
            
            <Label htmlFor="gap" className="mt-4">Gap</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Slider
                min={0}
                max={50}
                step={1}
                value={[parseInt(component.styles.gap || '20')]}
                onValueChange={(value) => updateStyle("gap", value[0] + 'px')}
                className="flex-1"
              />
              <Input
                id="gap"
                type="number"
                min="0"
                max="50"
                value={parseInt(component.styles.gap || '20')}
                onChange={(e) => updateStyle("gap", e.target.value + 'px')}
                className="w-20"
              />
            </div>
          </div>
        )}

        <div>
          <Label>Responsive Visibility</Label>
          <div className="space-y-2 mt-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show on Desktop</Label>
              <Switch 
                checked={component.styles.showOnDesktop !== false}
                onCheckedChange={(checked) => updateStyle("showOnDesktop", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show on Tablet</Label>
              <Switch 
                checked={component.styles.showOnTablet !== false}
                onCheckedChange={(checked) => updateStyle("showOnTablet", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show on Mobile</Label>
              <Switch 
                checked={component.styles.showOnMobile !== false}
                onCheckedChange={(checked) => updateStyle("showOnMobile", checked)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAdvancedEditor = () => {
    return (
      <div className="space-y-6">
        <div>
          <Label>Custom CSS Classes</Label>
          <Input
            value={component.styles.customClasses || ""}
            onChange={(e) => updateStyle("customClasses", e.target.value)}
            placeholder="class1 class2 class3"
          />
        </div>
        
        <div>
          <Label>Custom CSS</Label>
          <Textarea
            value={component.styles.customCSS || ""}
            onChange={(e) => updateStyle("customCSS", e.target.value)}
            placeholder=".my-component { color: red; }"
            rows={4}
          />
        </div>
        
        <div>
          <Label>Animation</Label>
          <Select 
            value={component.styles.animation || "none"}
            onValueChange={(value) => updateStyle("animation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="fadeIn">Fade In</SelectItem>
              <SelectItem value="slideInUp">Slide In Up</SelectItem>
              <SelectItem value="slideInDown">Slide In Down</SelectItem>
              <SelectItem value="slideInLeft">Slide In Left</SelectItem>
              <SelectItem value="slideInRight">Slide In Right</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Animation Duration</Label>
          <Select 
            value={component.styles.animationDuration || "normal"}
            onValueChange={(value) => updateStyle("animationDuration", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Fast (0.2s)</SelectItem>
              <SelectItem value="normal">Normal (0.5s)</SelectItem>
              <SelectItem value="slow">Slow (1s)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Animation Delay</Label>
          <div className="flex items-center space-x-2">
            <Slider
              min={0}
              max={5}
              step={0.1}
              value={[parseFloat(component.styles.animationDelay || '0')]}
              onValueChange={(value) => updateStyle("animationDelay", value[0] + 's')}
              className="flex-1"
            />
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={parseFloat(component.styles.animationDelay || '0')}
              onChange={(e) => updateStyle("animationDelay", e.target.value + 's')}
              className="w-20"
            />
          </div>
        </div>
        
        <div>
          <Label>Component ID</Label>
          <Input
            value={component.id}
            readOnly
            className="font-mono text-xs"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{component.type}</Badge>
          <h3 className="text-lg font-semibold capitalize">
            {component.type.replace("-", " ")} Editor
          </h3>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="content" className="flex items-center justify-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center justify-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center justify-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-0">
          {renderContentEditor()}
        </TabsContent>
        
        <TabsContent value="style" className="mt-0">
          {renderStyleEditor()}
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          {renderAdvancedEditor()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
