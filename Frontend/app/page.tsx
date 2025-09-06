"use client"

import type React from "react"
import cn from "classnames"

import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Copy, Loader2, Search, X } from "lucide-react"
import { ResearchSources, type SourcePayload } from "@/components/research-sources"
import { AnimatedSideBorder } from "@/components/animated-side-border"
import { ThemeToggle } from "@/components/theme-toggle"
import { GoogleIcon, RedditIcon, BingIcon, GlobeFallback, FaviconIcon } from "@/components/source-icons"
import { HeroBrand } from "@/components/hero-brand"
import { Navbar } from "@/components/navbar"

function DotPulse() {
  return (
    <motion.span
      className="inline-block h-2 w-2 rounded-full bg-cyan-400"
      initial={{ opacity: 0.4, scale: 0.8 }}
      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
      aria-hidden="true"
    />
  )
}

function SourceChips({
  urls = [],
}: {
  urls?: { title?: string; url: string; displayLink?: string }[]
}) {
  if (!urls?.length) return null

  function iconFor(host: string | undefined, url?: string) {
    if (!host) return <GlobeFallback />
    const h = host.toLowerCase()
    if (h.includes("reddit")) return <RedditIcon />
    if (h.includes("bing")) return <BingIcon />
    if (h.includes("google")) return <GoogleIcon />
    // For other websites, try to show their favicon
    if (url && !h.includes("localhost") && !h.includes("127.0.0.1")) {
      return <FaviconIcon url={host} />
    }
    return <GlobeFallback />
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {urls.slice(0, 6).map((s, i) => {
        const host = (() => {
          try {
            return new URL(s.url).hostname
          } catch {
            return s.displayLink
          }
        })()
        return (
          <motion.a
            key={i}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground hover:border-border hover:bg-card/60"
            whileHover={{ y: -1, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            {iconFor(host, s.url)}
            <span className="max-w-[120px] md:max-w-[200px] truncate">{s.title ?? s.displayLink ?? host ?? s.url}</span>
          </motion.a>
        )
      })}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 text-muted-foreground hover:text-foreground"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        } catch { }
      }}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

function PillInput({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled,
  placeholder = "Ask anything or @mention a Space",
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onStop?: () => void
  disabled?: boolean
  placeholder?: string
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (disabled) {
          onStop?.()
        } else {
          onSubmit()
        }
      }}
      className="mx-auto w-full max-w-3xl rounded-2xl border border-border/60 dark:border-neutral-800 bg-card/40 dark:bg-neutral-900/50 p-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/40"
    >
      <div className="flex items-end gap-2">
        <textarea
          id="main-query-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          className="min-h-[44px] flex-1 resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/70"
          aria-label="Ask a question"
        />
        <div className="flex items-center gap-1 pr-1">
          <Button
            type="submit"
            size="icon"
            className={cn("h-9 w-9 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400", disabled && "opacity-60")}
            aria-label={disabled ? "Stop" : "Send"}
          >
            {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-1 px-2 pb-1 text-[11px] text-muted-foreground">Enter to send • Shift+Enter for newline</div>
    </form>
  )
}

interface ResearchResponse extends SourcePayload {
  final_answer: string
  status?: string
  sources?: { title?: string; url: string; displayLink?: string }[]
  queries?: string[]
}

type ChatMessage =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content: string; response?: ResearchResponse }

export default function Page() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"answer" | "sources">("answer")
  const endRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const t = setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80)
    return () => clearTimeout(t)
  }, [messages, loading])

  const suggestions = useMemo(
    () => [
      "today's holiday in India",
      "top 5 LLMs for retrieval with citations",
      "summarize recent BI trends for SMBs",
    ],
    [],
  )

  const API_URL = process.env.NEXT_PUBLIC_RESEARCH_API_URL

  const sendWith = async (textArg: string) => {
    const text = textArg.trim()
    if (!text || loading) {
      if (!text) {
        toast.error("Type something first")
      }
      return
    }

    if (!API_URL) {
      setLoading(false)
      return toast.error("Missing API URL. Set NEXT_PUBLIC_RESEARCH_API_URL in Project Settings.")
    }

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setTab("answer")
    setLoading(true)

    try {
      const controller = new AbortController()
      abortRef.current = controller

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ResearchResponse = await res.json()

      if (!data?.final_answer) {
        toast.message("No answer received", { description: "The server responded without a final answer." })
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.final_answer || "No answer returned.",
        response: data,
      }
      setMessages((m) => [...m, assistantMsg])
    } catch (err: any) {
      if (err?.name === "AbortError") {
        toast("Cancelled", { description: "Research request was cancelled." })
      } else {
        toast.error(err?.message || "Something went wrong while researching.")
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  const handleSend = () => sendWith(input)

  const handleCancel = () => abortRef.current?.abort()

  const brand = useMemo(
    () => ({
      accent: "text-cyan-400",
      chip: "rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground",
    }),
    [],
  )

  const hasConversation = messages.length > 0
  const firstTitle = messages.find((m) => m.role === "user")?.content ?? "Ask anything"

  return (
    <main className="relative min-h-screen bg-background dark:bg-neutral-900">
      <AnimatePresence initial={false}>
        {(hasConversation || loading) && (
          <motion.div
            key="navbar"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Navbar rightArea={<ThemeToggle />} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatedSideBorder side="left" className="hidden md:block" />
      <AnimatedSideBorder side="right" className="hidden md:block" />

      <AnimatePresence mode="wait" initial={false}>
        {!hasConversation && (
          <motion.section
            key="landing"
            className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(2px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <HeroBrand className="mb-8" />
            <PillInput
              value={input}
              onChange={setInput}
              onSubmit={handleSend}
              onStop={handleCancel}
              disabled={loading}
            />
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s)
                    sendWith(s)
                  }}
                  className={`${brand.chip} hover:border-border hover:bg-card/60`}
                  aria-label={`Use suggestion: ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {hasConversation && (
          <motion.section
            key="chat"
            className="mx-auto w-full max-w-5xl px-4 py-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mb-6">
              <h2 className="text-pretty text-2xl font-semibold md:text-3xl">{firstTitle}</h2>
              <div className="mt-4 flex items-center gap-5 text-sm">
                <button
                  className={cn(
                    "transition-colors",
                    tab === "answer" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-selected={tab === "answer"}
                  onClick={() => setTab("answer")}
                >
                  Answer
                </button>
                <button
                  className={cn(
                    "transition-colors",
                    tab === "sources" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-selected={tab === "sources"}
                  onClick={() => setTab("sources")}
                >
                  Sources
                </button>
                <Separator className="ml-2 hidden flex-1 md:block" />
                {loading && (
                  <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                    <DotPulse />
                    <span>Looking up results…</span>
                  </div>
                )}
              </div>
            </div>

            {tab === "answer" && (
              <div className="grid gap-4">
                {messages.map((m) => {
                  if (m.role === "user") {
                    return (
                      <Card
                        key={m.id}
                        className="border-border/60 dark:border-neutral-800 bg-card/30 dark:bg-neutral-900/40"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm leading-6 whitespace-pre-wrap">{m.content}</div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }

                  const sourcesFlat =
                    m.response?.sources ??
                    [
                      ...(m.response?.google_results?.organic ?? []),
                      ...(m.response?.bing_results?.organic ?? []),
                      ...(m.response?.reddit_results?.parsed_posts ?? []),
                    ]
                      .map((s: any) => ({
                        title: s.title ?? s.link_title ?? s.display_link ?? s?.url,
                        url: s.url ?? s.link ?? "#",
                        displayLink: s.display_link,
                      }))
                      .filter((s: any) => !!s.url && s.url !== "#")

                  return (
                    <Card
                      key={m.id}
                      className="border-border/60 dark:border-neutral-800 bg-card/30 dark:bg-neutral-900/40"
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          >
                            {m.response?.status ?? "completed"}
                          </Badge>
                          <CopyButton text={m.content} />
                        </div>

                        <SourceChips urls={sourcesFlat as any} />

                        <div className="prose prose-invert max-w-none text-sm leading-7">
                          <h3 className="mb-2 text-base font-semibold">Final Answer</h3>
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>

                        {m.response && (
                          <div className="mt-4">
                            <ResearchSources
                              payload={{
                                google_results: m.response.google_results,
                                bing_results: m.response.bing_results,
                                reddit_results: m.response.reddit_results,
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      className="rounded-xl border border-border/60 dark:border-neutral-800 bg-card/40 dark:bg-neutral-900/50 p-4"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      aria-busy="true"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DotPulse />
                        <span>
                          Looking up “
                          {messages[messages.length - 1]?.role === "user"
                            ? messages[messages.length - 1].content
                            : firstTitle}
                          ”.
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {firstTitle
                          .split(" ")
                          .slice(0, 5)
                          .map((w, i) => (
                            <span key={i} className={brand.chip}>
                              {w}
                            </span>
                          ))}
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs text-muted-foreground">Reviewing sources</p>
                        <div className="rounded-xl border border-border/60 dark:border-neutral-800 bg-background/40 dark:bg-neutral-900/40 p-2">
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

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                          Gathering and synthesizing…
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleCancel} className="gap-1">
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {tab === "sources" && (
              <div className="grid gap-4">
                {(() => {
                  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
                  if (!lastAssistant?.response) {
                    return (
                      <p className="text-sm text-muted-foreground">
                        No sources yet. Ask something to see citations and raw data.
                      </p>
                    )
                  }
                  const sourcesFlat =
                    lastAssistant.response.sources ??
                    [
                      ...(lastAssistant.response.google_results?.organic ?? []),
                      ...(lastAssistant.response.bing_results?.organic ?? []),
                      ...(lastAssistant.response.reddit_results?.parsed_posts ?? []),
                    ]
                      .map((s: any) => ({
                        title: s.title ?? s.link_title ?? s.display_link ?? s?.url,
                        url: s.url ?? s.link ?? "#",
                        displayLink: s.display_link,
                      }))
                      .filter((s: any) => !!s.url && s.url !== "#")

                  return (
                    <div className="rounded-xl border border-border/60 dark:border-neutral-800 bg-card/30 dark:bg-neutral-900/40 p-4">
                      <h3 className="mb-3 text-sm font-medium">Sources</h3>
                      <SourceChips urls={sourcesFlat} />
                      <div className="mt-4">
                        <ResearchSources
                          payload={{
                            google_results: lastAssistant.response.google_results,
                            bing_results: lastAssistant.response.bing_results,
                            reddit_results: lastAssistant.response.reddit_results,
                          }}
                        />
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            <div className="sticky bottom-6 z-10 mt-6">
              <PillInput
                value={input}
                onChange={setInput}
                onSubmit={handleSend}
                onStop={handleCancel}
                disabled={loading}
                placeholder="Ask a follow-up…"
              />
            </div>

            <p className="mx-auto mt-6 text-center text-xs text-muted-foreground">
              Powered by Google Gemini AI, BrightData, and LangGraph
            </p>
            <div ref={endRef} />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}
