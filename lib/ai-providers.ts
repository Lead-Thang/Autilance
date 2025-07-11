export interface AIProvider {
  id: string
  name: string
  description: string
  personality: string
  icon: string
  color: string
  capabilities: string[]
}

export const aiProviders: AIProvider[] = [
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Professional business guidance with structured insights",
    personality:
      "Professional, analytical, and detail-oriented. Provides structured business advice with actionable recommendations.",
    icon: "🧠",
    color: "from-blue-500 to-indigo-600",
    capabilities: ["Business Strategy", "Market Analysis", "Financial Planning", "Operations Optimization"],
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    description: "Witty and engaging responses with creative problem-solving",
    personality:
      "Witty, creative, and engaging. Brings humor and fresh perspectives to business challenges while maintaining professionalism.",
    icon: "⚡",
    color: "from-purple-500 to-pink-600",
    capabilities: ["Creative Solutions", "Innovation Strategy", "Brand Development", "Marketing Ideas"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Advanced analytical responses with comprehensive breakdowns",
    personality:
      "Thorough, analytical, and comprehensive. Provides detailed breakdowns and multi-faceted analysis of complex business scenarios.",
    icon: "💎",
    color: "from-emerald-500 to-teal-600",
    capabilities: ["Data Analysis", "Research", "Technical Solutions", "Comprehensive Planning"],
  },
]

export function getProviderById(id: string): AIProvider | undefined {
  return aiProviders.find((provider) => provider.id === id)
}

export async function generateAIResponse(
  message: string,
  providerId: string,
  context?: any,
  history?: any[],
): Promise<string> {
  const provider = getProviderById(providerId)
  if (!provider) {
    throw new Error("Provider not found")
  }

  // Simulate AI response based on provider personality
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const responses = {
    mistral: [
      `Based on my analysis, here's a structured approach to your query: ${message}. I recommend focusing on three key areas: market positioning, operational efficiency, and customer acquisition strategies.`,
      `From a business perspective, your question about "${message}" requires a multi-faceted approach. Let me break this down into actionable insights and strategic recommendations.`,
      `Analyzing your request regarding "${message}", I see several opportunities for optimization. Here's my professional assessment with concrete next steps.`,
    ],
    grok: [
      `Ah, interesting question about "${message}"! 🚀 Let me put on my creative thinking cap and give you some fresh perspectives that might just spark your next breakthrough.`,
      `Well, well, well... "${message}" - now that's a juicy challenge! 😄 Let me cook up some innovative solutions that'll make your competitors wonder what you're up to.`,
      `Ooh, I love a good brain teaser like "${message}"! 🎯 Time to think outside the box and serve up some creative solutions with a side of strategic brilliance.`,
    ],
    gemini: [
      `Your inquiry about "${message}" presents multiple analytical dimensions worth exploring. Let me provide a comprehensive breakdown of the key factors, potential outcomes, and strategic considerations.`,
      `Examining "${message}" through various analytical lenses, I can identify several critical components that require detailed evaluation. Here's my thorough assessment.`,
      `The complexity of "${message}" warrants a multi-layered analysis. I'll walk you through the comprehensive evaluation, including risk factors, opportunities, and implementation strategies.`,
    ],
  }

  const providerResponses = responses[providerId as keyof typeof responses] || responses.mistral
  const randomResponse = providerResponses[Math.floor(Math.random() * providerResponses.length)]

  return randomResponse
}
