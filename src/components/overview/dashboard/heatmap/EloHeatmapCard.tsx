'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { EloHeatmapResponse } from '@/types'
import { EloHeatmap } from './EloHeatmap'
import { useState } from 'react'
import { DashboardCard } from '../DashboardCard'

type Mode = 'matchup' | 'result'

export function EloHeatmapCard() {
  const range = useRangeFromMode()
  const { mode: overviewMode } = useOverview()
  const [mode, setMode] = useState<Mode>('matchup')

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
  const title =
    mode === 'matchup'
      ? `Elo matchup heatmap (${overviewMode === OverviewMode.Last ? 'last month' : 'all time'})`
      : `Elo result heatmap (${overviewMode === OverviewMode.Last ? 'last month' : 'all time'})`

  const info =
    mode === 'matchup' ? (
      <>
        <div className="mb-1 font-medium">Matchups mode</div>
        <p className="mb-0">
          Color shows game <strong>density</strong> for White (X) vs Black (Y) Elo buckets. Grey = no games.
        </p>
      </>
    ) : (
      <>
        <div className="mb-1 font-medium">Results mode</div>
        <p className="mb-0">
          Color tilts toward <strong>white</strong> (green) or <strong>black</strong> (red) advantage in each bucket pair.
          Grey = no games. Hover a cell for the W/D/B breakdown.
        </p>
      </>
    )

  return (
    <DashboardCard title={title} info={info}>
      <div className="w-full">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : (
          <EloHeatmap data={q.data} logK={1000} mode={mode} onModeChange={setMode} />
        )}
      </div>
    </DashboardCard>
  )
}
