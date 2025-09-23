"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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
  title?: string
  skills?: string[]
  location?: string
  website?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Error fetching user:", error)
          return
        }
        
        if (supabaseUser) {
          // Fetch additional user data from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, avatar, role, created_at, display_name, website')
            .eq('id', supabaseUser.id)
            .single()
          
          if (userError) {
            console.error("Error fetching user data:", userError)
          }
          
          setUser({
            id: supabaseUser.id,
            name: userData?.name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "User",
            email: supabaseUser.email || "",
            avatar: userData?.avatar || supabaseUser.user_metadata?.avatar_url || undefined,
            role: userData?.role || "Professional",
            joinDate: new Date(userData?.created_at || supabaseUser.created_at),
            displayName: userData?.display_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
            provider: supabaseUser.app_metadata?.provider || "email",
            website: userData?.website || undefined
          })
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
    
    // Set up auth state listener
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Fetch additional user data from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, avatar, role, created_at, display_name, website')
          .eq('id', session.user.id)
          .single()
        
        if (userError) {
          console.error("Error fetching user data:", userError)
        }
        
        setUser({
          id: session.user.id,
          name: userData?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
          email: session.user.email || "",
          avatar: userData?.avatar || session.user.user_metadata?.avatar_url || undefined,
          role: userData?.role || "Professional",
          joinDate: new Date(userData?.created_at || session.user.created_at),
          displayName: userData?.display_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          provider: session.user.app_metadata?.provider || "email",
          website: userData?.website || undefined
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    isLoading,
    setUser,
  }
}
