"use client"

import type React from "react"
import { useTheme } from "next-themes"
import Image, { ImageProps } from "next/image"

interface ThemeAwareLogoProps extends Omit<ImageProps, 'src'> {
  width?: number
  height?: number
}

export const ThemeAwareLogo: React.FC<ThemeAwareLogoProps> = ({ 
  width = 40, 
  height = 40,
  alt = "Autilance Logo",
  className = "",
  ...props 
}) => {
  const { theme } = useTheme()
  
  // 使用实际的 logo.png 图片
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={width}
      height={height}
      className={`rounded-xl ${className}`}
      {...props}
    />
  )
}