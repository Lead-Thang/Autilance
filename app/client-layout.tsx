"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "../components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { ErrorLogger } from "@/components/error-logger"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
        <ErrorLogger />
        <div className="min-h-screen bg-background text-foreground">{children}</div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}