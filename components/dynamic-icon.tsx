"use client"

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

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

// Create a map of dynamically imported icons
const DynamicIcons: Record<IconName, ComponentType<any>> = {
  ArrowRight: dynamic(() => import('lucide-react').then((mod) => mod.ArrowRight), { ssr: false }),
  Sparkles: dynamic(() => import('lucide-react').then((mod) => mod.Sparkles), { ssr: false }),
  Store: dynamic(() => import('lucide-react').then((mod) => mod.Store), { ssr: false }),
  MessageSquare: dynamic(() => import('lucide-react').then((mod) => mod.MessageSquare), { ssr: false }),
  TrendingUp: dynamic(() => import('lucide-react').then((mod) => mod.TrendingUp), { ssr: false }),
  Users: dynamic(() => import('lucide-react').then((mod) => mod.Users), { ssr: false }),
  Zap: dynamic(() => import('lucide-react').then((mod) => mod.Zap), { ssr: false }),
  Briefcase: dynamic(() => import('lucide-react').then((mod) => mod.Briefcase), { ssr: false }),
  Star: dynamic(() => import('lucide-react').then((mod) => mod.Star), { ssr: false }),
  Rocket: dynamic(() => import('lucide-react').then((mod) => mod.Rocket), { ssr: false }),
  Brain: dynamic(() => import('lucide-react').then((mod) => mod.Brain), { ssr: false }),
  DollarSign: dynamic(() => import('lucide-react').then((mod) => mod.DollarSign), { ssr: false }),
  Navigation: dynamic(() => import('lucide-react').then((mod) => mod.Navigation), { ssr: false }),
}

interface DynamicIconProps {
  name: IconName
  className?: string
  ariaHidden?: boolean
}

export function DynamicIcon({ name, className, ariaHidden = true }: DynamicIconProps) {
  const IconComponent = DynamicIcons[name]
  
  if (!IconComponent) {
    return <div className={className} style={{ display: 'inline-flex' }} />
  }
  
  return <IconComponent className={className} aria-hidden={ariaHidden} />
}