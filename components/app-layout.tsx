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

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Header } from "@/components/header"
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
import { Search } from "@/components/search"

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
      title: "Earn",
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

  return (
    <div className="flex flex-col w-full max-h-screen">
      <Header user={user} onUserUpdate={setUser} />

      {/* Page body with sidebar + content. Add top padding equal to header height */}
      <div className="flex flex-1 w-full min-w-0">
        <Sidebar collapsible="icon">
          <SidebarContent className="bg-background/30">
            <NavMain items={data.navMain} className="mt-12" />
            <NavProjects projects={data.projects}  />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50 bg-background/50">
            <div className={`flex ${isSidebarCollapsed ? 'flex-col items-center' : 'items-center justify-evenly'} p-2 pl-0 gap-2`}>
              <NavUser user={user} />
              <SidebarTrigger />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className={`transition-all duration-300 ease-in-out flex-1 overflow-auto ${isSidebarCollapsed ? 'p-4' : 'p-6'}`}>
          {/* Main header section responsive to sidebar state (optional) */}
          <div className="flex items-center justify-between mb-8">
          </div>
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}