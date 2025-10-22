"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, AtSign } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function CompleteProfilePage() {
  const [displayName, setDisplayName] = useState("")
  const [userHandle, setUserHandle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      setIsCheckingAuth(true)
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          console.error("Auth error:", authError)
          router.push("/auth/signup")
          return
        }

        if (!user) {
          router.push("/auth/signup")
          return
        }

        // Check if user has already completed their profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('display_name')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.error("User query error:", userError)
          // If there's an error checking profile, allow them to complete it
          return
        }

        if (userData?.display_name) {
          // If user already has a display name, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Unexpected error during auth check:", err)
        router.push("/auth/signup")
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError("Authentication error. Please try signing in again.")
        setIsLoading(false)
        return
      }

      // Update the users table with profile information
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          handle: userHandle ? `@${userHandle.replaceAll('@', '')}` : null
        })
        .eq('id', user.id)

      if (error) {
        setError(error.message || "Failed to update profile. Please try again.")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Profile completion error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Checking authentication...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Image src="/logo.png" alt="Autilance Logo" width={40} height={40} className="rounded-xl" />
            <span className="text-2xl font-bold text-gradient-primary">Autilance</span>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Let's get to know you better</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userHandle">Handle</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userHandle"
                  placeholder="@yourhandle"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            You can update this information later in your profile settings
          </div>
        </CardContent>
      </Card>
    </div>
  )
}