'use client'
import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { MonthlyGamesResponse, ResultSharesResponse } from '@/types'
import { DashboardCard } from '../DashboardCard'
import { ResultSharesInfo } from './ResultSharesInfo'
import { ResultsBar } from '@/components/ui/ResultsBar'

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
    return G > 0 ? { white: W / G, draw: D / G, black: B / G } : { white: 0, draw: 0, black: 0 }
  }, [shares, monthly, mode])

  const title = `Result shares (${mode === OverviewMode.Last ? 'last month' : 'all time'})`

  return (
    <DashboardCard title={title} info={<ResultSharesInfo />} minHeightClassName="min-h-[8.5rem]">
      {pending || !shares || !monthly ? (
        <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <ResultsBar white={bar.white} draw={bar.draw} black={bar.black} />
      )}
    </DashboardCard>
  )
}
