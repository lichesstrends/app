'use client'
import { useQuery } from '@tanstack/react-query'
import { useRangeFromMode, useOverview, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { TotalGamesResponse, MonthlyGamesResponse } from '@/types'
import { TotalGames } from './TotalGames'
import { TotalGamesSparkline } from './TotalGamesSparkline'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { DashboardCard } from '../DashboardCard'
import { TotalGamesInfo } from './TotalGamesInfo'

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

  let pctChange: number | null = null
  if (mode === OverviewMode.Last && qSeries.data?.points.length) {
    const last = qSeries.data.points.at(-1)?.games ?? 0
    const prev = qSeries.data.points.at(-2)?.games ?? 0
    if (prev > 0) pctChange = (last - prev) / prev
  }

  const title = (
    <div className="flex items-center">
      <span>Tot​al games ({mode === OverviewMode.Last ? 'last month' : 'all time'})</span>
      {mode === OverviewMode.Last && pctChange !== null && (
        <span
          className={`ml-2 flex items-center gap-1 text-sm font-medium ${
            pctChange >= 0 ? 'text-sky-500' : 'text-red-500'
          }`}
        >
          {pctChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {(pctChange * 100).toFixed(1)}%
        </span>
      )}
    </div>
  )

  const right =
    mode === OverviewMode.Ever && qTotal.data?.from ? (
      <div className="rounded-full bg-slate-200/60 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
        since {new Date(qTotal.data.from + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </div>
    ) : null

  return (
    <DashboardCard title={title} right={right} info={<TotalGamesInfo mode={mode} />} minHeightClassName="min-h-[10rem]">
      {mode === OverviewMode.Last ? (
        <div className="flex w-full items-center gap-4">
          <div
            className="basis-2/3 min-w-0 flex items-center justify-center"
            style={{ containerType: 'inline-size', containerName: 'num' }}
          >
            <span
              className="tabular-nums font-semibold leading-none block"
              style={{ fontSize: 'clamp(2rem, 15cqi, 4rem)', whiteSpace: 'nowrap' }}
            >
              <TotalGames value={target} loading={loading} />
            </span>
          </div>
          <div className="basis-1/3">
            {qSeries.isPending || !qSeries.data ? (
              <div className="h-20 w-full animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/50" />
            ) : (
              <TotalGamesSparkline className="h-20 w-full" series={qSeries.data.points.slice(-12)} />
            )}
          </div>
        </div>
      ) : (
        <div
          className="flex w-full items-center justify-center"
          style={{ containerType: 'inline-size', containerName: 'num' }}
        >
          <span
            className="tabular-nums font-semibold leading-none block"
            style={{ fontSize: 'clamp(1.75rem, 12cqi, 3.25rem)', whiteSpace: 'nowrap' }}
          >
            <TotalGames value={target} loading={loading} />
          </span>
        </div>
      )}
    </DashboardCard>
  )
}
