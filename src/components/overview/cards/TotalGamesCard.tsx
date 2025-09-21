'use client'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRangeFromMode, useOverview, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { TotalGamesResponse } from '@/types'

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

export function TotalGamesCard() {
  const range = useRangeFromMode()
  const { mode } = useOverview()

  const q = useQuery({
    queryKey: ['overview', 'total', range?.from, range?.to],
    enabled: !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/total?from=${range!.from}&to=${range!.to}`)
      if (!r.ok) throw new Error('Failed to load totals')
      return (await r.json()) as TotalGamesResponse
    },
  })

  const target = q.data?.totalGames ?? 0
  const [display, setDisplay] = useState(target)
  const prevRef = useRef<number>(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
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
  }, [target])

  const showSkeleton = !range || q.isPending || !q.data

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-center text-sm text-slate-600 dark:text-slate-300">
        Total games ({mode === OverviewMode.Last ? 'last month' : 'all time'})
      </div>
      <div className="mt-2 flex min-h-[3.2rem] items-center justify-center text-4xl font-semibold tabular-nums">
        {showSkeleton ? '—' : display.toLocaleString()}
      </div>
    </div>
  )
}
