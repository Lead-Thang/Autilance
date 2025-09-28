"use client"

import { 
  ArrowRight, 
  Sparkles, 
  Store, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Zap, 
  Briefcase, 
  Star, 
  Rocket, 
  Brain, 
  DollarSign,
  Navigation
} from "lucide-react"
import { ComponentType } from "react"

type IconName = 
  | "ArrowRight"
  | "Sparkles"
  | "Store"
  | "MessageSquare"
  | "TrendingUp"
  | "Users"
  | "Zap"
  | "Briefcase"
  | "Star"
  | "Rocket"
  | "Brain"
  | "DollarSign"
  | "Navigation"

const iconComponents: Record<IconName, ComponentType<any>> = {
  ArrowRight,
  Sparkles,
  Store,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  Briefcase,
  Star,
  Rocket,
  Brain,
  DollarSign,
  Navigation
}

interface ClientIconProps {
  name: IconName
  className?: string
  ariaHidden?: boolean
}

export function ClientIcon({ name, className, ariaHidden = true }: ClientIconProps) {
  // Only render on the client
  if (typeof window === 'undefined') {
    return <div className={className} style={{ display: 'inline-flex' }} />
  }
  
  const IconComponent = iconComponents[name]
  
  if (!IconComponent) {
    return null
  }
  
  return <IconComponent className={className} aria-hidden={ariaHidden} />
}