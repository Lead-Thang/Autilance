"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { Button } from ".././components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from ".././components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    try {
      if (open) {
        const trigger = document.getElementById('theme-toggle-trigger')
        if (!trigger || typeof trigger.getBoundingClientRect !== 'function') {
          console.error('Theme toggle trigger element not found or not a DOM element')
          return
        }
      }
      setIsOpen(open)
    } catch (err) {
      console.error('Theme toggle open change error:', err)
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          id="theme-toggle-trigger"
          variant="outline" 
          size="icon" 
          className={`relative bg-transparent ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      {isClient && (
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
