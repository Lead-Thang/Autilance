"use client"

import type React from "react"
import { ThemeProvider } from "./theme-provider"
import { createClient } from "@/lib/supabase/client"

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
      {children}
    </ThemeProvider>
  )
}