"use client"

import { useState, useEffect } from "react"
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
  Settings
} from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar: string
  }
  timestamp: string
  read: boolean
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
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/avatars/user1.jpg",
      lastMessage: "Hey, how's the project going?",
      timestamp: "2h ago",
      unread: 2
    },
    {
      id: "2",
      name: "Design Team",
      avatar: "/avatars/team.jpg",
      lastMessage: "Sarah: I've updated the mockups",
      timestamp: "4h ago",
      unread: 0,
      isGroup: true
    },
    {
      id: "3",
      name: "Marketing Group",
      avatar: "/avatars/team2.jpg",
      lastMessage: "Mike: Can we schedule a meeting?",
      timestamp: "1d ago",
      unread: 5,
      isGroup: true
    },
    {
      id: "4",
      name: "Sam Wilson",
      avatar: "/avatars/user2.jpg",
      lastMessage: "Thanks for the feedback!",
      timestamp: "1d ago",
      unread: 0
    },
    {
      id: "5",
      name: "Tech Support",
      avatar: "/avatars/support.jpg",
      lastMessage: "Your ticket has been resolved",
      timestamp: "2d ago",
      unread: 0
    }
  ])
  
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey there! How's the project coming along?",
      sender: {
        name: "Alex Johnson",
        avatar: "/avatars/user1.jpg"
      },
      timestamp: "10:30 AM",
      read: true
    },
    {
      id: "2",
      content: "It's going well! I've completed the initial design mockups.",
      sender: {
        name: "You",
        avatar: user?.avatar || "/avatars/user.jpg"
      },
      timestamp: "10:32 AM",
      read: true
    },
    {
      id: "3",
      content: "That's great to hear! Can you share them with the team?",
      sender: {
        name: "Alex Johnson",
        avatar: "/avatars/user1.jpg"
      },
      timestamp: "10:33 AM",
      read: true
    },
    {
      id: "4",
      content: "Sure, I'll send them over in a few minutes.",
      sender: {
        name: "You",
        avatar: user?.avatar || "/avatars/user.jpg"
      },
      timestamp: "10:35 AM",
      read: true
    }
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return
    
    const message: Message = {
      id: (messages.length + 1).toString(),
      content: newMessage,
      sender: {
        name: "You",
        avatar: user?.avatar || "/avatars/user.jpg"
      },
      timestamp: "Just now",
      read: true
    }
    
    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    // In a real app, this would fetch messages for the selected conversation
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Connect and communicate with your team</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
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
                placeholder="Search conversations..." 
                className="pl-10" 
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-2">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                    activeConversation?.id === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
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
                </div>
              ))}
            </div>
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
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
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
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">{message.sender.name}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                  </div>
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
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
              <Button onClick={() => handleSelectConversation(conversations[0])}>
                Start a conversation
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}