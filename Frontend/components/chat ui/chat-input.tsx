"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Mic, Send, Globe, Shield } from "lucide-react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled = false,
  className,
  placeholder = "Ask anything or @mention a Space",
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onStop?: () => void
  disabled?: boolean
  className?: string
  placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  // auto-resize
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = "0px"
    ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + "px"
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!value || !value.trim()) {
      toast.error("Please enter a question to search")
      return
    }
    if (disabled) {
      toast.info("Working on your previous request…")
      return
    }
    onSubmit()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className={cn(
        "mx-auto w-full max-w-3xl rounded-2xl border border-border/60 bg-card/40 p-2 shadow-sm",
        "backdrop-blur supports-[backdrop-filter]:bg-card/40",
        className,
      )}
      aria-busy={disabled}
    >
      <div className="flex items-end gap-2">
        <div className="hidden md:flex items-center gap-1 pl-1 pr-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" type="button" aria-label="Search scope">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" type="button" aria-label="Safe search">
            <Shield className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "max-h-[200px] min-h-[44px] flex-1 resize-none border-0 bg-transparent p-3",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
          aria-label="Ask a question"
          disabled={disabled}
        />

        <div className="flex items-center gap-1 pr-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            type="button"
            aria-label="Attach file"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            type="button"
            aria-label="Voice input"
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            type={disabled ? "button" : "submit"}
            className={cn(
              "h-9 w-9 rounded-xl bg-cyan-500 text-white transition-colors hover:bg-cyan-400",
              disabled && "opacity-60",
            )}
            onClick={disabled ? onStop : undefined}
            aria-label={disabled ? "Stop" : "Send"}
            disabled={false}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-1 px-2 pb-1 text-[11px] text-muted-foreground">
        Press Enter to send • Shift+Enter for a new line
      </div>
    </form>
  )
}
