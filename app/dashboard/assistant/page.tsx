"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { UserContextSetup } from "@/components/user-context-setup"
import { useAIChat } from "@/hooks/use-ai-chat"
import { getProviderById } from "@/lib/ai-providers"
import { Send, Trash2, MessageSquare, Sparkles, User, Lightbulb, TrendingUp, Target, Zap } from "lucide-react"

const quickPrompts = [
  {
    icon: Lightbulb,
    title: "Business Strategy",
    prompt: "Help me develop a comprehensive business strategy for my startup",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    prompt: "Analyze current market trends in my industry and identify opportunities",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Target,
    title: "Marketing Plan",
    prompt: "Create a detailed marketing plan to reach my target audience",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Productivity Tips",
    prompt: "Give me actionable tips to improve my business productivity",
    color: "from-purple-500 to-pink-500",
  },
]

export default function AssistantPage() {
  const {
    messages,
    isLoading,
    currentProvider,
    userContext,
    sendMessage,
    clearChat,
    switchProvider,
    updateUserContext,
  } = useAIChat()

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    await sendMessage(input)
    setInput("")
    inputRef.current?.focus()
  }

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt)
    inputRef.current?.focus()
  }

  const provider = getProviderById(currentProvider)

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">
                  {userContext.name ? `Welcome back, ${userContext.name}` : "Your intelligent business companion"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserContextSetup context={userContext} onContextUpdate={updateUserContext} />
            <AIProviderSelector currentProvider={currentProvider} onProviderChange={switchProvider} />
            <Button variant="outline" size="sm" onClick={clearChat} disabled={messages.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Welcome to Your AI Assistant</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Choose an AI provider and start a conversation. Your assistant will remember your context and
                    preferences.
                  </p>

                  {/* Quick Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {quickPrompts.map((prompt, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md group"
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-8 h-8 bg-gradient-to-r ${prompt.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            >
                              <prompt.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{prompt.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground text-left">{prompt.prompt}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-r ${provider?.color || "from-gray-500 to-gray-600"}`}
                          >
                            {provider?.icon || "🤖"}
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-3xl rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white ml-12"
                            : "bg-white dark:bg-slate-800 border shadow-sm"
                        }`}
                      >
                        {message.role === "assistant" && message.providerId && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getProviderById(message.providerId)?.name}
                            </Badge>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        <div
                          className={`text-xs mt-2 opacity-70 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-r ${provider?.color || "from-gray-500 to-gray-600"}`}
                        >
                          {provider?.icon || "🤖"}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 border shadow-sm rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{provider?.name} is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${provider?.name || "AI"} anything about your business...`}
                  disabled={isLoading}
                  className="flex-1 h-12 text-base"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {userContext.name && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  <span>Personalized for {userContext.name}</span>
                  {userContext.businessType && (
                    <>
                      <span>•</span>
                      <span>{userContext.businessType}</span>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
