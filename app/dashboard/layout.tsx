"use client"

import type React from "react"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-4">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
