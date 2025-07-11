import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autilance - AI-Powered Business Ecosystem",
  description:
    "Build online stores with AI, learn with purpose, find jobs with efficiency and work with a Goal!",
  keywords: ["AI", "business", "automation", "store builder", "artificial intelligence", "productivity"],
  authors: [{ name: "Autilance Team" }],
  creator: "Autilance",
  publisher: "Autilance",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autilance.com",
    title: "Autilance - AI-Powered Business Ecosystem",
    description: "Transform your business with AI-powered tools, store builders, and intelligent assistants.",
    siteName: "Autilance Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autilance - AI-Powered Business Ecosystem",
    description: "Transform your business with AI-powered tools, store builders, and intelligent assistants.",
    creator: "@autilance",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  generator: 'v0.dev'
}


import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/hooks/use-theme"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { Providers } from "@/components/Providers"

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
          <div className="min-h-screen bg-background text-foreground">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
