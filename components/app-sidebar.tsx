"use client"

import * as React from "react"
import type { ComponentProps } from "react"
import {
  Bot,
  Settings2,
  Briefcase,
  Store,
  Trophy,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  User,
  Sparkles,
  DollarSign,
  Home
} from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

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
      title: "Home",
      url: "/dashboard",
      icon: Home,
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
    // Jobs navigation item links directly to the job description (jd) page
    {
      title: "Jobs",
      url: "/dashboard/jd",
      icon: Briefcase
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: MessageSquare,
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
      title: "Make Money",
      url: "/dashboard/make-money",
      icon: DollarSign,
      items: [
        {
          title: "Investments",
          url: "/dashboard/investment",
        },
        {
          title: "Partnerships",
          url: "/dashboard/partnerships",
        },
        {
          title: "Store Management",
          url: "/dashboard/storefront",
        },
      ],
    },
    {
      title: "Marketplace",
      url: "/dashboard/marketplace",
      icon: Store,
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
      url: "/dashboard/storefront",
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

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "Autilance User",
    email: "user@autilance.com",
    avatar: "/avatars/shadcn.jpg",
  })
  const supabase = createClient()

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Error fetching user:", error)
          return
        }
        
        if (supabaseUser) {
          setUser({
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "User",
            email: supabaseUser.email || "",
            avatar: supabaseUser.user_metadata?.avatar_url || "/avatars/shadcn.jpg",
          })
        }
      } catch (error) {
        console.error("Error loading user:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="border-b border-border/50 bg-background/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <img src="/logo.png" className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
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
          <NavUser user={user} />
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}