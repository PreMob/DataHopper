"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ChatBubble } from "./chat-bubble"

export function ResearchSkeleton() {
  return (
    <ChatBubble role="assistant">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
    </ChatBubble>
  )
}
