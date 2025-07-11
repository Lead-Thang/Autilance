"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { aiProviders, getProviderById } from "@/lib/ai-providers"
import { ChevronDown, Sparkles } from "lucide-react"

interface AIProviderSelectorProps {
  currentProvider: string
  onProviderChange: (providerId: string) => void
  className?: string
}

export function AIProviderSelector({ currentProvider, onProviderChange, className }: AIProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const provider = getProviderById(currentProvider)

  if (!provider) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`justify-between min-w-[200px] ${className}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{provider.icon}</span>
            <span className="font-medium">{provider.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {aiProviders.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => {
              onProviderChange(p.id)
              setIsOpen(false)
            }}
            className="flex flex-col items-start gap-2 p-4 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">{p.icon}</span>
              <span className="font-medium">{p.name}</span>
              {p.id === currentProvider && (
                <Badge variant="secondary" className="ml-auto">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <div className="flex flex-wrap gap-1">
              {p.capabilities.slice(0, 2).map((capability) => (
                <Badge key={capability} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {p.capabilities.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{p.capabilities.length - 2} more
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
