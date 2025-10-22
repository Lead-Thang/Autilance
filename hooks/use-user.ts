"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Session } from '@supabase/supabase-js'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  joinDate: Date
  displayName?: string
  provider?: string
  bio?: string
  location?: string
  website?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Error fetching user:", error.message || error)
          setIsLoading(false)
          return
        }
        
        if (supabaseUser) {
          // Fetch additional user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, avatar, role, created_at, display_name, bio, location, website')
            .eq('id', supabaseUser.id)
            .single()
          
          if (userError) {
            console.error("Error fetching user data:", userError.message || userError)
          }
          
          setUser({
            id: supabaseUser.id,
            name: userData?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "User",
            email: supabaseUser.email || "",
            avatar: userData?.avatar || supabaseUser.user_metadata?.avatar_url || undefined,
            role: userData?.role || "Professional",
            joinDate: new Date(userData?.created_at || supabaseUser.created_at),
            displayName: userData?.display_name || supabaseUser.email?.split('@')[0],
            provider: supabaseUser.app_metadata?.provider || "email",
            bio: userData?.bio || undefined,
            location: userData?.location || undefined,
            website: userData?.website || undefined
          })
        }
      } catch (error: any) {
        console.error("Error loading user:", error.message || "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
          email: session.user.email || "",
          avatar: session.user.user_metadata?.avatar_url || undefined,
          role: "Professional",
          joinDate: new Date(session.user.created_at),
           displayName: session.user.email?.split('@')[0],
          provider: session.user.app_metadata?.provider || "email",
          bio: undefined,
          location: undefined,
          website: undefined
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    user,
    isLoading,
    setUser,
  }
}