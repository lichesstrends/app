'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { YearlyBumpResponse } from '@/types'
import { DashboardCard } from '@/components/overview/dashboard/DashboardCard'
import { YearRangeFilters } from '@/components/ui/YearRangeFilters'
import { YearlyBump } from './YearlyBump'

type YearBounds = { minYear: number; maxYear: number }

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export function YearlyBumpCard() {
  const yearsQuery = useQuery({
    queryKey: ['meta', 'years'],
    queryFn: async () => {
      const r = await fetch('/api/meta/years')
      if (!r.ok) throw new Error('Failed to load years')
      return (await r.json()) as YearBounds
    },
    staleTime: ONE_DAY_MS,
  })

  const bounds = yearsQuery.data
  const [from, setFrom] = useState<number | null>(null)
  const [to, setTo] = useState<number | null>(null)

  const effectiveFrom = from ?? bounds?.minYear
  const effectiveTo = to ?? bounds?.maxYear

  const bumpQuery = useQuery({
    queryKey: ['openings', 'yearly-bump', effectiveFrom, effectiveTo],
    enabled: effectiveFrom != null && effectiveTo != null,
    queryFn: async () => {
      const r = await fetch(
        `/api/openings/yearly-bump?top=10&from=${effectiveFrom}&to=${effectiveTo}`,
      )
      if (!r.ok) throw new Error('Failed to load popularity')
      return (await r.json()) as YearlyBumpResponse
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const right =
    bounds && effectiveFrom != null && effectiveTo != null ? (
      <YearRangeFilters
        fromYear={effectiveFrom}
        toYear={effectiveTo}
        minYear={bounds.minYear}
        maxYear={bounds.maxYear}
        onFromChange={setFrom}
        onToChange={setTo}
        fromLabel="Years"
      />
    ) : null

  const showSkeleton = yearsQuery.isPending || bumpQuery.isPending || !bumpQuery.data
  const showError = yearsQuery.isError || bumpQuery.isError
  const errorMessage = yearsQuery.error?.message || bumpQuery.error?.message

  return (
    <DashboardCard
      title="Most popular openings by year"
      right={right}
      info={
        <p className="mb-0 text-xs">
          Rank per year is computed by total games. A line appears only in years where the opening
          family is inside the Top-10.
        </p>
      }
      minHeightClassName="min-h-[28rem]"
    >
      {showError ? (
        <div className="text-xs text-red-500">{errorMessage}</div>
      ) : showSkeleton ? (
        <div className="h-[420px] w-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <div className="overflow-x-auto">
          <YearlyBump data={bumpQuery.data} />
        </div>
      )}
    </DashboardCard>
  )
}
