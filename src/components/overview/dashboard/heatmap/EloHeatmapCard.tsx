'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import { useMonths } from '@/contexts/meta/MonthsProvider'
import type { EloHeatmapResponse } from '@/types'
import { Heatmap, HeatmapMode } from '@/components/ui/Heatmap'
import { useState } from 'react'
import { DashboardCard } from '../DashboardCard'
import { EloHeatmapInfo } from './EloHeatmapInfo'
import { formatYyyyMmShort } from '@/lib/format'

export function EloHeatmapCard() {
  const range = useRangeFromMode()
  const { mode: overviewMode } = useOverview()
  const { months } = useMonths()
  const [mode, setMode] = useState<HeatmapMode>('matchup')

  const q = useQuery({
    queryKey: ['overview', 'elo-heatmap', range?.from, range?.to],
    enabled: !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/elo-heatmap?from=${range!.from}&to=${range!.to}`)
      if (!r.ok) throw new Error('Failed to load heatmap')
      return (await r.json()) as EloHeatmapResponse
    },
  })

  const showSkeleton = !range || q.isPending || !q.data
  const lastTitle = formatYyyyMmShort(months?.maxMonth)
  const periodLabel = overviewMode === OverviewMode.Last ? lastTitle || 'last month' : 'all time'
  const title =
    mode === 'matchup'
      ? `Elo matchup heatmap (${periodLabel})`
      : `Elo result heatmap (${periodLabel})`

  return (
    <DashboardCard title={title} info={<EloHeatmapInfo mode={mode} />} >
      <div className="w-full">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : (
          <Heatmap data={q.data} logK={1000} mode={mode} onModeChange={setMode} showLegend />
        )}
      </div>
    </DashboardCard>
  )
}
