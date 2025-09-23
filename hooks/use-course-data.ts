"use client"

import { useState, useEffect } from "react"

// Define types based on our schema
interface Course {
  id: string
  title: string
  description?: string
  progress: number // 0-100
  completedAt?: Date
  startedAt: Date
}

interface UserStats {
  coursesCompleted: number
  certificationsEarned: number
  networkConnections: number
  learningHours: number
}

interface RecentActivity {
  id: string
  title: string
  description: string
  time: string
  type: "completion" | "connection" | "start"
}

export function useCourseData() {
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<UserStats>({
    coursesCompleted: 0,
    certificationsEarned: 0,
    networkConnections: 0,
    learningHours: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('/api/user/courses')
        
        if (!response.ok) {
          throw new Error('Failed to fetch course data')
        }
        
        const data = await response.json()
        
        setCourses(data.courses)
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course data")
        console.error("Error fetching course data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCourseData()
  }, [])
  
  return {
    courses,
    stats,
    recentActivity,
    isLoading,
    error
  }
}