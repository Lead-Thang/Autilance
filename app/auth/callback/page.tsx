"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

   useEffect(() => {
     const handleAuth = async () => {
       // Check if we have a user session
       const { data: { user } } = await supabase.auth.getUser()

       if (user) {
         // Check if user has already completed their profile by checking users table
         const { data: userData } = await supabase
           .from('users')
           .select('display_name')
           .eq('id', user.id)
           .single()

         if (userData?.display_name) {
           router.push("/dashboard")
         } else {
           router.push("/auth/complete-profile")
         }
       } else {
         // If no user, redirect to signup
         router.push("/auth/signup")
       }
     }

     handleAuth()
   }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  )
}