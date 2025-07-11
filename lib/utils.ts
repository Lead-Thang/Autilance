import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StoreData } from "./store-ai"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function getUserByEmail(email: string) {
  // Simulate a database lookup
  const users = [
    { id: "1", email: "user1@example.com" },
    { id: "2", email: "user2@example.com" },
    { id: "3", email: "user3@example.com" },
  ]
  return users.find(user => user.email === email) || null
}
export function generateSitemap(store: StoreData): string {
  const baseUrl = store.seo.canonicalUrl || `https://${store.domain}.autilance.com`
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${store.components
    .filter(c => ['hero', 'product-grid', 'about', 'contact'].includes(c.type))
    .map(c => `
  <url>
    <loc>${baseUrl}#${c.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${c.type === 'product-grid' ? '0.8' : '0.5'}</priority>
  </url>`).join('')}
</urlset>`
}
