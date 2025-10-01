"use client"

import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, Chrome } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleOpenChange = (open: boolean) => {
    try {
      if (open) {
        const trigger = document.getElementById('nav-user-trigger')
        if (!trigger || typeof trigger.getBoundingClientRect !== 'function') {
          console.error('Nav user trigger element not found or not a DOM element')
          return
        }
      }
      setIsOpen(open)
    } catch (err) {
      console.error('Nav user open change error:', err)
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) console.error('Google sign-in error:', error);
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) console.error('Sign out error:', signOutError);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              id="nav-user-trigger"
              size="lg"
              className="data-[state=open]:bg-primary/10 hover:bg-primary/10 transition-all duration-200 animate-lift"
            >
              <div className="flex items-left gap-2">
                <Avatar className="h-8 w-8 rounded-lg border-2 border-primary/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {isClient && (
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <Sparkles className="text-primary" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-primary/10" asChild>
                  <a href="/dashboard/profile">
                    <BadgeCheck />
                    Account
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10" asChild>
                  <a href="/dashboard/settings">
                    <CreditCard />
                    Billing
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10" asChild>
                  <a href="/dashboard/settings?tab=notifications">
                    <Bell />
                    Notifications
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleGoogleSignIn}
                className="hover:bg-primary/10 flex gap-2"
              >
                <Chrome className="text-blue-500" />
                Continue with Google
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="hover:bg-primary/10 flex gap-2 text-destructive"
              >
                <LogOut />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}