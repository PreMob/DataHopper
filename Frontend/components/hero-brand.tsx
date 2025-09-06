"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { TextParticle } from "@/components/ui/text-particle"
import { MorphingText } from "@/components/ui/liquid-text"

export function HeroBrand({ className }: { className?: string }) {
  const letters = "DataHopper".split("")
  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
      <h1 className="sr-only">DataHopper</h1>

      <div className="mx-auto w-full max-w-3xl">
        <div className="inline-flex w-full items-center justify-center">
          <div className="relative inline-block h-[84px] w-[520px] md:h-[100px] md:w-[640px]">
            <TextParticle
              text="DataHopper"
              particleColor="#22d3ee"
              particleDensity={7}
              particleSize={2}
              fontSize={84}
              className="h-full w-full"
              interactive={true}
              aria-hidden={false}
            />
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.9, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute left-full top-0 ml-3 inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-[3px] text-xs text-cyan-400"
              role="button"
              tabIndex={0}
              onClick={() => {
                const el = document.getElementById("main-query-input") as HTMLInputElement | null
                el?.focus()
              }}
            >
              <Search className="h-3.5 w-3.5" />
              search
            </motion.span>
          </div>
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-center text-sm text-muted-foreground text-pretty">
        Multi‑source research with citations, live web review, and{" "}
        <MorphingText className="ml-1" texts={["insights", "clarity", "precision", "speed"]} />
      </p>

      <motion.div
        aria-hidden
        className="h-px w-24 bg-cyan-400/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      />
    </div>
  )
}
