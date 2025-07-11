"use client"

import type React from "react"
import { ThemeProvider } from "@/hooks/use-theme"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="Autilance-theme">
        <div className="min-h-screen bg-background text-foreground">{children}</div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}