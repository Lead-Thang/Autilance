"use client"

import type * as React from "react"
import {
  Bot,
  Settings2,
  SquareTerminal,
  Store,
  Trophy,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  User,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Autilance User",
    email: "user@autilance.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Autilance Platform",
      logo: Sparkles,
      plan: "Enterprise",
    },
    {
      name: "Business Growth",
      logo: BarChart3,
      plan: "Startup",
    },
    {
      name: "AI Solutions",
      logo: Bot,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Feed",
          url: "/dashboard/feed",
        },
      ],
    },
    {
      title: "AI Assistant",
      url: "/dashboard/assistant",
      icon: Bot,
      items: [
        {
          title: "Chat",
          url: "/dashboard/assistant",
        },
        {
          title: "History",
          url: "/dashboard/assistant/history",
        },
        {
          title: "Settings",
          url: "/dashboard/assistant/settings",
        },
      ],
    },
    {
      title: "Store Builder",
      url: "/dashboard/storefront",
      icon: Store,
      items: [
        {
          title: "My Stores",
          url: "/dashboard/storefront",
        },
        {
          title: "Templates",
          url: "/dashboard/storefront/templates",
        },
        {
          title: "Analytics",
          url: "/dashboard/storefront/analytics",
        },
      ],
    },
    {
      title: "Certifications",
      url: "/dashboard/certifications",
      icon: Trophy,
      items: [
        {
          title: "My Certificates",
          url: "/dashboard/certifications",
        },
        {
          title: "Available Programs",
          url: "/dashboard/certifications/programs",
        },
        {
          title: "Create Program",
          url: "/dashboard/certifications/create",
        },
      ],
    },
    {
      title: "Tasks & Projects",
      url: "/dashboard/tasks",
      icon: CheckSquare,
      items: [
        {
          title: "My Tasks",
          url: "/dashboard/tasks",
        },
        {
          title: "Projects",
          url: "/dashboard/tasks/projects",
        },
        {
          title: "Team Tasks",
          url: "/dashboard/tasks/team",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Support",
      url: "#",
      icon: MessageSquare,
    },
  ],
  projects: [
    {
      name: "E-commerce Store",
      url: "#",
      icon: Store,
    },
    {
      name: "Marketing Campaign",
      url: "#",
      icon: BarChart3,
    },
    {
      name: "Team Collaboration",
      url: "#",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <div className="app-sidebar">
      <img src="logo.png" alt="Gopod Logo" className="logo" />
      <SidebarHeader className="border-b border-border/50 bg-background/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Autilance</span>
                  <span className="truncate text-xs text-muted-foreground">Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-background/30">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-background/50">
        <div className="flex items-center justify-between p-2">
          <NavUser user={data.user} />
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </div>
  )
}
