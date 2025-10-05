import type { Metadata, Viewport } from "next"

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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}