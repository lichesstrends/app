'use client'
import { useRef, useState } from 'react'

type SegKey = 'white' | 'draw' | 'black'

export function ResultsBar({
  white,
  draw,
  black,
}: {
  white: number
  draw: number
  black: number
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [tip, setTip] = useState<{ key: SegKey; label: string; pct: number; x: number } | null>(null)

  // Normalize -> percentages
  const w = Math.max(0, Math.min(1, white))
  const d = Math.max(0, Math.min(1, draw))
  const b = Math.max(0, Math.min(1, black))
  const total = w + d + b || 1
  const W = (w / total) * 100
  const D = (d / total) * 100
  const B = (b / total) * 100

  const segments = [
    { key: 'white' as SegKey, pct: W, label: 'White wins', className: 'bg-white dark:bg-slate-200' },
    { key: 'draw' as SegKey, pct: D, label: 'Draws', className: 'bg-slate-400 dark:bg-slate-500' },
    { key: 'black' as SegKey, pct: B, label: 'Black wins', className: 'bg-neutral-900 dark:bg-black' },
  ]

  const onEnterOrMove = (e: React.MouseEvent, key: SegKey, label: string, pct: number) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const x = e.clientX - rect.left
    setTip({ key, label, pct, x })
  }

  const onLeave = () => setTip(null)

  // Helper: compute label position (center of each segment)
  const positions = {
    white: W / 2,
    draw: W + D / 2,
    black: W + D + B / 2,
  }

  return (
    <div ref={wrapRef} className="relative flex w-full items-center">
      {/* Bar */}
      <div className="relative h-8 w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex h-full w-full">
          {segments.map(({ key, pct, label, className }) => (
            <div
              key={key}
              className={`h-full transition-opacity ${className}`}
              style={{ width: `${pct}%`, opacity: tip && tip.key !== key ? 0.45 : 1 }}
              onMouseEnter={(e) => onEnterOrMove(e, key, label, pct)}
              onMouseMove={(e) => onEnterOrMove(e, key, label, pct)}
              onMouseLeave={onLeave}
              title=""
            />
          ))}
        </div>
      </div>

      {/* External labels with connectors */}
      <div className="absolute inset-0 pointer-events-none">
        {/* White top */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: `${positions.white}%`, top: '-1.5rem', transform: 'translateX(-50%)' }}
        >
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">White</div>
          <div className="w-px h-4 bg-slate-400 dark:bg-slate-500" />
        </div>

        {/* Draw bottom */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: `${positions.draw}%`, bottom: '-1.5rem', transform: 'translateX(-50%)' }}
        >
          <div className="w-px h-4 bg-slate-400 dark:bg-slate-500" />
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Draw</div>
        </div>

        {/* Black top */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: `${positions.black}%`, top: '-1.5rem', transform: 'translateX(-50%)' }}
        >
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Black</div>
          <div className="w-px h-4 bg-slate-400 dark:bg-slate-500" />
        </div>
      </div>

      {/* Floating tooltip */}
      {tip && (
        <div
          className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-10 -translate-x-1/2"
          style={{ transform: `translateX(${tip.x}px) translateX(-50%)` }}
        >
          <div className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <div className="font-medium">{tip.label}</div>
            <div>{tip.pct.toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  )
}
