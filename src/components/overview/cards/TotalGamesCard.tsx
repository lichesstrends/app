'use client'
import { useQuery } from '@tanstack/react-query'
import { useRangeFromMode, useOverview, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { TotalGamesResponse, MonthlyGamesResponse } from '@/types'
import { TotalGames } from '../dashboard/TotalGames'
import { TotalGamesSparkline } from '../dashboard/TotalGamesSparkline'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export function TotalGamesCard() {
  const range = useRangeFromMode()
  const { mode } = useOverview()

  const qTotal = useQuery({
    queryKey: ['overview', 'total', range?.from, range?.to],
    enabled: !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/total?from=${range!.from}&to=${range!.to}`)
      if (!r.ok) throw new Error('Failed to load totals')
      return (await r.json()) as TotalGamesResponse
    },
  })

  const qSeries = useQuery({
    queryKey: ['overview', 'monthly-12'],
    enabled: mode === OverviewMode.Last,
    queryFn: async () => {
      const r = await fetch(`/api/overview/monthly-games?from=2010-01&to=2999-12`)
      if (!r.ok) throw new Error('Failed to load monthly games')
      return (await r.json()) as MonthlyGamesResponse
    },
  })

  const target = qTotal.data?.totalGames
  const loading = !range || qTotal.isPending || !qTotal.data

  // % change vs previous month
  let pctChange: number | null = null
  if (mode === OverviewMode.Last && qSeries.data?.points.length) {
    const last = qSeries.data.points.at(-1)?.games ?? 0
    const prev = qSeries.data.points.at(-2)?.games ?? 0
    if (prev > 0) pctChange = (last - prev) / prev
  }

  return (
  <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 min-h-[10rem]">
    {/* Header */}
    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
      <div className="flex items-center">
        <span>
          Total games ({mode === OverviewMode.Last ? 'last month' : 'all time'})
        </span>
        {mode === OverviewMode.Last && pctChange !== null && (
          <span
            className={`ml-2 flex items-center gap-1 font-medium ${
              pctChange >= 0 ? 'text-sky-500' : 'text-red-500'
            }`}
          >
            {pctChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {(pctChange * 100).toFixed(1)}%
          </span>
        )}
      </div>

      {mode === OverviewMode.Ever && qTotal.data?.from && (
        <div className="rounded-full bg-slate-200/60 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
          since{' '}
          {new Date(qTotal.data.from + '-01').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          })}
        </div>
      )}
    </div>

    {/* Body */}
    <div className="flex flex-1 items-center justify-between gap-4">
      <div
        className={`flex-1 flex ${
          mode === OverviewMode.Ever ? 'justify-center items-center' : 'items-center'
        }`}
      >
        <div className="text-4xl font-semibold tabular-nums">
          <TotalGames value={target} loading={loading} />
        </div>
      </div>

      {mode === OverviewMode.Last && (
        <div className="flex h-20 items-center">
          {qSeries.isPending || !qSeries.data ? (
            <div className="h-12 w-28 animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/50" />
          ) : (
            <TotalGamesSparkline series={qSeries.data.points.slice(-12)} />
          )}
        </div>
      )}
    </div>
  </div>
  )
}
