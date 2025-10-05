"use client"

import type React from "react"
import { ThemeProvider } from "./theme-provider"
import { ErrorLogger } from "./error-logger"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
      <ErrorLogger />
      {children}
    </ThemeProvider>
  )
}