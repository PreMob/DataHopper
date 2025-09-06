"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function AnimatedSideBorder({
  side = "left",
  className,
  width = 2,
  speed = 2.4,
  colorClass = "bg-cyan-400",
}: {
  side?: "left" | "right"
  className?: string
  width?: number
  speed?: number
  colorClass?: string
}) {
  const isLeft = side === "left"
  const prefersReduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-y-0 overflow-hidden", isLeft ? "left-0" : "right-0", className)}
      style={{ width }}
    >
      {/* static rail / reduced-motion */}
      <div className={cn("absolute inset-0 opacity-40 blur-[6px]", colorClass)} />

      {!prefersReduced && (
        <>
          {/* subtle breathing glow */}
          <motion.div
            className={cn("absolute inset-0", colorClass)}
            style={{ filter: "blur(6px)" }}
            initial={{ opacity: 0.18 }}
            animate={{ opacity: [0.18, 0.45, 0.18] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          {/* traveling pulse */}
          <motion.div
            className={cn("absolute left-0 right-0 rounded", colorClass)}
            style={{ height: 10, willChange: "transform" }}
            initial={{ y: "-10%" }}
            animate={{ y: ["-10%", "110%"] }}
            transition={{ duration: speed, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  )
}
