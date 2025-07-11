interface MistralMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface MistralResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class MistralAI {
  private apiKey: string
  private baseUrl = "https://api.mistral.ai/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: MistralMessage[], model = "mistral-medium"): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`)
      }

      const data: MistralResponse = await response.json()
      return data.choices[0]?.message?.content || "No response generated"
    } catch (error) {
      console.error("Mistral AI Error:", error)
      throw new Error("Failed to get response from Mistral AI")
    }
  }

  async streamChat(
    messages: MistralMessage[],
    onChunk: (chunk: string) => void,
    model = "mistral-medium",
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`)
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
              const content = parsed.choices?.[0]?.delta?.content
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
      console.error("Mistral AI Streaming Error:", error)
      throw new Error("Failed to stream response from Mistral AI")
    }
  }
}

// Mistral AI integration for chat functionality
export class MistralClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(message: string): Promise<string> {
    try {
      // Simulate API call to Mistral
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return `I understand you're asking about "${message}". As your AI assistant powered by Mistral AI, I'm here to help you with learning, certifications, store building, and platform navigation. How can I assist you further?`
    } catch (error) {
      console.error("Mistral API error:", error)
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

export const mistralAI = new MistralAI("J4fNHsUdKGRyl2Wb57On9ipcWZ7ExV67")
export const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY || "")
