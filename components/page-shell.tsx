"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useSidebar } from "@/components/ui/sidebar"

type Props = {
  children: React.ReactNode
}

export function PageShell({ children }: Props) {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === "collapsed"

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 p-6">
        {/* Header Section - Responsive to Sidebar State */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2 transition-all duration-300 ease-in-out">
            <h1 className={`font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent ${
              isSidebarCollapsed ? 'text-2xl' : 'text-4xl'
            } transition-all duration-300 ease-in-out`}>
              Welcome back!
            </h1>
            <p className={`text-muted-foreground ${
              isSidebarCollapsed ? 'text-sm' : 'text-lg'
            } transition-all duration-300 ease-in-out`}>
              Here's what's happening with your learning journey
            </p>
          </div>
        </div>

        <div className="">{children}</div>
      </main>
    </div>
  )
}
