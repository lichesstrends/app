'use client'
import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function TotalGames({
  value,
  loading,
}: {
  value?: number
  loading?: boolean
}) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (loading || value === undefined) return

    const from = prevRef.current
    const to = value
    const start = performance.now()
    const dur = 900

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = easeOutCubic(t)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        prevRef.current = to
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, loading])

  if (loading || value === undefined) {
    return <span className="animate-pulse text-slate-400 dark:text-slate-600">0</span>
  }

  return <>{(display).toLocaleString()}</>
}
