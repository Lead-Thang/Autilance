"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { toast } = useToast()

   useEffect(() => {
      const handleAuth = async () => {
        try {
          // Exchange authorization code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.search)
          if (exchangeError) throw exchangeError

          // Check if we have a user session
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError) throw userError

          if (user) {
             // Check if user has already completed their profile by checking users table
             const { data: userData, error: userDataError } = await supabase
               .from('users')
               .select('display_name')
               .eq('id', user.id)
               .maybeSingle() // Use maybeSingle() to handle case where user doesn't exist in users table
             if (userDataError) throw userDataError

             if (userData?.display_name) {
               router.push("/dashboard")
             } else {
               router.push("/auth/complete-profile")
             }
          } else {
            // If no user, redirect to signup
            router.push("/auth/signup")
          }
        } catch (error) {
          console.error("Auth callback error:", error)
          toast({
            title: "Authentication Error",
            description: "There was a problem setting up your account. Please try signing up again.",
            variant: "destructive",
          })
          router.push("/auth/signup")
        }
      }

      handleAuth()
    }, [router, supabase, toast])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}