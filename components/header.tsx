"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavUser } from "@/components/nav-user"
import { Search } from "@/components/search"
import { useSidebar } from "@/components/ui/sidebar"

export function Header({
  user,
  onUserUpdate
}: {
  user: {
    name: string
    email: string
    avatar: string
  },
  onUserUpdate: (user: { name: string; email: string; avatar: string }) => void
}) {
  const { state: sidebarState } = useSidebar()
  const isSidebarCollapsed = sidebarState === "collapsed"

  const onUserUpdateRef = React.useRef(onUserUpdate)

  // Keep ref updated with latest onUserUpdate
  React.useEffect(() => {
    onUserUpdateRef.current = onUserUpdate
  }, [onUserUpdate])

  React.useEffect(() => {
    const supabase = createClient()

    const fetchUser = async () => {
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Error fetching user:", error)
          return
        }

        if (supabaseUser) {
          onUserUpdateRef.current({
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
    <header
      className={`sticky top-0 z-40 w-full border-border/50 bg-background supports-[backdrop-filter]:bg-background transition-[height,padding] duration-300 ease-in-out ${
        isSidebarCollapsed ? 'h-12' : 'h-14'
      }`}
    >
      <div className={`flex items-center justify-between h-full w-full max-w-full px-4 ${isSidebarCollapsed ? 'gap-2' : 'gap-4'}`}>
        {/* Left: Sidebar Trigger and Brand */}
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="flex items-center gap-2">
            <div className="flex aspect-square bg-gradient-to-br from-blue-600 to-purple-700 size-8 items-center justify-center rounded-md text-primary-foreground">
              <img src="/logo.png" alt="Autilance logo" className="size-5" />
            </div>
            <div className={`text-sm leading-tight ${isSidebarCollapsed ? 'hidden sm:block' : 'block'}`}>
              <span className="truncate font-semibold">Autilance</span>
            </div>
          </a>
        </div>

        {/* Center: Placeholder for search or page switcher (optional) */}
        <div className="flex-1 flex justify-center items-center">
          <Search />
        </div>

        {/* Right: Theme toggle + user menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavUser user={user} />
        </div>
      </div>
    </header>
  )
}