'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { ActivityDistributionResponse } from '@/types'
import { ActivityDistribution } from '../dashboard/ActivityDistribution'
import { HelpTip } from '@/components/ui/HelpTip'  // ← add

export function ActivityDistributionCard() {
  const { mode } = useOverview()
  const range = useRangeFromMode()

  const q = useQuery({
    queryKey: ['overview', 'activity', range?.from, range?.to],
    enabled: !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/activity-distribution?from=${range!.from}&to=${range!.to}`)
      if (!r.ok) throw new Error('Failed to load activity distribution')
      return (await r.json()) as ActivityDistributionResponse
    },
  })

  const showSkeleton = !range || q.isPending || !q.data
  const showError = q.isError

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* header + help */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm text-slate-600 dark:text-slate-300">
          Activity distribution ({mode === OverviewMode.Last ? 'last month' : 'all time'})
        </div>
        <HelpTip>
          <div className="font-medium mb-1">What is this?</div>
          <p>
            Percentage of games contributed by each <strong>Elo bucket</strong> during the selected period.
            Each game counts twice (once for White and once for Black). Bars sum to 100%.
          </p>
        </HelpTip>
      </div>

      <div className="mt-2">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : showError ? (
          <div className="text-xs text-red-500">Failed to load.</div>
        ) : (
          <ActivityDistribution points={q.data.points} />
        )}
      </div>
    </div>
  )
}
