"use client"

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import type { StoreComponent } from "../../lib/store-ai"
import { Plus, Trash2, Upload } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<"content" | "style">("content")

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
          <div className="space-y-4">
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
                rows={2}
              />
            </div>
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
            </div>
          </div>
        )

      case "product-grid":
        return (
          <div className="space-y-4">
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
                  <Card key={product.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Product {index + 1}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const products = component.content.products.filter((_: any, i: number) => i !== index)
                          updateContent("products", products)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={product.name}
                        onChange={(e) => {
                          const products = [...component.content.products]
                          products[index] = { ...product, name: e.target.value }
                          updateContent("products", products)
                        }}
                        placeholder="Product name"
                      />
                      <Input
                        value={product.price}
                        onChange={(e) => {
                          const products = [...component.content.products]
                          products[index] = { ...product, price: e.target.value }
                          updateContent("products", products)
                        }}
                        placeholder="$99.99"
                      />
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
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "about":
        return (
          <div className="space-y-4">
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
                rows={6}
              />
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                value={component.content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Contact Us"
              />
            </div>
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
              <Textarea
                id="text-content"
                value={component.content.text || ''}
                onChange={(e) => onUpdate({ content: { ...component.content, text: e.target.value } })}
                rows={4}
              />
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
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={component.styles.textColor || '#000000'}
                  onChange={(e) => onUpdate({ styles: { ...component.styles, textColor: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <Label>Font Family</Label>
              <select
                className="w-full p-2 border rounded"
                value={component.styles.fontFamily || 'Inter'}
                onChange={(e) => onUpdate({ styles: { ...component.styles, fontFamily: e.target.value } })}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <Label>Font Size</Label>
              <Input
                id="font-size"
                type="number"
                min="12"
                max="36"
                value={parseInt(component.styles.fontSize || '16')}
                onChange={(e) => onUpdate({ styles: { ...component.styles, fontSize: e.target.value + 'px' } })}
              />
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
              <Input
                id="line-height"
                type="number"
                step="0.1"
                min="1"
                max="2"
                value={parseFloat(component.styles.lineHeight || '1.5')}
                onChange={(e) => onUpdate({ styles: { ...component.styles, lineHeight: e.target.value } })}
              />
            </div>
            <div>
              <Label htmlFor="letter-spacing">Letter Spacing</Label>
              <Input
                id="letter-spacing"
                type="number"
                step="0.1"
                min="-0.1"
                max="0.5"
                value={parseFloat(component.styles.letterSpacing || '0')}
                onChange={(e) => onUpdate({ styles: { ...component.styles, letterSpacing: e.target.value + 'em' } })}
              />
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

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>No content editor available for this component type</p>
          </div>
        )
    }
  }

  const renderStyleEditor = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={component.styles.padding || ""}
            onChange={(e) => updateStyle("padding", e.target.value)}
            placeholder="20px"
          />
        </div>

        <div>
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={component.styles.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-10 h-10 rounded border"
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
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={component.styles.textColor || "#000000"}
              onChange={(e) => updateStyle("textColor", e.target.value)}
              className="w-10 h-10 rounded border"
            />
            <Input
              value={component.styles.textColor || ""}
              onChange={(e) => updateStyle("textColor", e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>

        {component.type === "hero" && (
          <div>
            <Label htmlFor="text-align">Text Alignment</Label>
            <select
              id="text-align"
              value={component.styles.textAlign || "center"}
              onChange={(e) => updateStyle("textAlign", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}

        {component.type === "product-grid" && (
          <div>
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              min="1"
              max="6"
              value={component.styles.columns || 3}
              onChange={(e) => updateStyle("columns", Number.parseInt(e.target.value))}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "content" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("content")}
          className="flex-1"
        >
          Content
        </Button>
        <Button
          variant={activeTab === "style" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("style")}
          className="flex-1"
        >
          Style
        </Button>
      </div>

      {activeTab === "content" ? renderContentEditor() : renderStyleEditor()}
    </div>
  )
}
