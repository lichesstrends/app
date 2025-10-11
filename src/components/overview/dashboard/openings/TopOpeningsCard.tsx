'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { TopOpeningsResponse } from '@/types'
import { TopOpeningsPanel } from './TopOpeningsPanel'
import { DashboardCard } from '../DashboardCard'
import { TopOpeningsInfo } from './TopOpeningsInfo'

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
  const title = `Top 3 openings (${mode === OverviewMode.Last ? 'last month' : 'all time'})`

  return (
    <DashboardCard title={title} info={<TopOpeningsInfo />}>
      {showSkeleton ? (
        <div className="h-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <TopOpeningsPanel data={q.data} />
      )}
    </DashboardCard>
  )
}
