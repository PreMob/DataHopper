"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

type Source = { title: string; url: string; displayLink?: string }

export function Message({
  role,
  content,
  sources = [],
  className,
}: {
  role: "user" | "assistant"
  content: string
  sources?: Source[]
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border/50 bg-card/30 p-4 md:p-5",
        role === "user" ? "bg-card/20" : "",
        className,
      )}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm md:text-[15px] leading-6 text-pretty">{content}</div>

        <div className="shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={copied ? "Copied" : "Copy"}
            onClick={onCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {role === "assistant" && sources?.length > 0 ? (
        <div className="mt-4 grid gap-2">
          <p className="text-xs text-muted-foreground">Sources</p>
          <ul className="grid gap-2">
            {sources.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm text-foreground hover:underline"
                >
                  {s.title}
                </a>
                <span className="ml-3 shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {s.displayLink ?? new URL(s.url).hostname}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.div>
  )
}
