import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "../components/ui/toaster"
import { Providers } from "../components/Providers"
import { FloatingAIChat } from "../components/floating-ai-chat"
import { metadata, viewport } from "./metadata"
import { Analytics } from "@vercel/analytics/react"

export { metadata, viewport }

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            {children}
            <FloatingAIChat />
          </div>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}