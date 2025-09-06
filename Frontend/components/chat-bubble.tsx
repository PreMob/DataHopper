"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot, UserIcon, Check, Copy } from "lucide-react"
import { useState } from "react"

type Role = "user" | "assistant"

export function ChatBubble({
  role,
  children,
  statusBadge,
  copyText,
}: {
  role: Role
  children: ReactNode
  statusBadge?: ReactNode
  copyText?: string
}) {
  const isUser = role === "user"
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!copyText) return
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // silently ignore clipboard errors
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.6 }}
      className={cn("w-full flex items-start gap-3", isUser ? "justify-end" : "justify-start")}
      role="group"
      aria-live="polite"
    >
      {!isUser && (
        <Avatar className="size-8">
          <AvatarFallback aria-label="Assistant">
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm relative",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border",
        )}
      >
        {children}
        {statusBadge && <div className="mt-2">{statusBadge}</div>}

        {!isUser && copyText && (
          <div className="absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy message"}
              className="rounded-full border bg-background/80 p-1.5 shadow-sm hover:bg-background"
            >
              {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="size-8">
          <AvatarFallback aria-label="You">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}
