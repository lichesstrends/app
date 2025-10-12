'use client'

import { useEffect, useState } from 'react'
import type { YearlyBumpResponse } from '@/types'
import { DashboardCard } from '@/components/overview/dashboard/DashboardCard'
import { YearlyBump } from './YearlyBump'

export function YearlyBumpCard() {
  const [bounds, setBounds] = useState<{ min: number; max: number } | null>(null)
  const [from, setFrom] = useState<number | null>(null)
  const [to, setTo] = useState<number | null>(null)
  const [data, setData] = useState<YearlyBumpResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load available years
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch('/api/meta/years')
        if (!r.ok) throw new Error('Failed to load years')
        const j: { minYear: number; maxYear: number } = await r.json()
        setBounds({ min: j.minYear, max: j.maxYear })
        setFrom(j.minYear)
        setTo(j.maxYear)
      } catch (e) {
        setError((e as Error).message)
      }
    })()
  }, [])

  // Load bump data whenever range changes
  useEffect(() => {
    if (from == null || to == null) return
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const r = await fetch(`/api/openings/yearly-bump?top=10&from=${from}&to=${to}`)
        if (!r.ok) throw new Error('Failed to load popularity')
        const j = (await r.json()) as YearlyBumpResponse
        setData(j)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, [from, to])

  const right =
    bounds && (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-300">Years</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
          value={from ?? bounds.min}
          onChange={(e) => setFrom(Number(e.target.value))}
        >
          {Array.from({ length: bounds.max - bounds.min + 1 }, (_, i) => bounds.min + i).map((y) => (
            <option key={`from-${y}`} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="text-slate-500">to</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
          value={to ?? bounds.max}
          onChange={(e) => setTo(Number(e.target.value))}
        >
          {Array.from({ length: bounds.max - bounds.min + 1 }, (_, i) => bounds.min + i).map((y) => (
            <option key={`to-${y}`} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    )

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
      {error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : loading || !data ? (
        <div className="h-[420px] w-full animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
      ) : (
        <YearlyBump data={data} />
      )}
    </DashboardCard>
  )
}