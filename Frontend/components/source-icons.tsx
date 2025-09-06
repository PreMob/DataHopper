"use client"

import React from "react"
import { motion } from "framer-motion"

type Props = React.SVGProps<SVGSVGElement> & { size?: number }

export const GoogleIcon = ({ size = 16, className, ...rest }: Props & { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    whileHover={{ rotate: 3, scale: 1.05 }}
  >
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1A6.3 6.3 0 0 1 5.7 12 6.3 6.3 0 0 1 12 5.8c1.8 0 3 .6 3.7 1.1l2.5-2.5C16.8 3 14.7 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c6.9 0 9.2-4.8 9.2-7.2 0-.5-.05-.9-.11-1.2H12z"
    />
    <path fill="#4285F4" d="M21.2 13.4c.1-.4.2-.8.2-1.3 0-.5-.1-.9-.2-1.3H12v2.6h9.2z" />
    <path
      fill="#FBBC05"
      d="M12 20.6c3.8 0 6.9-2.5 8-5.9l-3.8-3H12v3.9h5.5c-.6 1.9-2.3 3.3-5.5 3.3-4.2 0-7.6-3.4-7.6-7.6S7.8 3.7 12 3.7c1.8 0 3.4.6 4.6 1.6l2-2C17.1 1.8 14.7.9 12 .9 6 1 1 6 1 12s5 11 11 11z"
      opacity=".001"
    />
  </motion.svg>
)

export const RedditIcon = ({ size = 16, className }: Props & { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    whileHover={{ rotate: -4, scale: 1.05 }}
  >
    <circle cx="12" cy="12" r="9" fill="#FF4500" />
    <circle cx="9" cy="12" r="1.3" fill="#fff" />
    <circle cx="15" cy="12" r="1.3" fill="#fff" />
    <path d="M8.5 15c1.2.9 5.8.9 7 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="17.5" cy="8.5" r="1.1" fill="#FF4500" stroke="#fff" strokeWidth="1" />
  </motion.svg>
)

export const BingIcon = ({ size = 16, className }: Props & { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    whileHover={{ rotate: 2, scale: 1.05 }}
  >
    <path fill="#008373" d="M6.5 3.5l4 1.7v9.3l4.5 2.5L6.5 21V3.5z" />
    <path fill="#00B294" d="M10.5 4.9l3.8 1.6-2.7 7.7-1.1-.6V4.9z" />
    <path fill="#32D7C6" d="M17.5 17.5l-2.5 1.4-4.5 2.1 7-3.5z" />
  </motion.svg>
)

export const GlobeFallback = ({ size = 16, className }: Props & { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className ? `text-muted-foreground ${className}` : "text-muted-foreground"}
    aria-hidden
    whileHover={{ rotate: 1, scale: 1.05 }}
  >
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </motion.svg>
)

// Favicon component that tries to load the actual favicon
export const FaviconIcon = ({ url, size = 16 }: { url: string; size?: number }) => {
  const [hasError, setHasError] = React.useState(false)

  if (hasError) {
    return <GlobeFallback size={size} />
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${url}&sz=${size}`}
      width={size}
      height={size}
      alt="Site favicon"
      className="rounded-sm"
      onError={() => setHasError(true)}
    />
  )
}
