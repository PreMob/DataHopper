"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizonal, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  className,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  className?: string
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!disabled) onSubmit()
    }
  }

  return (
    <div className={cn("rounded-xl border bg-card p-2", className)}>
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything to start researching…"
          rows={2}
          className="min-h-[44px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Message input"
          disabled={disabled}
        />
        <Button type="button" onClick={onSubmit} disabled={disabled || !value.trim()} className="shrink-0">
          {disabled ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Researching
            </>
          ) : (
            <>
              <SendHorizonal className="mr-2 size-4" />
              Send
            </>
          )}
        </Button>
      </div>
      <p className="px-2 pt-1 text-[12px] text-muted-foreground">Enter to send • Shift+Enter for newline</p>
    </div>
  )
}
