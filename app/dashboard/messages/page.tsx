"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Search, MessageSquare } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Conversation {
  conversationId: string
  lastMessage: {
    _id: string
    content: string
    senderId: string
    createdAt: string
  }
  otherUser: {
    _id: string
    name: string
    email: string
    role: string
    profileImage?: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchConversations()
    }
  }, [status, router])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/messages/conversations")
      if (!response.ok) throw new Error("Failed to fetch conversations")

      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      toast.error("Error",{
        description: "Failed to load conversations",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a")
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMM d")
    } else {
      return format(date, "MM/dd/yy")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight ml-5">Messages</h1>
          <p className="text-muted-foreground ml-5">Communicate with service providers and consumers</p>
        </div>

        <div className="relative ml-5">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rounded-lg border">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.conversationId}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/messages/${conversation.conversationId}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.otherUser.profileImage || "/placeholder.svg"} alt={conversation.otherUser.name} />
                        <AvatarFallback>{getInitials(conversation.otherUser.name)}</AvatarFallback>
                      </Avatar>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">{conversation.otherUser.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageDate(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-medium" : "text-muted-foreground"}`}>
                        {conversation.lastMessage.senderId === session?.user.id ? "You: " : ""}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No conversations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When you connect with service providers or consumers, your conversations will appear here.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Find Service Providers
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}