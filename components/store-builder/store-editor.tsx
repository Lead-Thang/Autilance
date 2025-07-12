"use client"

import { useState, useCallback, type ReactElement, type MouseEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { type StoreComponent, type StoreData, storeAI } from "../../lib/store-ai";
import { ComponentEditor } from "./component-editor";
import StorePreview from "./store-preview";
import { Eye, Edit, Save, Sparkles, Palette, Layout, Settings, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  component: StoreComponent;
  selectedComponent: string | null;
  onClick: () => void;
  onRemove: () => void;
}

interface StoreEditorProps {
  initialStore?: StoreData;
  onSave?: (store: StoreData) => void;
}

interface StoreEditorProps {
  initialStore?: StoreData
  onSave?: (store: StoreData) => void
}

export function StoreEditor({ initialStore, onSave }: StoreEditorProps): ReactElement {
  const [store, setStore] = useState<StoreData>(
    initialStore || {
      id: "",
      name: "",
      domain: "",
      components: [],
      theme: {
        primaryColor: "#6366f1",
        secondaryColor: "#8b5cf6",
        fontFamily: "Inter",
        layout: "modern",
      },
      seo: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  )

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const updateComponent = useCallback((componentId: string, updates: Partial<StoreComponent>) => {
    setStore((prev) => ({
      ...prev,
      components: prev.components.map((comp) => (comp.id === componentId ? { ...comp, ...updates } : comp)),
    }))
  }, [])

  const addComponent = useCallback(
    (type: StoreComponent["type"]) => {
      const newComponent: StoreComponent = {
        id: Date.now().toString(),
        type,
        content: getDefaultContent(type),
        styles: getDefaultStyles(type),
        position: store.components.length,
      }

      setStore((prev) => ({
        ...prev,
        components: [...prev.components, newComponent],
      }))
    },
    [store.components.length],
  )

  const removeComponent = useCallback((componentId: string) => {
    setStore((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
    }))
  }, [])

  const moveComponent = useCallback((componentId: string, direction: "up" | "down") => {
    setStore((prev) => {
      const components = [...prev.components]
      const index = components.findIndex((comp) => comp.id === componentId)

      if (index === -1) return prev

      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex >= 0 && newIndex < components.length) {
        [components[index], components[newIndex]] = [components[newIndex], components[index]]
      }
      
      return { ...prev, components }
    })
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    
    if (active.id !== over.id) {
      const oldIndex = store.components.findIndex((c) => c.id === active.id)
      const newIndex = store.components.findIndex((c) => c.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        setStore((prev) => ({
          ...prev,
          components: arrayMove(store.components, oldIndex, newIndex),
        }))
      }
    }
  }

  const optimizeWithAI = useCallback(
    async (instruction: string) => {
      if (!selectedComponent) return

      setIsOptimizing(true)
      try {
        const component = store.components.find((comp) => comp.id === selectedComponent)
        if (component) {
          const optimized = await storeAI.optimizeComponent(component, instruction)
          updateComponent(selectedComponent, optimized)
        }
      } catch (error) {
        console.error("AI optimization failed:", error)
      } finally {
        setIsOptimizing(false)
      }
    },
    [selectedComponent, store.components, updateComponent],
  )

  const handleSave = useCallback(async () => {
    try {
      // First try to save to our serverless function
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', data: store }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save store')
      }
      
      // If we have a free domain and it's the first save, register it
      if (store.seo.freeDomain && !store.id) {
        const freeDomainResponse = await fetch('/api/domain/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: store.seo.freeDomain, storeId: store.id }),
        })
        
        if (!freeDomainResponse.ok) {
          console.error('Failed to register free domain')
        }
      }
      
      onSave?.(store)
    } catch (error) {
      console.error('Save error:', error)
      // Fallback to local storage if serverless save fails
      localStorage.setItem(`store:${store.id}`, JSON.stringify(store))
    }
  }, [store, onSave])

  if (isPreviewMode) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Store Preview</h2>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Store
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <StorePreview store={store} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Left Panel - Components & Settings */}
      <div className="w-80 border-r bg-background overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Store Builder</h2>
            <Button size="sm" onClick={() => setIsPreviewMode(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={store.name}
              onChange={(e) => setStore((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="My Awesome Store"
            />
          </div>
        </div>

        <Tabs defaultValue="components" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="components">
              <Layout className="w-4 h-4 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="w-4 h-4 mr-1" />
              Design
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-3">Add Components</h3>
              <div className="grid grid-cols-2 gap-2">
                {['hero', 'product-grid', 'about', 'contact', 'footer', 'text'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addComponent(type as StoreComponent["type"])}
                    className="justify-start"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Components</h3>
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={store.components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 mt-2">
                    {store.components.map((component) => (
                      <SortableItem
                        key={component.id}
                        component={component}
                        selectedComponent={selectedComponent}
                        onClick={() => setSelectedComponent(component.id)}
                        onRemove={() => removeComponent(component.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          <TabsContent value="design" className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-3">Theme Colors</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="primary-color"
                      value={store.theme.primaryColor}
                      onChange={(e) =>
                        setStore((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, primaryColor: e.target.value },
                        }))
                      }
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={store.theme.primaryColor}
                      onChange={(e) =>
                        setStore((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, primaryColor: e.target.value },
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="color"
                      id="secondary-color"
                      value={store.theme.secondaryColor}
                      onChange={(e) =>
                        setStore((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, secondaryColor: e.target.value },
                        }))
                      }
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={store.theme.secondaryColor}
                      onChange={(e) =>
                        setStore((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, secondaryColor: e.target.value },
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Layout Style</h3>
              <div className="grid grid-cols-1 gap-2">
                {["modern", "classic", "minimal"].map((layout) => (
                  <Button
                    key={layout}
                    variant={store.theme.layout === layout ? "default" : "outline"}
                    onClick={() =>
                      setStore((prev) => ({
                        ...prev,
                        theme: { ...prev.theme, layout: layout as StoreData["theme"]["layout"] },
                      }))
                    }
                    className="justify-start"
                  >
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-3">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">Page Title</Label>
                  <Input
                    id="seo-title"
                    value={store.seo.title}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, title: e.target.value },
                      }))
                    }
                    placeholder="My Store - Best Products Online"
                  />
                </div>
                <div>
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={store.seo.description}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, description: e.target.value },
                      }))
                    }
                    placeholder="Discover amazing products at great prices..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seo-keywords">Keywords</Label>
                  <Input
                    id="seo-keywords"
                    value={store.seo.keywords.join(',')}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, keywords: e.target.value.split(',').map(k => k.trim()) },
                      }))
                    }
                    placeholder="online store, shopping, products"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Comma-separated list of keywords
                  </p>
                </div>
                <div>
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input
                    id="canonical-url"
                    value={store.seo.canonicalUrl || ''}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, canonicalUrl: e.target.value },
                      }))
                    }
                    placeholder="https://yourstore.autilance.com"
                  />
                </div>
                <div>
                  <Label htmlFor="robots-tag">Robots Meta Tag</Label>
                  <select
                    id="robots-tag"
                    className="w-full p-2 border rounded"
                    value={store.seo.robots || 'index, follow'}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, robots: e.target.value }
                      }))
                    }
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, follow">Noindex, Follow</option>
                    <option value="index, nofollow">Index, Nofollow</option>
                    <option value="noindex, nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input
                    id="ga-id"
                    value={store.seo.gaId || ''}
                    onChange={(e) =>
                      setStore((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, gaId: e.target.value },
                      }))
                    }
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your Google Analytics tracking ID for visitor analytics
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Publishing</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subdomain">Custom Subdomain</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="subdomain"
                      value={store.domain}
                      onChange={(e) => setStore((prev) => ({ ...prev, domain: e.target.value }))}
                      placeholder="your-store"
                    />
                    <span className="ml-2 text-muted-foreground">.autilance.com</span>
                  </div>
                </div>
                <div>
                  <Label>Free Custom Domain</Label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-md text-sm">
                    {store.seo.freeDomain || `your-store.free.autilance.com`}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free custom domain provided by Autilance (first year)
                  </p>
                </div>
                <div>
                  <Label>Custom Domain</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={store.seo.customDomain || ''}
                      onChange={(e) => setStore((prev) => ({ ...prev, seo: { ...prev.seo, customDomain: e.target.value } }))}
                      placeholder="www.yourdomain.com"
                    />
                    <Button size="sm">Connect</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect your own domain from providers like GoDaddy, Namecheap or Google Domains
                  </p>
                </div>
                <Button className="w-full">
                  Publish Store
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Center Panel - Component Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {selectedComponent
                ? `Edit ${store.components.find((c) => c.id === selectedComponent)?.type || "Component"}`
                : "Select a component to edit"}
            </h3>
            <div className="flex space-x-2">
              {selectedComponent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeWithAI("Make this component more engaging and conversion-focused")}
                  disabled={isOptimizing}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isOptimizing ? "Optimizing..." : "AI Optimize"}
                </Button>
              )}
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedComponent ? (
            <ComponentEditor
              component={store.components.find((c) => c.id === selectedComponent)!}
              onUpdate={(updates) => updateComponent(selectedComponent, updates)}
              storeTheme={store.theme}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a component from the left panel to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-96 border-l bg-muted/20">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Live Preview</h3>
        </div>
        <div className="h-full overflow-y-auto">
          <StorePreview store={store} compact />
        </div>
      </div>
    </div>
  )
}

const SortableItem = ({ component, selectedComponent, onClick, onRemove }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: component.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        selectedComponent === component.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {component.type}
          </Badge>
          <span className="text-sm font-medium">
            {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace("-", " ")}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

function getDefaultContent(type: StoreComponent["type"]) {
  switch (type) {
    case "hero":
      return {
        title: "Welcome to Our Store",
        subtitle: "Discover amazing products",
        ctaText: "Shop Now",
        backgroundImage: "/placeholder.svg?height=600&width=1200",
      }
    case "product-grid":
      return {
        title: "Featured Products",
        products: [
          {
            id: "1",
            name: "Product 1",
            price: "$99.99",
            image: "/placeholder.svg?height=300&width=300",
            description: "Amazing product description",
          },
        ],
      }
    case "about":
      return {
        title: "About Us",
        description: "We are passionate about providing quality products.",
      }
    case "contact":
      return {
        title: "Contact Us",
        email: "hello@store.com",
        phone: "+1 (555) 123-4567",
        address: "123 Store Street, City, State 12345",
      }
    case "footer":
      return {
        copyright: "© 2024 Store. All rights reserved.",
        links: ["Privacy Policy", "Terms of Service", "Contact"],
      }
    default:
      return {}
  }
}

function getDefaultStyles(type: StoreComponent["type"]) {
  switch (type) {
    case "hero":
      return { textAlign: "center", padding: "80px 20px", backgroundColor: "#f8f9fa" }
    case "product-grid":
      return { columns: 3, gap: "20px", padding: "60px 20px" }
    case "about":
      return { padding: "60px 20px", textAlign: "center" }
    case "contact":
      return { padding: "60px 20px" }
    case "footer":
      return { backgroundColor: "#f8f9fa", padding: "40px 20px", textAlign: "center" }
    default:
      return {}
  }
}
