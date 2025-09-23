"use client"

import { useState, useEffect } from 'react'
import { Folder, Forward, MoreHorizontal, Trash2, type LucideIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleOpenChange = (open: boolean) => {
    try {
      if (open) {
        const trigger = document.getElementById('nav-projects-trigger')
        if (!trigger || typeof trigger.getBoundingClientRect !== 'function') {
          console.error('Nav projects trigger element not found or not a DOM element')
          return false
        }
      }
      return true
    } catch (err) {
      console.error('Nav projects open change error:', err)
      return false
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className="transition-all duration-200 hover:bg-primary/10 hover:text-primary animate-lift"
            >
              <a href={item.url} className="flex items-center gap-2">
                <item.icon className="size-4 shrink-0" />
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction id="nav-projects-trigger" showOnHover className="hover:bg-primary/10 group-data-[collapsible=icon]:hidden">
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              {isClient && (
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  
                >
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-destructive/10 text-destructive">
                    <Trash2 className="text-destructive" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}