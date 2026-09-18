import { useEffect, useRef } from 'react'

/**
 * Interactive constellation canvas (hero background).
 * Particles drift, connect with faint lines and gently repel the cursor.
 * Re-initialises when the theme changes; honours prefers-reduced-motion.
 */
export default function ParticleCanvas({ theme }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cs = getComputedStyle(document.documentElement)
    const dotColor = cs.getPropertyValue('--canvas-dot').trim() || 'rgba(125,211,252,0.85)'
    const lineColor = cs.getPropertyValue('--canvas-line').trim() || 'rgba(56,189,248,0.25)'

    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: -9e3, y: -9e3 }

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * DPR))
      canvas.height = Math.max(1, Math.round(h * DPR))
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()

    const count = Math.max(36, Math.min(120, Math.round((w * h) / 15000)))
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < parts.length; i += 1) {
        const a = parts[i]
        for (let j = i + 1; j < parts.length; j += 1) {
          const b = parts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 12100) {
            const o = 1 - Math.sqrt(d2) / 110
            ctx.globalAlpha = o * 0.5
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = dotColor
      for (const p of parts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const p of parts) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 19600 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = ((140 - d) / 140) * 0.55
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.x += p.vx
        p.y += p.vy
        p.vx = Math.max(-1.2, Math.min(1.2, p.vx * 0.985))
        p.vy = Math.max(-1.2, Math.min(1.2, p.vy * 0.985))
        if (p.x < -24) p.x = w + 24
        else if (p.x > w + 24) p.x = -24
        if (p.y < -24) p.y = h + 24
        else if (p.y > h + 24) p.y = -24
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9e3
      mouse.y = -9e3
    }
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else if (!reduced) raf = requestAnimationFrame(step)
    }

    if (reduced) {
      draw()
    } else {
      raf = requestAnimationFrame(step)
      window.addEventListener('mousemove', onMove)
      window.addEventListener('resize', resize)
      canvas.addEventListener('mouseleave', onLeave)
      document.addEventListener('visibilitychange', onVis)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [theme])

  return <canvas ref={ref} className="particle-canvas" aria-hidden="true" />
}
