"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  joinDate: Date
  displayName?: string
  provider?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate user data loading
    const loadUser = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setUser({
          id: "1",
          name: "John Doe",
          email: "john@autilance.com",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Professional",
          joinDate: new Date("2024-01-15"),
          displayName: "johndoe",
          provider: "email"
        })
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  return {
    user,
    isLoading,
    setUser,
  }
}
