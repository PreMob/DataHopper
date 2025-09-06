// Renders a canvas that draws particles forming the given text; supports hover repulsion.
"use client"

import React from "react"

type Particle = { x: number; y: number; bx: number; by: number; vx: number; vy: number; color: string }

export interface ParticleTitleProps {
  text: string
  width?: number
  height?: number
  density?: number // smaller = more particles
  color?: string
  font?: string // e.g. "700 64px Geist"
  repelRadius?: number
  className?: string
}

export default function ParticleTitle({
  text,
  width = 640,
  height = 120,
  density = 6,
  color = "#22d3ee",
  font = "700 64px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  repelRadius = 60,
  className,
}: ParticleTitleProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const offRef = React.useRef<HTMLCanvasElement | null>(null)
  const particlesRef = React.useRef<Particle[]>([])
  const mouseRef = React.useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })
  const frameRef = React.useRef<number | null>(null)

  // Resize to container width for responsiveness
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const off = (offRef.current = document.createElement("canvas"))
    const container = containerRef.current
    if (!canvas || !container) return

    const dpi = Math.min(window.devicePixelRatio || 1, 2)
    const ctx = canvas.getContext("2d")
    const octx = off.getContext("2d")
    if (!ctx || !octx) return

    const resize = () => {
      const cw = Math.max(320, Math.floor(container.clientWidth))
      const ch = height
      canvas.width = cw * dpi
      canvas.height = ch * dpi
      canvas.style.width = cw + "px"
      canvas.style.height = ch + "px"
      off.width = canvas.width
      off.height = canvas.height

      // Draw text to offscreen
      octx.clearRect(0, 0, off.width, off.height)
      octx.fillStyle = "#000"
      octx.fillRect(0, 0, off.width, off.height)
      octx.fillStyle = "#fff"
      octx.textAlign = "center"
      octx.textBaseline = "middle"
      // Scale font by DPI to keep density consistent
      const pxIdx = font.indexOf("px")
      let px = 64
      if (pxIdx > -1) {
        const before = font.slice(0, pxIdx).trim().split(" ")
        const sizeStr = before[before.length - 1]
        const parsed = Number.parseInt(sizeStr, 10)
        if (!Number.isNaN(parsed)) px = parsed
      }
      const scaledFont = font.replace(/\d+px/, `${Math.round(px * dpi)}px`)
      octx.font = scaledFont
      octx.fillText(text, off.width / 2, off.height / 2)

      // Sample pixels to create particles
      const image = octx.getImageData(0, 0, off.width, off.height).data
      const pts: Particle[] = []
      for (let y = 0; y < off.height; y += density * dpi) {
        for (let x = 0; x < off.width; x += density * dpi) {
          const idx = (y * off.width + x) * 4
          // consider white pixels
          if (image[idx + 0] > 200 && image[idx + 1] > 200 && image[idx + 2] > 200) {
            const jitter = (Math.random() - 0.5) * density * dpi
            pts.push({
              x: x + jitter,
              y: y + jitter,
              bx: x,
              by: y,
              vx: 0,
              vy: 0,
              color,
            })
          }
        }
      }
      particlesRef.current = pts
    }

    const animate = () => {
      const dpi = Math.min(window.devicePixelRatio || 1, 2)
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current
      for (const p of particlesRef.current) {
        // attraction to base point
        const ax = (p.bx - p.x) * 0.04
        const ay = (p.by - p.y) * 0.04

        // repulsion on hover
        if (mouse.active) {
          const dx = p.x - mouse.x * dpi
          const dy = p.y - mouse.y * dpi
          const dist = Math.hypot(dx, dy)
          if (dist < repelRadius * dpi) {
            const f = (repelRadius * dpi - dist) / (repelRadius * dpi)
            const ux = dx / (dist || 1)
            const uy = dy / (dist || 1)
            p.vx += ux * f * 3
            p.vy += uy * f * 3
          }
        }

        p.vx += ax
        p.vy += ay
        p.vx *= 0.92
        p.vy *= 0.92
        p.x += p.vx
        p.y += p.vy

        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, Math.max(1, density * 0.5), Math.max(1, density * 0.5))
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    resize()
    cancelAnimationFrame(frameRef.current ?? 0)
    frameRef.current = requestAnimationFrame(animate)

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }
    const onLeave = () => (mouseRef.current.active = false)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    return () => {
      ro.disconnect()
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(frameRef.current ?? 0)
    }
  }, [text, height, density, color, font, repelRadius])

  return (
    <div ref={containerRef} className={className} aria-label={text}>
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
