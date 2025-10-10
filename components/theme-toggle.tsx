"use client";

import React from "react"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => setTheme(theme === "dark" ? "light" : "dark")

  // Avoid rendering theme-dependent attributes before hydration to prevent
  // mismatches. Use a neutral title until mounted.
  const title = mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-background border-border hover:bg-muted transition-colors"
      onClick={handleClick}
      title={title}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}