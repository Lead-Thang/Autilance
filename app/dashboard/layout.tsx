"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppLayout } from "@/components/app-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </SidebarProvider>
  )
}