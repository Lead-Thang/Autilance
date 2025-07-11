import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autilance Platform - AI-Powered Business Solutions",
  description:
    "Transform your business with AI-powered tools, store builders, and intelligent assistants. Create, optimize, and scale with cutting-edge artificial intelligence.",
  keywords: ["AI", "business", "automation", "store builder", "artificial intelligence", "productivity"],
  authors: [{ name: "Autilance Team" }],
  creator: "Autilance",
  publisher: "Autilance",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autilance.com",
    title: "Autilance Platform - AI-Powered Business Solutions",
    description: "Transform your business with AI-powered tools, store builders, and intelligent assistants.",
    siteName: "Autilance Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autilance Platform - AI-Powered Business Solutions",
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