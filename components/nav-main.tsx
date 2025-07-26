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

import { DollarSign, Store, Users, ShoppingCart } from "lucide-react"

export const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Store,
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
