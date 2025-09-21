'use client'
import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { MonthlyGamesResponse, ResultSharesResponse } from '@/types'
import { ResultShares } from '../dashboard/ResultShares'

export function ResultSharesCard() {
  const { mode } = useOverview()
  const range = useRangeFromMode()

  const [sharesQ, monthlyQ] = useQueries({
    queries: [
      {
        queryKey: ['overview', 'result-shares', range?.from, range?.to],
        enabled: !!range,
        queryFn: async () => {
          const r = await fetch(`/api/overview/result-shares?from=${range!.from}&to=${range!.to}`)
          if (!r.ok) throw new Error('Failed to load result shares')
          return (await r.json()) as ResultSharesResponse
        },
      },
      {
        queryKey: ['overview', 'monthly-games', range?.from, range?.to],
        enabled: !!range,
        queryFn: async () => {
          const r = await fetch(`/api/overview/monthly-games?from=${range!.from}&to=${range!.to}`)
          if (!r.ok) throw new Error('Failed to load monthly games')
          return (await r.json()) as MonthlyGamesResponse
        },
      },
    ],
  })

  const pending = !range || sharesQ.isPending || monthlyQ.isPending
  const shares = sharesQ.data
  const monthly = monthlyQ.data

  const bar = useMemo(() => {
    if (!shares || !monthly) return { white: 0, draw: 0, black: 0 }
    if (mode === OverviewMode.Last) {
      return shares.points.at(-1) ?? { white: 0, draw: 0, black: 0 }
    }
    const weight = new Map(monthly.points.map((p) => [p.month, p.games]))
    let W = 0, D = 0, B = 0, G = 0
    for (const p of shares.points) {
      const g = weight.get(p.month) ?? 0
      W += p.white * g
      D += p.draw * g
      B += p.black * g
      G += g
    }
    return G > 0
      ? { white: W / G, draw: D / G, black: B / G }
      : { white: 0, draw: 0, black: 0 }
  }, [shares, monthly, mode])

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 min-h-[8.5rem]">
      <div className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Result shares ({mode === OverviewMode.Last ? 'last month' : 'all time'})
      </div>

      {pending || !shares || !monthly ? (
        <div className="h-20 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <ResultShares white={bar.white} draw={bar.draw} black={bar.black} />
      )}
    </div>
  )
}
