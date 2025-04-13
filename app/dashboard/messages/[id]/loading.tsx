// app/dashboard/messages/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <div className="container max-w-4xl py-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 mt-1" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${i % 2 === 0 ? "bg-primary/20" : "bg-muted"}`}>
                <Skeleton className={`h-4 w-${Math.floor(Math.random() * 24) + 24}`} />
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}