"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
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
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || (pathname !== null && pathname.startsWith(item.url + "/"))

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={`transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                      isActive ? "bg-primary/15 text-primary border-r-2 border-primary" : ""
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2 animate-lift">
                      {item.icon && <item.icon className="size-4" />}
                      <span className="font-medium">{item.title}</span>
                      {item.items && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="transition-all duration-200 hover:bg-primary/5 hover:text-primary"
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}