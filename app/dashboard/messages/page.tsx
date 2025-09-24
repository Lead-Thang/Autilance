"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  Loader2,
  Plus
} from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string | null
  }
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string | null
  lastMessage: string
  timestamp: string
  unread: number
  isGroup?: boolean
  participants: {
    id: string
    name: string
    avatar: string | null
  }[]
}

interface UserSearchResult {
  id: string
  name: string
  avatar: string | null
  title?: string
  isFriend: boolean
}

export default function MessagesPage() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Simulate fetching conversations
  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        setConversations([
          // Empty by default - will be populated when users start conversations
        ])
        setLoading(false)
      }, 500)
    }
  }, [user])

  // Simulate user search
  const handleUserSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearchLoading(true)
    setShowSearchResults(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock search results
    const mockResults: UserSearchResult[] = [
      {
        id: "1",
        name: "John Doe",
        avatar: null,
        title: "Frontend Developer",
        isFriend: true
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: null,
        title: "UX Designer",
        isFriend: false
      }
    ]

    setSearchResults(mockResults.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    ))
    setSearchLoading(false)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeConversation || !user) return
    
    setSending(true)
    
    // Create new message
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: {
        id: user.id,
        name: "You",
        avatar: user.avatar || null
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    }
    
    setMessages([...messages, message])
    setNewMessage("")
    setSending(false)
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const handleStartConversation = (userResult: UserSearchResult) => {
    // Create a new conversation with the selected user
    const newConversation: Conversation = {
      id: `conv_${userResult.id}`,
      name: userResult.name,
      avatar: userResult.avatar,
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      participants: [
        {
          id: userResult.id,
          name: userResult.name,
          avatar: userResult.avatar
        }
      ]
    }
    
    // Add to conversations if not already present
    if (!conversations.some(conv => conv.id === newConversation.id)) {
      setConversations(prev => [newConversation, ...prev])
    }
    
    // Set as active conversation
    setActiveConversation(newConversation)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Connect and communicate with your team</p>
        </div>
      </div>

      <Card className="flex h-[calc(100vh-220px)] overflow-hidden">
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
                placeholder="Search conversations or users..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value
                  setSearchQuery(query)
                  handleUserSearch(query)
                }}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />
            </div>
          </div>
          
          {/* Search Results */}
          {showSearchResults && searchQuery && (
            <div className="border-b border-border">
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <h3 className="text-sm font-semibold text-gray-500">People</h3>
                </div>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((userResult) => (
                      <div 
                        key={userResult.id}
                        className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent"
                        onClick={() => handleStartConversation(userResult)}
                      >
                        <Avatar>
                          <AvatarImage src={userResult.avatar || undefined} />
                          <AvatarFallback>{userResult.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{userResult.name}</p>
                            {userResult.isFriend && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Friend
                              </span>
                            )}
                          </div>
                          {userResult.title && (
                            <p className="text-sm text-gray-500 truncate">{userResult.title}</p>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-gray-500">No people found</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 && !showSearchResults ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-1">No conversations</h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery ? "No conversations match your search" : "You don't have any conversations yet"}
                </p>
                <Button className="mt-4" onClick={() => {
                  // Create a sample conversation for demo purposes
                  const newConversation: Conversation = {
                    id: "sample",
                    name: "Sample Conversation",
                    avatar: null,
                    lastMessage: "",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: 0,
                    participants: []
                  }
                  setConversations([newConversation])
                  setActiveConversation(newConversation)
                }}>
                  Start a conversation
                </Button>
              </div>
            ) : !showSearchResults ? (
              <div className="space-y-2 p-2">
                {filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      activeConversation?.id === conversation.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || undefined} />
                        <AvatarFallback>
                          {conversation.isGroup ? <Users className="h-4 w-4" /> : 
                           conversation.name.charAt(0).toUpperCase()}
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
                  </div>
                ))}
              </div>
            ) : null}
          </ScrollArea>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={activeConversation.avatar || undefined} />
                      <AvatarFallback>
                        {activeConversation.isGroup ? <Users className="h-5 w-5" /> : 
                         activeConversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{activeConversation.name}</CardTitle>
                      <CardDescription>
                        {activeConversation.isGroup ? 
                          `${activeConversation.participants.length} participants` : 
                          "Online"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender.name === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                            message.sender.name === "You" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          {message.sender.name !== "You" && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium">{message.sender.name}</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-end mt-1">
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Input 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !sending && handleSendMessage()}
                      disabled={sending}
                    />
                  </div>
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={sending || newMessage.trim() === ""}
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-gray-500 mb-4">
                Select a conversation from the list to start messaging
              </p>
              {conversations.length > 0 && (
                <Button onClick={() => handleSelectConversation(conversations[0])}>
                  Start a conversation
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}