"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import type { UserContext } from "../hooks/use-ai-chat"
import { useAIChat } from "../hooks/use-ai-chat"
import { Settings, Plus, X } from "lucide-react"

interface UserContextSetupProps {
  context: UserContext
  onContextUpdate: (updates: Partial<UserContext>) => void
}

const businessTypes = [
  "Technology Startup",
  "E-commerce",
  "Consulting",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Finance",
  "Real Estate",
  "Marketing Agency",
  "Other",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Real Estate",
  "Marketing",
  "Other",
]

export function UserContextSetup({ context, onContextUpdate }: UserContextSetupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localContext, setLocalContext] = useState<UserContext>(context)
  const [newGoal, setNewGoal] = useState("")

  const handleSave = () => {
    onContextUpdate(localContext)
    setIsOpen(false)
  }

  const addGoal = () => {
    if (newGoal.trim() && (!localContext.goals || !localContext.goals.includes(newGoal.trim()))) {
      setLocalContext((prev) => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal.trim()],
      }))
      setNewGoal("")
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setLocalContext((prev) => ({
      ...prev,
      goals: prev.goals?.filter((goal) => goal !== goalToRemove) || [],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Personalize AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalize Your AI Experience</DialogTitle>
          <DialogDescription>
            Help our AI assistants understand your business and communication preferences for more relevant responses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={localContext.name || ""}
              onChange={(e) => setLocalContext((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <Select
              value={localContext.businessType || ""}
              onValueChange={(value) => setLocalContext((prev) => ({ ...prev, businessType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={localContext.industry || ""}
              onValueChange={(value) => setLocalContext((prev) => ({ ...prev, industry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="communication-style">Communication Style</Label>
            <Select
              value={localContext.communicationStyle || ""}
              onValueChange={(value: "formal" | "casual" | "technical") =>
                setLocalContext((prev) => ({ ...prev, communicationStyle: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select communication style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal & Professional</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
                <SelectItem value="technical">Technical & Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Business Goals</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a business goal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addGoal()}
              />
              <Button onClick={addGoal} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localContext.goals?.map((goal) => (
                <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                  {goal}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeGoal(goal)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
