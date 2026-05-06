'use client'
import { useQuery } from '@tanstack/react-query'
import { useRangeFromMode, useOverview, OverviewMode } from '@/contexts/overview/OverviewContext'
import { useMonths } from '@/contexts/meta/MonthsProvider'
import type { LastMonthSummaryResponse, TotalGamesResponse } from '@/types'
import { TotalGames } from './TotalGames'
import { TotalGamesSparkline } from './TotalGamesSparkline'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { DashboardCard } from '../DashboardCard'
import { TotalGamesInfo } from './TotalGamesInfo'
import { formatYyyyMmShort } from '@/lib/format'

export function TotalGamesCard() {
  const range = useRangeFromMode()
  const { mode } = useOverview()
  const { months } = useMonths()

  // Last mode: a single endpoint returns the latest-month total, the previous
  // month, % change, and the 12-month sparkline series in one request.
  const qSummary = useQuery({
    queryKey: ['overview', 'last-month-summary'],
    enabled: mode === OverviewMode.Last,
    queryFn: async () => {
      const r = await fetch('/api/overview/last-month-summary')
      if (!r.ok) throw new Error('Failed to load last-month summary')
      return (await r.json()) as LastMonthSummaryResponse
    },
  })

  const qTotal = useQuery({
    queryKey: ['overview', 'total', range?.from, range?.to],
    enabled: mode === OverviewMode.Ever && !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/total?from=${range!.from}&to=${range!.to}`)
      if (!r.ok) throw new Error('Failed to load totals')
      return (await r.json()) as TotalGamesResponse
    },
  })

  const lastTitle = formatYyyyMmShort(months?.maxMonth ?? qSummary.data?.lastMonth)
  const target =
    mode === OverviewMode.Last ? qSummary.data?.lastGames : qTotal.data?.totalGames
  const loading =
    mode === OverviewMode.Last
      ? qSummary.isPending || !qSummary.data
      : !range || qTotal.isPending || !qTotal.data
  const pctChange =
    mode === OverviewMode.Last && qSummary.data ? qSummary.data.pct : null

  const title = (
    <div className="flex items-center">
      <span>
        Tot​al games ({mode === OverviewMode.Last ? lastTitle || 'last month' : 'all time'})
      </span>
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
            {qSummary.isPending || !qSummary.data ? (
              <div className="h-20 w-full animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/50" />
            ) : (
              <TotalGamesSparkline className="h-20 w-full" series={qSummary.data.series.points} />
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
