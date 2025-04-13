"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Send } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  name: string
  email: string
  profileImage?: string
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchMessages()
      
      // Set up polling for new messages
      const interval = setInterval(fetchMessages, 10000) // Poll every 10 seconds
      
      return () => clearInterval(interval)
    }
  }, [status, router, params.id])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/conversation/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch messages")

      const data = await response.json()
      setMessages(data)
      setIsLoading(false)

      // Extract the other user's ID from the conversation
      if (data.length > 0) {
        const message = data[0]
        const otherUserId = message.senderId === session?.user.id ? message.receiverId : message.senderId
        
        // Fetch other user's details
        const userResponse = await fetch(`/api/users/${otherUserId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setOtherUser(userData)
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      if (isLoading) {
        toast.error("Error",{
          description: "Failed to load conversation",
        })
      }
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !otherUser) return
    
    setIsSending(true)
    
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: otherUser._id,
          content: newMessage,
        }),
      })
      
      if (!response.ok) throw new Error("Failed to send message")
      
      // Add the new message to the list
      const data = await response.json()
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        _id: data.data.id,
        senderId: session!.user.id,
        receiverId: otherUser._id,
        content: newMessage,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setMessages([...messages, tempMessage])
      setNewMessage("")
      
      // Fetch updated messages to ensure consistency
      fetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error",{
        description: "Failed to send message"
      })
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const formatMessageDate = (dateString: string, index: number) => {
    const currentDate = new Date(dateString)
    
    // For the first message, always show the date
    if (index === 0) {
      return format(currentDate, "MMMM d, yyyy")
    }
    
    // For subsequent messages, check if the date is different from the previous message
    const previousDate = new Date(messages[index - 1].createdAt)
    
    if (currentDate.toDateString() !== previousDate.toDateString()) {
      return format(currentDate, "MMMM d, yyyy")
    }
    
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (status === "loading" || (isLoading && !messages.length)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/messages")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {otherUser ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.profileImage || "/placeholder.svg"} alt={otherUser.name} />
              <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{otherUser.name}</h2>
              <p className="text-xs text-muted-foreground">{otherUser.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48 mt-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === session?.user.id
              const dateLabel = formatMessageDate(message.createdAt, index)
              
              return (
                <div key={message._id} className="space-y-2">
                  {dateLabel && (
                    <div className="flex justify-center">
                      <div className="bg-muted text-xs px-2 py-1 rounded-md">
                        {dateLabel}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation by sending a message</p>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={sendMessage} className="border-t pt-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending || !otherUser}
          />
          <Button type="submit" disabled={isSending || !newMessage.trim() || !otherUser}>
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}