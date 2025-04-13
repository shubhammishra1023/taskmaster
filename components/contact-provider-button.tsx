"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
interface ContactProviderButtonProps {
  providerId: string
  providerName: string
}

export function ContactProviderButton({ providerId, providerName }: ContactProviderButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleContact = async () => {
    setIsLoading(true)
    
    try {
      // Create a conversation by sending an initial message
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: providerId,
          content: `Hello! I'm interested in your services.`,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to start conversation")
      }
      
      const data = await response.json()
      
      // Navigate to the conversation
      const ids = [data.data.senderId, providerId].sort()
      const conversationId = `${ids[0]}_${ids[1]}`
      
      router.push(`/dashboard/messages/${conversationId}`)
    } catch (error) {
      console.error("Error contacting provider:", error)
      toast.error("Failed to start conversation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleContact} disabled={isLoading}>
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      ) : (
        <MessageSquare className="mr-2 h-4 w-4" />
      )}
      Contact {providerName}
    </Button>
  )
}