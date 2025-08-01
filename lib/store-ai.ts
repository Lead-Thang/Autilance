import { mistralAI } from "../lib/mistral"

export interface StoreComponent {
  id: string
  type: "hero" | "product-grid" | "about" | "testimonials" | "contact" | "footer" | "header" | "text"
  content: any
  styles: any
  position: number
}

export interface StoreData {
  id: string
  name: string
  domain: string
  components: StoreComponent[]
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    layout: "modern" | "classic" | "minimal"
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    customDomain?: string
    freeDomain?: string
    canonicalUrl?: string
    metaTags?: Record<string, string>
    structuredData?: string
    robots?: string
    gaId?: string
  }
}

interface TextContent {
  text: string
  heading: string
  alignment: string
  listType?: 'none' | 'bulleted' | 'numbered'
}

interface TextStyles {
  padding: string
  backgroundColor: string
  textColor: string
  fontSize: string
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  lineHeight?: string
  letterSpacing?: string
  // Responsive sizing
  mobileFontSize?: string
  tabletFontSize?: string
}

export class StoreAI {
  private systemPrompt =
    `You are an AI store builder assistant for Autilance, similar to v0 but specialized in creating online stores. You understand:

1. E-commerce best practices and conversion optimization
2. Modern web design principles and UX patterns
3. Product presentation and marketing strategies
4. Store layout and navigation structures
5. Brand voice and visual identity

You help users create professional online stores by:
- Generating store layouts and components
- Suggesting product descriptions and marketing copy
- Optimizing for conversions and user experience
- Providing design recommendations
- Creating cohesive brand experiences

Always respond with actionable, specific suggestions that can be implemented in a store builder interface.`

  async generateStoreLayout(prompt: string): Promise<StoreData> {
    try {
      const response = await mistralAI.chat([
        { role: "system", content: this.systemPrompt },
        {
          role: "user",
          content: `Generate a complete store layout for: ${prompt}. Return a JSON structure with store name, components (hero, product-grid, about, testimonials, contact, footer), theme colors, and SEO data.`,
        },
      ])

      // Parse AI response and create store structure
      const storeId = Date.now().toString()
      return this.parseAIResponse(response, storeId, prompt)
    } catch (error) {
      console.error("Store AI Error:", error)
      return this.getFallbackStore(prompt)
    }
  }

  async optimizeComponent(component: StoreComponent, instruction: string): Promise<StoreComponent> {
    try {
      const response = await mistralAI.chat([
        { role: "system", content: this.systemPrompt },
        {
          role: "user",
          content: `Optimize this store component: ${JSON.stringify(component)}. Instruction: ${instruction}. Return the improved component as JSON.`,
        },
      ])

      return this.parseComponentResponse(response, component)
    } catch (error) {
      console.error("Component optimization error:", error)
      return component
    }
  }

  async generateProductDescription(productName: string, category: string, features: string[]): Promise<string> {
    try {
      const response = await mistralAI.chat([
        { role: "system", content: this.systemPrompt },
        {
          role: "user",
          content: `Write a compelling product description for "${productName}" in the ${category} category. Features: ${features.join(", ")}. Make it conversion-focused and engaging.`,
        },
      ])

      return response
    } catch (error) {
      console.error("Product description error:", error)
      return `High-quality ${productName} with premium features including ${features.join(", ")}.`
    }
  }

  private parseAIResponse(response: string, storeId: string, prompt: string): StoreData {
    try {
      // Try to extract JSON from AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          id: storeId,
          name: parsed.name || this.extractStoreName(prompt),
          domain: `${parsed.name?.toLowerCase().replace(/\s+/g, "-") || "store"}.Autilance.com`,
          components: this.generateDefaultComponents(parsed),
          theme: parsed.theme || this.getDefaultTheme(),
          seo: parsed.seo || this.getDefaultSEO(prompt),
        }
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error)
    }

    return this.getFallbackStore(prompt)
  }

  private parseComponentResponse(response: string, originalComponent: StoreComponent): StoreComponent {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return { ...originalComponent, ...parsed }
      }
    } catch (error) {
      console.error("Failed to parse component response:", error)
    }

    return originalComponent
  }

  private generateDefaultComponents(aiData: any): StoreComponent[] {
    return [
      {
        id: "1",
        type: "header",
        content: {
          logo: aiData.name || "Store",
          navigation: ["Home", "Products", "About", "Contact"],
        },
        styles: { backgroundColor: "#ffffff", textColor: "#000000" },
        position: 0,
      },
      {
        id: "2",
        type: "hero",
        content: {
          title: aiData.hero?.title || "Welcome to Our Store",
          subtitle: aiData.hero?.subtitle || "Discover amazing products",
          ctaText: "Shop Now",
          backgroundImage: "/placeholder.svg?height=600&width=1200",
        },
        styles: { textAlign: "center", padding: "80px 20px" },
        position: 1,
      },
      {
        id: "3",
        type: "product-grid",
        content: {
          title: "Featured Products",
          products: aiData.products || this.getDefaultProducts(),
        },
        styles: { columns: 3, gap: "20px" },
        position: 2,
      },
      {
        id: "4",
        type: "about",
        content: {
          title: "About Us",
          description: aiData.about || "We are passionate about providing quality products to our customers.",
        },
        styles: { padding: "60px 20px" },
        position: 3,
      },
      {
        id: "5",
        type: "footer",
        content: {
          copyright: `© 2024 ${aiData.name || "Store"}. All rights reserved.`,
          links: ["Privacy Policy", "Terms of Service", "Contact"],
        },
        styles: { backgroundColor: "#f8f9fa", padding: "40px 20px" },
        position: 4,
      },
    ]
  }

  private getDefaultContent(type: StoreComponent["type"]) {
    switch (type) {
      case "text":
        return {
          text: "Double click to edit text...",
          heading: "Section Title",
          alignment: "left",
        }
      default:
        return {}
    }
  }

  private getDefaultStyles(type: StoreComponent["type"]) {
    switch (type) {
      case "text":
        return { 
          padding: "40px 20px", 
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontSize: "16px"
        }
      default:
        return {}
    }
  }

  private getDefaultProducts() {
    return [
      {
        id: "1",
        name: "Premium Product",
        price: "$99.99",
        image: "/placeholder.svg?height=300&width=300",
        description: "High-quality product with amazing features",
      },
      {
        id: "2",
        name: "Best Seller",
        price: "$79.99",
        image: "/placeholder.svg?height=300&width=300",
        description: "Our most popular item",
      },
      {
        id: "3",
        name: "New Arrival",
        price: "$129.99",
        image: "/placeholder.svg?height=300&width=300",
        description: "Latest addition to our collection",
      },
    ]
  }

  private getDefaultTheme() {
    return {
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      fontFamily: "Inter",
      layout: "modern" as const,
    }
  }

  private getDefaultSEO(prompt: string) {
    return {
      title: `${this.extractStoreName(prompt)} - Online Store`,
      description: `Shop the best products at ${this.extractStoreName(prompt)}`,
      keywords: ["online store", "shopping", "products", "ecommerce"],
      canonicalUrl: `https://${this.extractStoreName(prompt).toLowerCase().replace(/\s+/g, "-")}.autilance.com`,
      robots: "index, follow",
      gaId: "",
      freeDomain: `https://${this.extractStoreName(prompt).toLowerCase().replace(/\s+/g, "-")}.free.autilance.com`
    }
  }

  private extractStoreName(prompt: string): string {
    const words = prompt.split(" ")
    return (
      words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") + " Store"
    )
  }

  private getFallbackStore(prompt: string): StoreData {
    const storeName = this.extractStoreName(prompt)
    return {
      id: Date.now().toString(),
      name: storeName,
      domain: `${storeName.toLowerCase().replace(/\s+/g, "-")}.autilance.com`,
      components: this.generateDefaultComponents({ name: storeName }),
      theme: this.getDefaultTheme(),
      seo: this.getDefaultSEO(prompt),
    }
  }
}

export const storeAI = new StoreAI()
