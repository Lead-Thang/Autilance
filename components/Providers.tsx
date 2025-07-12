"use client"

import type React from "react"
import { ThemeProvider } from ".././hooks/use-theme"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}