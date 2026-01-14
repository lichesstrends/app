'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { YearlyBumpResponse } from '@/types'
import { DashboardCard } from '@/components/overview/dashboard/DashboardCard'
import { YearlyBump } from './YearlyBump'

type YearBounds = { minYear: number; maxYear: number }

export function YearlyBumpCard() {
  // Fetch available years (cached)
  const yearsQuery = useQuery({
    queryKey: ['meta', 'years'],
    queryFn: async () => {
      const r = await fetch('/api/meta/years')
      if (!r.ok) throw new Error('Failed to load years')
      return (await r.json()) as YearBounds
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const bounds = yearsQuery.data
  const [from, setFrom] = useState<number | null>(null)
  const [to, setTo] = useState<number | null>(null)

  // Use bounds as defaults when available
  const effectiveFrom = from ?? bounds?.minYear
  const effectiveTo = to ?? bounds?.maxYear

  // Fetch bump data (cached per range)
  const bumpQuery = useQuery({
    queryKey: ['openings', 'yearly-bump', effectiveFrom, effectiveTo],
    enabled: effectiveFrom != null && effectiveTo != null,
    queryFn: async () => {
      const r = await fetch(`/api/openings/yearly-bump?top=10&from=${effectiveFrom}&to=${effectiveTo}`)
      if (!r.ok) throw new Error('Failed to load popularity')
      return (await r.json()) as YearlyBumpResponse
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
  })

  const right =
    bounds && (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-300">Years</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
          value={effectiveFrom ?? bounds.minYear}
          onChange={(e) => setFrom(Number(e.target.value))}
        >
          {Array.from({ length: bounds.maxYear - bounds.minYear + 1 }, (_, i) => bounds.minYear + i).map((y) => (
            <option key={`from-${y}`} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="text-slate-500">to</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
          value={effectiveTo ?? bounds.maxYear}
          onChange={(e) => setTo(Number(e.target.value))}
        >
          {Array.from({ length: bounds.maxYear - bounds.minYear + 1 }, (_, i) => bounds.minYear + i).map((y) => (
            <option key={`to-${y}`} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    )

  const showSkeleton = yearsQuery.isPending || bumpQuery.isPending || !bumpQuery.data
  const showError = yearsQuery.isError || bumpQuery.isError
  const errorMessage = yearsQuery.error?.message || bumpQuery.error?.message

  return (
    <DashboardCard
      title="Most popular openings by year"
      right={right}
      info={
        <p className="mb-0 text-xs">
          Rank per year is computed by total games. A line appears only in years where the opening family is inside the
          Top-10.
        </p>
      }
      minHeightClassName="min-h-[28rem]"
    >
      {showError ? (
        <div className="text-xs text-red-500">{errorMessage}</div>
      ) : showSkeleton ? (
        <div className="h-[420px] w-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <YearlyBump data={bumpQuery.data} />
      )}
    </DashboardCard>
  )
}