"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme, storageKey }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Access localStorage only on client side
    const localTheme = localStorage.getItem(storageKey || 'theme');
    setTheme(localTheme || defaultTheme);
  }, []); // Empty dependency array ensures this effect runs only once after mount

  // Update localStorage when theme changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem(storageKey || '', theme);
    }
  }, [theme, storageKey]);

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      root.classList.add(systemTheme)
      return
    }

    if (theme) {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme: theme as Theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey || '', theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
