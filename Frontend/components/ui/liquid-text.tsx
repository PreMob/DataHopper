"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  texts: string[]
  intervalMs?: number
  className?: string
}

export function MorphingText({ texts, intervalMs = 1600, className }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!texts?.length) return
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), intervalMs)
    return () => clearInterval(id)
  }, [texts, intervalMs])

  const word = texts[index] || ""

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ filter: "blur(8px)", opacity: 0.0, y: 6 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          exit={{ filter: "blur(8px)", opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block font-medium text-cyan-400"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
