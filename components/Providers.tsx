"use client"

import type React from "react"
import { ThemeProvider } from ".././hooks/use-theme"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
      {children}
    </ThemeProvider>
  )
}