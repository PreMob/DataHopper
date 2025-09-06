"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2, Search } from "lucide-react"

export function Progress({
  query,
  candidateQueries = [],
  reviewingCount = 10,
  className,
}: {
  query: string
  candidateQueries?: string[]
  reviewingCount?: number
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/30 p-4 md:p-5", className)} aria-busy="true">
      <div className="flex items-center gap-2">
        <motion.span
          className="inline-block h-2 w-2 rounded-full bg-cyan-400"
          initial={{ opacity: 0.4, scale: 0.8 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">
          Looking up “{query}” to provide you with the relevant information.
        </p>
      </div>

      {candidateQueries.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">Searching</p>
          <div className="flex flex-wrap gap-2">
            {candidateQueries.map((q, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground"
              >
                <Search className="h-3.5 w-3.5 text-cyan-400" />
                {q}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs text-muted-foreground">Reviewing sources · {reviewingCount}</p>
        <div className="rounded-xl border border-border/50 bg-background/40 p-2">
          <ul className="grid gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-muted" />
                  <span className="h-3 w-56 animate-pulse rounded bg-muted/70" />
                </div>
                <span className="h-2.5 w-20 animate-pulse rounded bg-muted/60" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
        Gathering and synthesizing…
      </div>
    </div>
  )
}
