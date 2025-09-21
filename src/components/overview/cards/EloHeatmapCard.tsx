'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { EloHeatmapResponse } from '@/types'
import { EloHeatmap } from '../dashboard/EloHeatmap'
import { useState } from 'react'
import { HelpTip } from '@/components/ui/HelpTip'  // ← add

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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* header + help */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
        <HelpTip>
          {mode === 'matchup' ? (
            <>
              <div className="font-medium mb-1">Matchups mode</div>
              <p>Color shows game <strong>density</strong> for White (X) vs Black (Y) Elo buckets. Grey = no games.</p>
            </>
          ) : (
            <>
              <div className="font-medium mb-1">Results mode</div>
              <p>Color tilts toward <strong>white</strong> (green) or <strong>black</strong> (red) advantage in each bucket pair.
                 Grey = no games. Hover a cell for the W/D/B breakdown.</p>
            </>
          )}
        </HelpTip>
      </div>

      <div className="mt-2">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : (
          <EloHeatmap data={q.data} logK={1000} mode={mode} onModeChange={setMode} />
        )}
      </div>
    </div>
  )
}
