"use client"

import { ChevronRight, type LucideIcon, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../components/ui/sidebar"

import { DollarSign, Store, Users, ShoppingCart, SquareTerminal, CheckSquare, Bot, Trophy } from "lucide-react"

export const navMain = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
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
    title: "Job Descriptions",
    url: "/dashboard/jd",
    icon: CheckSquare,
    items: [
      {
        title: "Browse JDs",
        url: "/dashboard/jd",
      },
      {
        title: "My JDs",
        url: "/dashboard/jd?tab=my-jds",
      },
      {
        title: "Verifications",
        url: "/dashboard/jd?tab=verifications",
      },
      {
        title: "Create JD",
        url: "/dashboard/jd?tab=create",
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
    title: "Make Money",
    url: "/dashboard/make-money",
    icon: DollarSign,
    items: [
      { title: "Investments", url: "/dashboard/investment" },
      { title: "Partnerships", url: "/dashboard/partnerships" },
      { title: "Selling & Buying", url: "/dashboard/marketplace" },
      { title: "Store Management", url: "/dashboard/storefront" },
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
  // ... other nav items
]

export function NavMain({
  items = navMain,
}: {
  items?: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || (pathname !== null && pathname.startsWith(item.url + "/"))

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <div className="flex items-center">
                  <SidebarMenuButton asChild tooltip={item.title} className="flex-1 justify-start">
                    <Link href={item.url} className={isActive ? "bg-sidebar-accent" : ""}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <div className="ml-auto pl-4">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-2">
                          <ChevronRight className="transition-transform duration-200 data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </div>
                  ) : null}
                </div>
                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} className={pathname === subItem.url ? "bg-sidebar-accent" : ""}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}