"use client"

import type React from "react"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
      {children}
    </ThemeProvider>
  )
}