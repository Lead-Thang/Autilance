"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIProviderSelector } from "@/components/ai-provider-selector"
import { useAIChat } from "@/hooks/use-ai-chat"
import { getProviderById } from "@/lib/ai-providers"
import { MessageCircle, X, Send, Minimize2, Maximize2, User, Sparkles } from "lucide-react"

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, isLoading, currentProvider, sendMessage, switchProvider } = useAIChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    await sendMessage(input)
    setInput("")
    inputRef.current?.focus()
  }

  const provider = getProviderById(currentProvider)

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-0 transition-all duration-300 ${isMinimized ? "h-16" : "h-[500px]"}`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
              {provider && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  {provider.icon} {provider.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Provider Selector */}
            <div className="p-3 border-b bg-gray-50 dark:bg-slate-800">
              <AIProviderSelector
                currentProvider={currentProvider}
                onProviderChange={switchProvider}
                className="w-full text-xs h-8"
              />
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Start a conversation</p>
                    <p className="text-xs text-muted-foreground">Ask me anything about your business!</p>
                  </div>
                ) : (
                  <>
                    {messages.slice(-10).map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex-shrink-0">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs bg-gradient-to-r ${provider?.color || "from-gray-500 to-gray-600"}`}
                            >
                              {provider?.icon || "🤖"}
                            </div>
                          </div>
                        )}

                        <div
                          className={`max-w-[250px] rounded-lg px-3 py-2 text-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        </div>

                        {message.role === "user" && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-2 justify-start">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs bg-gradient-to-r ${provider?.color || "from-gray-500 to-gray-600"}`}
                          >
                            {provider?.icon || "🤖"}
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-gray-50 dark:bg-slate-800">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 h-8 text-sm"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
