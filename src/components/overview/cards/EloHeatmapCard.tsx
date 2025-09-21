'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { EloHeatmapResponse } from '@/types'
import { EloHeatmap } from '../dashboard/EloHeatmap'

export function EloHeatmapCard() {
  const { mode } = useOverview()
  const range = useRangeFromMode()

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
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Elo matchup heatmap ({mode === OverviewMode.Last ? 'last month' : 'all time'})
      </div>
      <div className="mt-2">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : (
          <EloHeatmap data={q.data} logK={9} />
        )}
      </div>
    </div>
  )
}
