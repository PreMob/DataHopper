"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type NavbarProps = {
  className?: string
  rightArea?: React.ReactNode
}

export function Navbar({ className, rightArea }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55",
        className,
      )}
      role="banner"
      aria-label="DataHopper navigation"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group inline-flex items-center gap-2">
          {/* Logo */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-cyan-400 transition-transform group-hover:scale-105"
          >
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />
            <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          </svg>
          <span className="font-semibold tracking-tight">DataHopper</span>
        </Link>

        <div className="flex items-center gap-2">{rightArea}</div>
      </div>
    </motion.header>
  )
}
