interface GeminiMessage {
  role: "user" | "model"
  parts: Array<{
    text: string
  }>
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class GeminiAI {
  private apiKey: string
  private baseUrl: string
  private isOpenRouter: boolean

  constructor(apiKey: string, isOpenRouter: boolean = false) {
    this.apiKey = apiKey
    this.isOpenRouter = isOpenRouter
    this.baseUrl = isOpenRouter 
      ? "https://openrouter.ai/api/v1" 
      : "https://generativelanguage.googleapis.com/v1beta"
  }

  async chat(messages: GeminiMessage[], model = "gemini-pro"): Promise<string> {
    try {
      if (this.isOpenRouter) {
        // Use OpenRouter format
        const openRouterMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.parts.map(part => part.text).join('\n')
        }))

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://autilance.com", // Optional, for OpenRouter stats
            "X-Title": "Autilance" // Optional, for OpenRouter stats
          },
          body: JSON.stringify({
            model: `google/${model}`, // OpenRouter requires full model name
            messages: openRouterMessages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
        }

        const data: OpenRouterResponse = await response.json()
        return data.choices?.[0]?.message?.content || "No response generated"
      } else {
        // Use Google's native Gemini API
        const contents = messages.map(msg => ({
          role: msg.role,
          parts: msg.parts
        }))

        const response = await fetch(
          `${this.baseUrl}/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": this.apiKey,
            },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              }
            }),
          }
        )

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const data: any = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"
      }
    } catch (error) {
      console.error("Gemini AI Error:", error)
      throw new Error("Failed to get response from Gemini AI")
    }
  }

  async streamChat(
    messages: GeminiMessage[],
    onChunk: (chunk: string) => void,
    model = "gemini-pro",
  ): Promise<void> {
    try {
      // Convert messages to Gemini format
      const contents = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }))

      const response = await fetch(
        `${this.baseUrl}/models/${model}:streamGenerateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") return

            try {
              const parsed = JSON.parse(data)
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (content) {
                onChunk(content)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Gemini AI Streaming Error:", error)
      throw new Error("Failed to stream response from Gemini AI")
    }
  }
}

// Gemini AI integration for chat functionality
export class GeminiClient {
  private apiKey: string
  private isOpenRouter: boolean

  constructor(apiKey: string, isOpenRouter: boolean = false) {
    this.apiKey = apiKey
    this.isOpenRouter = isOpenRouter
  }

  async generateResponse(message: string): Promise<string> {
    try {
      // Simulate API call to Gemini
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return `I understand you're asking about "${message}". As your AI assistant powered by Google Gemini, I'm here to help you with learning, certifications, store building, and platform navigation. How can I assist you further?`
    } catch (error) {
      console.error("Gemini API error:", error)
      throw new Error("Failed to generate response")
    }
  }

  async streamResponse(message: string, onChunk: (chunk: string) => void): Promise<void> {
    const response = await this.generateResponse(message)
    const words = response.split(" ")

    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      onChunk(words.slice(0, i + 1).join(" "))
    }
  }
}

// Export instance for direct use
let geminiAI: GeminiAI | null = null;
let geminiClient: GeminiClient | null = null;

if (typeof process !== 'undefined' && (process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY)) {
  // Check if we're using OpenRouter based on environment variable or key format
  const isOpenRouter = process.env.OPENROUTER_API_KEY !== undefined;
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error('API key is required but was not provided');
  }

  geminiAI = new GeminiAI(apiKey, isOpenRouter);
  geminiClient = new GeminiClient(apiKey, isOpenRouter);
}

export { geminiAI, geminiClient };