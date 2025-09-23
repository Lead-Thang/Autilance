"use client"

import { useState, useCallback, type ReactElement, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { 
  type StoreComponent, 
  type StoreData, 
  storeAI 
} from "../../lib/store-ai";
import { ComponentEditor } from "./component-editor";
import StorePreview from "./store-preview";
import { 
  Eye, 
  Edit, 
  Save, 
  Sparkles, 
  Palette, 
  Layout, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Copy,
  Move,
  ShoppingCart,
  Users,
  BarChart3,
  Image as ImageIcon,
  Upload,
  Download,
  Undo,
  Redo,
  Grid,
  List,
  Menu,
  Search,
  Filter,
  Star,
  Heart,
  Share2,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Palette as PaletteIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Scissors,
  Lock,
  Unlock,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Gift,
  Tag,
  Zap,
  Target,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  Bell,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  ExternalLink,
  ShoppingCart as ShoppingCartIcon,
  Home
} from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

interface SortableItemProps {
  component: StoreComponent;
  selectedComponent: string | null;
  onClick: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableItem = ({ 
  component, 
  selectedComponent, 
  onClick, 
  onRemove, 
  onDuplicate, 
  onMoveUp, 
  onMoveDown 
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 rounded-md border bg-background ${
        selectedComponent === component.id ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
        >
          <Move className="w-4 h-4" />
        </button>
        <div className="truncate text-sm">
          {component.type.replace("-", " ")}
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveUp}
        >
          <ArrowUp className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onMoveDown}
        >
          <ArrowDown className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onDuplicate}
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

interface StoreEditorProps {
  initialStore?: StoreData;
  onSave?: (store: StoreData) => void;
}

export function StoreEditor({ initialStore, onSave }: StoreEditorProps): ReactElement {
  const [store, setStore] = useState<StoreData>(
    initialStore || {
      id: "",
      name: "",
      domain: "",
      components: [], // Start with empty components for a blank canvas
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
  const [history, setHistory] = useState<StoreData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState("components")
  const [searchTerm, setSearchTerm] = useState("")
  const [previewWidth, setPreviewWidth] = useState(384) // 96 * 4 (default w-96)
  const [isResizing, setIsResizing] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Save state to history for undo/redo
  useEffect(() => {
    if (historyIndex === -1) {
      setHistory([store])
      setHistoryIndex(0)
    } else if (history[historyIndex] !== store) {
      const newHistory = [...history.slice(0, historyIndex + 1), store]
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [store, history, historyIndex])

  // Handle mouse events for resizing
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const container = document.querySelector('.store-editor-container')
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const newWidth = containerRect.right - e.clientX
          // Set min and max width constraints
          setPreviewWidth(Math.min(Math.max(newWidth, 320), 800))
        }
      }
    },
    [isResizing]
  )

  // Add/remove mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    } else {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setStore(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setStore(history[historyIndex + 1])
    }
  }, [history, historyIndex])

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
      
      // Select the newly added component
      setSelectedComponent(newComponent.id)
    },
    [store.components.length],
  )

  const removeComponent = useCallback((componentId: string) => {
    setStore((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== componentId),
    }))
    
    // If we're removing the selected component, deselect it
    if (selectedComponent === componentId) {
      setSelectedComponent(null)
    }
  }, [selectedComponent])

  const duplicateComponent = useCallback((componentId: string) => {
    const component = store.components.find((comp) => comp.id === componentId)
    if (component) {
      const newComponent: StoreComponent = {
        ...component,
        id: Date.now().toString(),
        position: store.components.length,
      }
      
      setStore((prev) => ({
        ...prev,
        components: [...prev.components, newComponent],
      }))
    }
  }, [store.components])

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
          toast.success("Component optimized with AI!")
        }
      } catch (error) {
        console.error("AI optimization failed:", error)
        toast.error("Failed to optimize component with AI")
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
      toast.success("Store saved successfully!")
    } catch (error) {
      console.error('Save error:', error)
      // Fallback to local storage if serverless save fails
      localStorage.setItem(`store:${store.id}`, JSON.stringify(store))
      toast.success("Store saved locally!")
    }
  }, [store, onSave])

  const exportStore = useCallback(() => {
    const dataStr = JSON.stringify(store, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${store.name || 'store'}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Store exported successfully!")
  }, [store])

  const importStore = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedStore = JSON.parse(e.target?.result as string);
        setStore(importedStore);
        toast.success("Store imported successfully!");
      } catch (error) {
        toast.error("Failed to import store. Invalid file format.");
      }
    };
    reader.readAsText(file);
  }, [])

  // Remove the preview mode check since we're making it editable by default

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-background">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Store Builder</h2>
          <Badge variant="secondary" className="text-xs">
            {store.components.length} components
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <div className="h-5 w-px bg-border mx-2"></div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e) => importStore(e as any);
              input.click();
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={exportStore}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <div className="h-5 w-px bg-border mx-2"></div>
          
          <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            {isPreviewMode ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden store-editor-container">
        {/* Left Panel - Components & Settings */}
        <div className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} border-r bg-background flex flex-col transition-all duration-300`}>
          <div className="p-4 border-b">
            {!isSidebarCollapsed && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={store.name}
                    onChange={(e) => setStore((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="My Awesome Store"
                  />
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search components..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Collapse/Expand Button */}
            <Button 
              size="sm" 
              className="absolute top-4 right-4 p-2 h-8 w-8"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className={`grid w-full ${isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-4'}`}>
              <TabsTrigger value="components" className="flex flex-col items-center">
                <Layout className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-xs mt-1">Components</span>}
              </TabsTrigger>
              <TabsTrigger value="design" className="flex flex-col items-center">
                <PaletteIcon className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-xs mt-1">Design</span>}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center">
                <Settings className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-xs mt-1">Settings</span>}
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex flex-col items-center">
                <Grid className="w-4 h-4" />
                {!isSidebarCollapsed && <span className="text-xs mt-1">Pages</span>}
              </TabsTrigger>
            </TabsList>

            {!isSidebarCollapsed && (
              <TabsContent value="components" className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 space-y-4 flex-1 overflow-auto">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Add Components</h3>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'hero', 'product-grid', 'about', 'contact', 
                        'footer', 'text', 'header', 'testimonials',
                        'faq', 'newsletter', 'team', 'pricing', 'image' // Added image component
                      ]
                        .filter(type => 
                          searchTerm === "" || 
                          type.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((type) => (
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
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Components</h3>
                      <span className="text-xs text-muted-foreground">
                        {store.components.length} items
                      </span>
                    </div>
                    
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={store.components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {store.components
                            .filter(component => 
                              searchTerm === "" || 
                              component.type.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((component) => (
                              <SortableItem
                                key={component.id}
                                component={component}
                                selectedComponent={selectedComponent}
                                onClick={() => setSelectedComponent(component.id)}
                                onRemove={() => removeComponent(component.id)}
                                onDuplicate={() => duplicateComponent(component.id)}
                                onMoveUp={() => moveComponent(component.id, "up")}
                                onMoveDown={() => moveComponent(component.id, "down")}
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </TabsContent>
            )}

            {!isSidebarCollapsed && (
              <TabsContent value="design" className="flex-1 overflow-auto p-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Theme Colors</h3>
                  <div className="space-y-4">
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
                          className="w-10 h-10 rounded border cursor-pointer"
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
                          className="w-10 h-10 rounded border cursor-pointer"
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
                  <h3 className="font-medium mb-3">Typography</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Font Family</Label>
                      <Select 
                        value={store.theme.fontFamily}
                        onValueChange={(value) => 
                          setStore((prev) => ({
                            ...prev,
                            theme: { ...prev.theme, fontFamily: value },
                          }))
                        }
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
            )}

            {!isSidebarCollapsed && (
              <TabsContent value="settings" className="flex-1 overflow-auto p-4 space-y-6">
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
                      <Select
                        value={store.seo.robots || 'index, follow'}
                        onValueChange={(value) =>
                          setStore((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, robots: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="index, follow">Index, Follow</SelectItem>
                          <SelectItem value="noindex, follow">Noindex, Follow</SelectItem>
                          <SelectItem value="index, nofollow">Index, Nofollow</SelectItem>
                          <SelectItem value="noindex, nofollow">Noindex, Nofollow</SelectItem>
                        </SelectContent>
                      </Select>
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
            )}
            
            {!isSidebarCollapsed && (
              <TabsContent value="pages" className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Pages</h3>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Products
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Info className="w-4 h-4 mr-2" />
                        About
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

          {/* Center Panel - Live Edit Preview */}
        <div className="flex-1 flex flex-col border-r relative bg-white">
          <div className="p-4 border-b bg-background flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {isPreviewMode ? "Preview Mode" : "Edit Mode"}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => optimizeWithAI("Make this component more engaging and conversion-focused")}
                disabled={isOptimizing || isPreviewMode}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isOptimizing ? "Optimizing..." : "AI Optimize"}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto relative">
            {/* Editable Preview - Blank Canvas */}
            <div className="relative min-h-full">
              {store.components.length === 0 ? (
                // Blank canvas state
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="max-w-md">
                    <Layout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-2xl font-bold mb-2">Blank Canvas</h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your website by adding components from the left panel or by dragging elements onto the canvas.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => addComponent("hero")}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center justify-center"
                      >
                        <Plus className="w-5 h-5 mb-2" />
                        <span>Add Hero Section</span>
                      </Button>
                      <Button 
                        onClick={() => addComponent("text")}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center justify-center"
                      >
                        <Type className="w-5 h-5 mb-2" />
                        <span>Add Text</span>
                      </Button>
                      <Button 
                        onClick={() => addComponent("product-grid")}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center justify-center"
                      >
                        <Grid className="w-5 h-5 mb-2" />
                        <span>Add Products</span>
                      </Button>
                      <Button 
                        onClick={() => addComponent("image")}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center justify-center"
                      >
                        <ImageIcon className="w-5 h-5 mb-2" />
                        <span>Add Image</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Component rendering
                store.components
                  .sort((a, b) => a.position - b.position)
                  .map((component) => (
                    <EditableComponent
                      key={component.id}
                      component={component}
                      isSelected={selectedComponent === component.id}
                      isPreviewMode={isPreviewMode}
                      storeTheme={store.theme}
                      onSelect={() => !isPreviewMode && setSelectedComponent(component.id)}
                      onUpdate={(updates) => !isPreviewMode && updateComponent(component.id, updates)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Right Panel - Component Properties */}
        <div 
          className="flex flex-col bg-muted/20 border-l" 
          style={{ width: `${previewWidth}px` }}
        >
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedComponent 
                  ? `${store.components.find(c => c.id === selectedComponent)?.type.replace('-', ' ') || 'Component'} Properties` 
                  : 'Properties'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="h-8 w-8 p-0"
              >
                {isPreviewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
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
              <div className="p-4 text-muted-foreground">
                <p>Select a component to edit its properties.</p>
              </div>
            )}
          </div>
          {/* Resize Handle */}
          <div 
            className="absolute top-0 left-0 w-2 h-full cursor-col-resize bg-transparent hover:bg-primary/10 transition-colors"
            onMouseDown={startResizing}
          />
        </div>
      </div>
  )
}

interface EditableComponentProps {
  component: StoreComponent;
  isSelected: boolean;
  isPreviewMode: boolean;
  storeTheme: StoreData["theme"];
  onSelect: () => void;
  onUpdate: (updates: Partial<StoreComponent>) => void;
}

const EditableComponent = ({ 
  component, 
  isSelected, 
  isPreviewMode, 
  storeTheme, 
  onSelect, 
  onUpdate 
}: EditableComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldEdit = (field: string, value: string) => {
    if (component.type === "text") {
      onUpdate({
        content: {
          ...component.content,
          [field]: value
        }
      });
    } else if (component.type === "hero") {
      onUpdate({
        content: {
          ...component.content,
          [field]: value
        }
      });
    } else if (component.type === "product-grid") {
      onUpdate({
        content: {
          ...component.content,
          [field]: value
        }
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload to a service like UploadThing
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    
    if (component.type === "hero") {
      onUpdate({
        content: {
          ...component.content,
          backgroundImage: url
        }
      });
    } else if (component.type === "product-grid") {
      onUpdate({
        content: {
          ...component.content,
          products: component.content.products?.map((p: any, i: number) => 
            i === 0 ? {...p, image: url} : p
          ) || []
        }
      });
    } else if (component.type === "text") {
      onUpdate({
        content: {
          ...component.content,
          image: url
        }
      });
    } else if (component.type === "image") {
      onUpdate({
        content: {
          ...component.content,
          src: url
        }
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    onSelect();
    
    // If it's a text component, start editing on double click
    if (component.type === "text" && e.detail === 2) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleFieldEdit(e.target.name, e.target.value);
  };

  // Render editable component based on type
  const renderEditableComponent = () => {
    switch (component.type) {
      case "hero":
        return (
          <div
            className="relative bg-cover bg-center min-h-[400px] flex items-center justify-center"
            style={{
              backgroundImage: `url(${component.content.backgroundImage})`,
              padding: component.styles.padding,
              backgroundColor: component.styles.backgroundColor,
              textAlign: component.styles.textAlign as any,
            }}
            onClick={handleClick}
          >
            {isSelected && !isPreviewMode && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            )}
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              {isEditing && editField === "title" ? (
                <input
                  type="text"
                  name="title"
                  value={component.content.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="text-5xl font-bold mb-4 bg-white/80 p-2 rounded"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-5xl font-bold mb-4 text-white"
                  onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField("title")}
                >
                  {component.content.title}
                </h1>
              )}
              
              {isEditing && editField === "subtitle" ? (
                <input
                  type="text"
                  name="subtitle"
                  value={component.content.subtitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="text-xl mb-8 bg-white/80 p-2 rounded"
                  autoFocus
                />
              ) : (
                <p 
                  className="text-xl mb-8 text-white/90"
                  onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField("subtitle")}
                >
                  {component.content.subtitle}
                </p>
              )}
              
              <Button
                size="lg"
                style={{
                  backgroundColor: storeTheme.primaryColor,
                  color: "white",
                }}
                onClick={(e) => {
                  if (!isPreviewMode) {
                    e.stopPropagation();
                    setIsEditing(true);
                    setEditField("ctaText");
                  }
                }}
              >
                {isEditing && editField === "ctaText" ? (
                  <input
                    type="text"
                    name="ctaText"
                    value={component.content.ctaText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-transparent border-none text-white"
                    autoFocus
                  />
                ) : (
                  component.content.ctaText
                )}
              </Button>
            </div>
            
            {isSelected && !isPreviewMode && (
              <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none"></div>
            )}
          </div>
        );
      
      case "text":
        return (
          <div
            className="max-w-4xl mx-auto p-8 relative"
            onClick={handleClick}
          >
            {isEditing && editField === "heading" ? (
              <input
                type="text"
                name="heading"
                value={component.content.heading}
                onChange={handleChange}
                onBlur={handleBlur}
                className="text-2xl font-bold mb-4 w-full p-2 border rounded"
                autoFocus
              />
            ) : (
              <h2 
                className="text-2xl font-bold mb-4"
                onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField("heading")}
              >
                {component.content.heading}
              </h2>
            )}
            
            {isEditing && editField === "text" ? (
              <textarea
                name="text"
                value={component.content.text}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded min-h-[100px]"
                autoFocus
              />
            ) : (
              <div 
                className="prose"
                onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField("text")}
              >
                {component.content.listType === 'none' && <p>{component.content.text}</p>}
                {component.content.listType === 'bulleted' && (
                  <ul className="list-disc pl-5 space-y-2">
                    {component.content.text.split('\n').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {component.content.listType === 'numbered' && (
                  <ol className="list-decimal pl-5 space-y-2">
                    {component.content.text.split('\n').map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}
            
            {isSelected && !isPreviewMode && (
              <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none"></div>
            )}
          </div>
        );
      
      case "product-grid":
        return (
          <div
            className="max-w-6xl mx-auto p-8 relative"
            onClick={handleClick}
          >
            {isEditing && editField === "title" ? (
              <input
                type="text"
                name="title"
                value={component.content.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className="text-3xl font-bold text-center mb-12 w-full p-2 border rounded"
                autoFocus
              />
            ) : (
              <h2 
                className="text-3xl font-bold text-center mb-12"
                onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField("title")}
              >
                {component.content.title}
              </h2>
            )}
            
            <div className="grid grid-cols-3 gap-6">
              {component.content.products?.map((product: any) => (
                <div key={product.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && !isPreviewMode && (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="p-4">
                    {isEditing && editField === `product-name-${product.id}` ? (
                      <input
                        type="text"
                        name={`product-name-${product.id}`}
                        value={product.name}
                        onChange={(e) => {
                          const updatedProducts = component.content.products.map((p: any) => 
                            p.id === product.id ? {...p, name: e.target.value} : p
                          );
                          onUpdate({
                            content: {
                              ...component.content,
                              products: updatedProducts
                            }
                          });
                        }}
                        onBlur={handleBlur}
                        className="font-semibold mb-2 w-full p-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="font-semibold mb-2"
                        onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField(`product-name-${product.id}`)}
                      >
                        {product.name}
                      </h3>
                    )}
                    
                    {isEditing && editField === `product-description-${product.id}` ? (
                      <textarea
                        name={`product-description-${product.id}`}
                        value={product.description}
                        onChange={(e) => {
                          const updatedProducts = component.content.products.map((p: any) => 
                            p.id === product.id ? {...p, description: e.target.value} : p
                          );
                          onUpdate({
                            content: {
                              ...component.content,
                              products: updatedProducts
                            }
                          });
                        }}
                        onBlur={handleBlur}
                        className="text-sm text-gray-600 mb-3 w-full p-1 border rounded min-h-[60px]"
                      />
                    ) : (
                      <p 
                        className="text-sm text-gray-600 mb-3"
                        onDoubleClick={() => !isPreviewMode && setIsEditing(true) && setEditField(`product-description-${product.id}`)}
                      >
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: storeTheme.primaryColor }}>
                        {product.price}
                      </span>
                      <Button size="sm" style={{ backgroundColor: storeTheme.primaryColor }}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {isSelected && !isPreviewMode && (
              <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none"></div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        );
      
      case "image":
        return (
          <div
            className="relative p-8"
            onClick={handleClick}
          >
            <div className="max-w-4xl mx-auto">
              <img
                src={component.content.src}
                alt={component.content.alt}
                className="w-full h-auto rounded-lg"
              />
              {component.content.caption && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {component.content.caption}
                </p>
              )}
            </div>
            
            {isSelected && !isPreviewMode && (
              <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none"></div>
              
            )}
            
            {isSelected && !isPreviewMode && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div 
            className="p-8 border-b relative"
            onClick={handleClick}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace("-", " ")}
              </h2>
              <p>Click to select this component. Use the left panel to edit properties.</p>
            </div>
            
            {isSelected && !isPreviewMode && (
              <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none"></div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`relative ${isSelected ? "ring-2 ring-primary" : ""}`}>
      {renderEditableComponent()}
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
          {
            id: "2",
            name: "Product 2",
            price: "$149.99",
            image: "/placeholder.svg?height=300&width=300",
            description: "Another great product",
          },
          {
            id: "3",
            name: "Product 3",
            price: "$199.99",
            image: "/placeholder.svg?height=300&width=300",
            description: "Premium quality product",
          },
        ],
      }
    case "about":
      return {
        title: "About Us",
        description: "We are passionate about providing quality products.",
        image: "/placeholder.svg?height=400&width=600",
      }
    case "contact":
      return {
        title: "Contact Us",
        email: "hello@store.com",
        phone: "+1 (555) 123-4567",
        address: "123 Store Street, City, State 12345",
        hours: `Monday-Friday: 9AM-6PM
Saturday: 10AM-4PM
Sunday: Closed`,
        facebook: "https://facebook.com/yourstore",
        twitter: "https://twitter.com/yourstore",
        instagram: "https://instagram.com/yourstore",
        youtube: "https://youtube.com/yourstore",
      }
    case "footer":
      return {
        copyright: "© 2024 Store. All rights reserved.",
        links: ["Privacy Policy", "Terms of Service", "Contact"],
      }
    case "header":
      return {
        logo: "Store Logo",
        navigation: ["Home", "Products", "About", "Contact"],
      }
    case "testimonials":
      return {
        title: "What Our Customers Say",
        testimonials: [
          {
            id: "1",
            name: "John Doe",
            role: "Customer",
            content: "This store has the best products and customer service!",
            avatar: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "2",
            name: "Jane Smith",
            role: "Regular Customer",
            content: "I've been shopping here for years and never been disappointed.",
            avatar: "/placeholder.svg?height=100&width=100",
          },
        ],
      }
    case "faq":
      return {
        title: "Frequently Asked Questions",
        faqs: [
          {
            id: "1",
            question: "How long does shipping take?",
            answer: "Shipping usually takes 3-5 business days.",
          },
          {
            id: "2",
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy on all products.",
          },
        ],
      }
    case "newsletter":
      return {
        title: "Subscribe to Our Newsletter",
        description: "Get the latest updates and special offers.",
        placeholder: "Enter your email"
      }
    case "team":
      return {
        title: "Meet Our Team",
        members: [
          {
            id: "1",
            name: "Alex Johnson",
            role: "CEO",
            bio: "10+ years of experience in e-commerce.",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "2",
            name: "Sarah Williams",
            role: "Marketing Director",
            bio: "Digital marketing expert with a passion for growth.",
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
      }
    case "pricing":
      return {
        title: "Our Pricing Plans",
        plans: [
          {
            id: "1",
            name: "Basic",
            price: "$9.99",
            period: "month",
            features: ["Up to 10 products", "Basic support", "1GB storage"],
            cta: "Get Started",
          },
          {
            id: "2",
            name: "Pro",
            price: "$29.99",
            period: "month",
            features: ["Up to 100 products", "Priority support", "10GB storage", "Analytics"],
            cta: "Try Free",
          },
          {
            id: "3",
            name: "Enterprise",
            price: "$99.99",
            period: "month",
            features: ["Unlimited products", "24/7 support", "100GB storage", "Advanced analytics", "Custom domain"],
            cta: "Contact Us",
          },
        ]
      }
    case "text":
      return {
        heading: "Text Section",
        text: "This is a text section where you can add your content. Double-click to edit.",
        alignment: "left",
        listType: "none",
        image: "/placeholder.svg?height=300&width=400",
      }
    case "image":
      return {
        src: "/placeholder.svg?height=400&width=600",
        alt: "Image description",
        caption: "",
        link: "",
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
    case "header":
      return { padding: "20px", backgroundColor: "#ffffff" }
    case "testimonials":
      return { padding: "60px 20px", backgroundColor: "#f8f9fa" }
    case "faq":
      return { padding: "60px 20px" }
    case "newsletter":
      return { padding: "60px 20px", backgroundColor: "#f8f9fa" }
    case "team":
      return { padding: "60px 20px" }
    case "pricing":
      return { padding: "60px 20px" }
    default:
      return {}
  }
}