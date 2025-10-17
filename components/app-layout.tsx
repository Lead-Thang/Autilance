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
  Home,
  Star,
  Calendar,
  Shield,
  Wallet
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
  SidebarTrigger,
  useSidebar,
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
    // Jobs navigation with enhanced features
    {
      title: "Jobs",
      url: "/dashboard/jd",
      icon: Briefcase,
      items: [
        {
          title: "Browse Jobs",
          url: "/dashboard/jd",
        },
        {
          title: "Recommended",
          url: "/dashboard/jd/recommended",
        },
        {
          title: "My Applications",
          url: "/dashboard/jd/applications",
        },
        {
          title: "Saved Jobs",
          url: "/dashboard/jd/saved",
        },
      ],
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
      title: "Dropshipping",
      url: "/dashboard/dropshipping",
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
    {
      title: "Community",
      url: "/dashboard/community",
      icon: Users,
      items: [
        {
          title: "Forums",
          url: "/dashboard/community/forums",
        },
        {
          title: "Events",
          url: "/dashboard/community/events",
        },
        {
          title: "Networking",
          url: "/dashboard/community/networking",
        },
      ],
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: Star,
      items: [
        {
          title: "My Reviews",
          url: "/dashboard/reviews",
        },
        {
          title: "Give Review",
          url: "/dashboard/reviews/give",
        },
      ],
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: Wallet,
      items: [
        {
          title: "Escrow",
          url: "/dashboard/payments/escrow",
        },
        {
          title: "Transactions",
          url: "/dashboard/payments/transactions",
        },
        {
          title: "Earnings",
          url: "/dashboard/payments/earnings",
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

type Props = {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === "collapsed"
  
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
    <div className="flex min-h-screen flex-col">
      {/* Global Top Header (outer wrapper) */}
      <header
        className={`sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[height,padding] duration-300 ease-in-out ${
          isSidebarCollapsed ? 'h-12' : 'h-14'
        }`}
      >
        <div className={`flex items-center justify-between h-full w-full max-w-full px-4 ${isSidebarCollapsed ? 'gap-2' : 'gap-4'}`}>
          {/* Left: Sidebar Trigger and Brand */}
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="flex aspect-square bg-gradient-to-br from-blue-600 to-purple-700 size-8 items-center justify-center rounded-md text-primary-foreground">
                <img src="/logo.png" className="size-5" />
              </div>
              <div className={`text-sm leading-tight ${isSidebarCollapsed ? 'hidden sm:block' : 'block'}`}>
                <span className="truncate font-semibold">Autilance</span>
              </div>
            </a>
          </div>

          {/* Center: Placeholder for search or page switcher (optional) */}
          <div className="flex-1 px-2 hidden md:block">
            {/* Add search input or breadcrumbs here if needed */}
          </div>

          {/* Right: Theme toggle + user menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavUser user={user} />
          </div>
        </div>
      </header>

      {/* Page body with sidebar + content. Add top padding equal to header height */}
      <div className={`flex flex-1 w-full min-w-0 ${isSidebarCollapsed ? 'pt-0' : 'pt-0'}`}>
        <Sidebar collapsible="icon">
          {/* Keep sidebar minimal header or remove to avoid duplication */}
          <SidebarHeader className="border-b border-border/50 bg-background/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="/dashboard" className="flex items-center gap-2">
                    <div className="flex aspect-square bg-gradient-to-br from-blue-600 to-purple-700 size-10 items-center justify-center rounded-lg text-primary-foreground">
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
            <div className={`flex ${isSidebarCollapsed ? 'flex-col items-start' : 'items-center justify-between'} p-2 pl-0 gap-2`}>
              <NavUser user={user} />
              <SidebarTrigger />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className={`${isSidebarCollapsed ? 'p-4 ' : 'p-622'} transition-all duration-300 ease-in-out`}>
          {/* Main header section responsive to sidebar state (optional) */}
          <div className="flex items-center justify-between mb-8">
          </div>
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}