import { NextRequest } from 'next/server'
import { GeminiAI } from '../../../lib/gemini'

export async function POST(request: NextRequest) {
  try {
    // Check if we have an API key configured
    const geminiApiKey = process.env.GEMINI_API_KEY
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    
    let apiKey = ''
    let isOpenRouter = false
    
    if (openRouterApiKey) {
      apiKey = openRouterApiKey
      isOpenRouter = true
    } else if (geminiApiKey) {
      apiKey = geminiApiKey
      isOpenRouter = false
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'No API key configured. Please set either GEMINI_API_KEY or OPENROUTER_API_KEY in your environment variables.' 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return new Response(
        JSON.stringify({ 
          error: 'Message is required' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Gemini AI client
    const gemini = new GeminiAI(apiKey, isOpenRouter)
    
    // Prepare messages in the correct format
    const messages: Array<{
      role: "user" | "model"
      parts: Array<{ text: string }>
    }> = [
      {
        role: "user",
        parts: [
          {
            text: message
          }
        ]
      }
    ]

    // Add history if provided (simplified to avoid type issues)
    if (history && Array.isArray(history)) {
      // Currently only include user messages from history to avoid complex role mapping
      const historyMessages = history
        .filter(msg => msg.role === "user")
        .map(msg => ({
          role: "user" as const,
          parts: [
            {
              text: msg.content
            }
          ]
        }))

      messages.unshift(...historyMessages)
    }

    // Get response from Gemini/OpenRouter
    const response = await gemini.chat(messages)
    
    return new Response(
      JSON.stringify({ 
        response 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process request'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const runtime = 'edge'