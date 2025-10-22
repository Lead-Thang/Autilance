"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Search,
  User,
  Users,
  Bell,
  Settings,
  Loader2
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client" // Import client-side Supabase

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar: string
    user_id: string
  }
  timestamp: string
  read: boolean
  pending?: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isGroup?: boolean
}

export default function MessagesPage() {
  const { user, isLoading } = useUser()
  const supabase = useMemo(() => createClient(), [])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [conversationsError, setConversationsError] = useState<string | null>(null)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [sendMessageError, setSendMessageError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Fetch conversations from Supabase
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true)
        setConversationsError(null)
        // Add check for user existence
        if (!user?.id) {
          console.warn("User not authenticated, cannot fetch conversations")
          setConversationsError("Please log in to view your conversations")
          return
        }

        const { data, error: supabaseError } = await supabase
          .from('conversations') // Adjust table name as per your schema
          .select('*')
          .eq('user_id', user.id) // Filter by current user
          .order('timestamp', { ascending: false })
        
        if (supabaseError) {
          console.error('Supabase error fetching conversations:', supabaseError.message)
          // Provide more specific error message based on common issues
          if (supabaseError.code === '42501') {
            setConversationsError("Access denied: You don't have permission to view conversations")
          } else if (supabaseError.code === 'PGRST116') {
            setConversationsError("Table not found: Conversations table might be missing or renamed")
          } else {
            setConversationsError(`Failed to load conversations: ${supabaseError.message}`)
          }
          setConversations([])
          return
        }
        
        if (!data || data.length === 0) {
          console.log("No conversations found for user:", user.id)
          setConversations([])
          return
        }
        
        setConversations(data)
      } catch (err: any) {
        console.error('Unexpected error fetching conversations:', err)
        // Handle network errors or other unexpected issues
        if (err.name === 'TypeError' && err.message.includes('Network')) {
          setConversationsError("Network error: Please check your internet connection")
        } else {
          setConversationsError(`Failed to load conversations: ${err.message || 'Unknown error'}`)
        }
        setConversations([])
      } finally {
        setLoadingConversations(false)
      }
    }

    if (user?.id) fetchConversations()
  }, [user?.id])

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversation) return

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)
        setMessagesError(null)
        const { data, error } = await supabase
          .from('messages') // Adjust table name
          .select('*')
          .eq('conversation_id', activeConversation.id)
          .order('timestamp', { ascending: true })
        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        console.error('Error fetching messages:', err)
        setMessagesError('Failed to load messages')
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()

    // Real-time subscription for new messages
    const channel = supabase
      .channel(`messages:${activeConversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversation.id}` }, (payload) => {
        setMessages((prev) => {
          // Transform database payload to match Message interface
          const dbMessage = payload.new
          const message: Message = {
            id: dbMessage.id,
            content: dbMessage.content,
            sender: {
              name: dbMessage.user_id === user?.id ? "You" : dbMessage.sender_name || "Unknown",
              avatar: dbMessage.sender_avatar || "/avatars/user.jpg",
              user_id: dbMessage.user_id
            },
            timestamp: format(new Date(dbMessage.timestamp), 'HH:mm'),
            read: dbMessage.read || false
          }
          
          // Check if there's a pending message with the same content to replace
          const existingIndex = prev.findIndex(msg => msg.pending && msg.content === message.content && msg.sender.user_id === user?.id)
          if (existingIndex >= 0) {
            // Replace the pending message with the real one
            const updated = [...prev]
            updated[existingIndex] = { ...message, pending: false }
            return updated
          } else {
            // Add as new message
            return [...prev, message]
          }
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeConversation])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation || !user) {
      if (!user) {
        console.error('User not available')
        setSendMessageError('Failed to send message: User not authenticated')
      }
      return
    }

    setSendMessageError(null)

    // Create transient message for optimistic update
    const tempId = `temp-${Date.now()}`
    const transientMessage: Message = {
      id: tempId,
      content: newMessage,
      sender: {
        name: "You",
        avatar: user.avatar || "/avatars/user.jpg",
        user_id: user.id
      },
      timestamp: format(new Date(), 'HH:mm'),
      read: true,
      pending: true
    }

    // Add transient message to local state immediately
    setMessages(prev => [...prev, transientMessage])

    // Clear input
    setNewMessage("")

    // Create DB payload
    const dbPayload = {
      content: newMessage,
      conversation_id: activeConversation.id,
      user_id: user.id
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert(dbPayload)
      if (error) throw error

      // On success, the real-time subscription will replace the pending message with the real one
    } catch (err) {
      console.error('Error sending message:', err)
      setSendMessageError('Failed to send message')
      // On failure, remove the transient message
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setMessages([]) // Clear messages while loading new ones
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 overflow-hidden border-0 rounded-none shadow-none w-full">
        {/* Conversations sidebar */}
        <div className="w-1/3 border-r border-border flex flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Conversations</span>
            </CardTitle>
            <CardDescription>Select a conversation to start messaging</CardDescription>
          </CardHeader>
          
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10" 
                aria-label="Search conversations"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-2">
              {loadingConversations ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
               ) : conversationsError ? (
                 <div className="text-center text-red-500 p-4">{conversationsError}</div>
              ) : conversations.length === 0 ? (
                <div className="text-center text-gray-500 p-4">No conversations found</div>
              ) : (
                conversations.map((conversation) => (
                  <button 
                    key={conversation.id}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg cursor-pointer hover:bg-accent text-left ${
                      activeConversation?.id === conversation.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                    aria-label={`Select conversation with ${conversation.name}`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.isGroup ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 flex flex-col w-full">
          {activeConversation ? (
            <>
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={activeConversation.avatar} />
                      <AvatarFallback>
                        {activeConversation.isGroup ? <Users className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{activeConversation.name}</CardTitle>
                      <CardDescription>
                        {activeConversation.isGroup ? "Group chat" : "Online"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                 ) : messagesError ? (
                   <div className="text-center text-red-500 p-4">{messagesError}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 p-4">No messages yet</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.sender.user_id === user?.id
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-3xl rounded-lg p-3 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium">{message.sender.name}</span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                             <div className="flex justify-between mt-1">
                               <span className="text-xs opacity-70">{message.timestamp}</span>
                               <div className="flex items-center gap-1">
                                 {message.pending && (
                                   <span className="text-xs opacity-50">Sending...</span>
                                 )}
                                 {isCurrentUser && message.read && !message.pending && (
                                   <span className="text-xs opacity-50">✓ Read</span>
                                 )}
                               </div>
                             </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" aria-label="Attach file">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Add emoji">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Input 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="w-full"
                      aria-label="Message input"
                    />
                  </div>
                  <Button size="icon" onClick={handleSendMessage} aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground mb-4">
                Choose a conversation from the sidebar to start messaging
              </p>
              {conversations.length > 0 && (
                <Button onClick={() => handleSelectConversation(conversations[0])}>
                  Start chatting
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}