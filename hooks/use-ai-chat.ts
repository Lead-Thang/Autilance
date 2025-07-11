"use client"

import { useState, useCallback, useEffect } from "react"
import { generateAIResponse } from "@/lib/ai-providers"

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  providerId?: string
}

export interface UserContext {
  name?: string
  businessType?: string
  goals?: string[]
  communicationStyle?: "formal" | "casual" | "technical"
  industry?: string
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentProvider, setCurrentProvider] = useState("mistral")
  const [userContext, setUserContext] = useState<UserContext>({})

  // Load persisted data on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai-chat-messages")
    const savedContext = localStorage.getItem("ai-chat-context")
    const savedProvider = localStorage.getItem("ai-chat-provider")

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
      } catch (error) {
        console.error("Failed to load chat messages:", error)
      }
    }

    if (savedContext) {
      try {
        setUserContext(JSON.parse(savedContext))
      } catch (error) {
        console.error("Failed to load user context:", error)
      }
    }

    if (savedProvider) {
      setCurrentProvider(savedProvider)
    }
  }, [])

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai-chat-messages", JSON.stringify(messages.slice(-50))) // Keep last 50 messages
    }
  }, [messages])

  // Persist context
  useEffect(() => {
    localStorage.setItem("ai-chat-context", JSON.stringify(userContext))
  }, [userContext])

  // Persist provider
  useEffect(() => {
    localStorage.setItem("ai-chat-provider", currentProvider)
  }, [currentProvider])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        role: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await generateAIResponse(
          content,
          currentProvider,
          userContext,
          messages.slice(-10), // Last 10 messages for context
        )

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
          providerId: currentProvider,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("Failed to generate AI response:", error)
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          providerId: currentProvider,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, currentProvider, userContext, isLoading],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    localStorage.removeItem("ai-chat-messages")
  }, [])

  const switchProvider = useCallback((providerId: string) => {
    setCurrentProvider(providerId)
  }, [])

  const updateUserContext = useCallback((updates: Partial<UserContext>) => {
    setUserContext((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    messages,
    isLoading,
    currentProvider,
    userContext,
    sendMessage,
    clearChat,
    switchProvider,
    updateUserContext,
  }
}
