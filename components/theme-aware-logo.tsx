"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ThemeAwareLogoProps {
  width?: number
  height?: number
  className?: string
}

export function ThemeAwareLogo({ 
  width = 40, 
  height = 40, 
  className = "rounded-xl" 
}: ThemeAwareLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing on the server, or when not mounted
  if (!mounted) {
    return (
      <div 
        className={className} 
        style={{ width, height, backgroundColor: 'transparent' }} 
      />
    )
  }

  // Use resolvedTheme to get the actual theme being used (important for system theme)
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`${className} ${isDark ? 'dark' : ''}`} style={{ width, height }}>
      <Image 
        src="/logo.png" 
        alt="Autilance Logo" 
        width={width} 
        height={height} 
        className={isDark ? 'invert' : ''}
      />
    </div>
  )
}