"use client"

import { useState, useEffect } from "react"

// Define types for analytics data
interface RevenueStats {
  totalRevenue: number
  revenueChange: number
  revenueChangeType: "increase" | "decrease"
}

interface LeadStats {
  totalLeads: number
  leadChange: number
  leadChangeType: "increase" | "decrease"
}

interface StoreViewStats {
  storeViews: number
  viewChange: number
  viewChangeType: "increase" | "decrease"
}

interface ConversionStats {
  conversionRate: number
  conversionChange: number
  conversionChangeType: "increase" | "decrease"
}

interface LeadSource {
  name: string
  percentage: number
}

interface LeadStatus {
  status: string
  count: number
  percentage: number
  color: string
}

interface LeadActivity {
  id: string
  email: string
  action: string
  status: string
  statusVariant: "default" | "secondary" | "destructive" | "outline"
}

interface StorePerformance {
  id: string
  name: string
  url: string
  revenue: number
  views: number
  iconColor: string
}

interface TrafficMetric {
  name: string
  value: number
  maxValue: number
}

interface TaskStats {
  activeTasks: number
  completedTasks: number
  completionRate: number
  avgResponseTime: string
}

interface TaskCategory {
  name: string
  count: number
}

interface AIMetric {
  messagesHandled: number
  satisfactionRate: number
  accuracy: number
  avgResponseTime: string
}

interface AIUsage {
  category: string
  percentage: number
}

export interface AnalyticsData {
  revenueStats: RevenueStats
  leadStats: LeadStats
  storeViewStats: StoreViewStats
  conversionStats: ConversionStats
  leadSources: LeadSource[]
  leadStatuses: LeadStatus[]
  leadActivities: LeadActivity[]
  storePerformances: StorePerformance[]
  trafficMetrics: TrafficMetric[]
  taskStats: TaskStats
  taskCategories: TaskCategory[]
  aiMetrics: AIMetric
  aiUsage: AIUsage[]
}

export function useAnalyticsData() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/analytics')
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        
        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics data")
        console.error("Error fetching analytics data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  return {
    analyticsData,
    isLoading,
    error
  }
}