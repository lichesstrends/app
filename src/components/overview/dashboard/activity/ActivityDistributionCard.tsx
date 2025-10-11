'use client'
import { useQuery } from '@tanstack/react-query'
import { useOverview, useRangeFromMode, OverviewMode } from '@/contexts/overview/OverviewContext'
import type { ActivityDistributionResponse } from '@/types'
import { ActivityDistribution } from './ActivityDistribution'
import { DashboardCard } from '../DashboardCard'
import { ActivityDistributionInfo } from './ActivityDistributionInfo'

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
    <DashboardCard
      title={`Activity distribution (${mode === OverviewMode.Last ? 'last month' : 'all time'})`}
      info={<ActivityDistributionInfo />}
    >
      <div className="w-full">
        {showSkeleton ? (
          <div className="h-56 animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        ) : showError ? (
          <div className="text-xs text-red-500">Failed to load.</div>
        ) : (
          <ActivityDistribution points={q.data.points} />
        )}
      </div>
    </DashboardCard>
  )
}
