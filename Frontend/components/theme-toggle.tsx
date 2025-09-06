"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const current = (theme ?? resolvedTheme ?? "system") as "light" | "dark" | "system"

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 p-1 backdrop-blur">
      <Button
        size="icon"
        variant={current === "light" ? "secondary" : "ghost"}
        className="h-8 w-8 rounded-full"
        aria-label="Light theme"
        onClick={() => setTheme("light")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current === "light" ? "sun-active" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        </AnimatePresence>
      </Button>
      <Button
        size="icon"
        variant={current === "dark" ? "secondary" : "ghost"}
        className="h-8 w-8 rounded-full"
        aria-label="Dark theme"
        onClick={() => setTheme("dark")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current === "dark" ? "moon-active" : "moon"}
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        </AnimatePresence>
      </Button>
      <Button
        size="icon"
        variant={current === "system" ? "secondary" : "ghost"}
        className="h-8 w-8 rounded-full"
        aria-label="System theme"
        onClick={() => setTheme("system")}
      >
        <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Monitor className="h-4 w-4" />
        </motion.span>
      </Button>
    </div>
  )
}
