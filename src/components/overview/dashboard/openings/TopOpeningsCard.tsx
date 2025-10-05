'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { TopOpeningsResponse } from '@/types'
import { TopOpeningsPanel } from './TopOpeningsPanel'

export function TopOpeningsCard() {
  const { mode } = useOverview()
  const range = useRangeFromMode()

  const q = useQuery({
    queryKey: ['overview', 'top-openings', range?.from, range?.to, 3],
    enabled: !!range,
    queryFn: async () => {
      const r = await fetch(`/api/overview/top-openings?from=${range!.from}&to=${range!.to}&limit=3`)
      if (!r.ok) throw new Error('Failed to load top openings')
      return (await r.json()) as TopOpeningsResponse
    },
  })

  const showSkeleton = !range || q.isPending || !q.data

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Top 3 most played openings ({mode === OverviewMode.Last ? 'last month' : 'all time'})
      </div>
      <div className="mt-3 flex-1">
        {showSkeleton ? (
          <div className="h-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : (
          <TopOpeningsPanel data={q.data} />
        )}
      </div>
    </div>
  )
}
