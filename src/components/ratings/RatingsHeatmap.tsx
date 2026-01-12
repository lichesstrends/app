'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heatmap, HeatmapMode } from '@/components/ui/Heatmap'
import { DashboardCard } from '@/components/overview/dashboard/DashboardCard'
import type { EloHeatmapResponse } from '@/types'
import { getAllEcoFamilies, type EcoFamily } from '@/lib/eco'

function YearSelect({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 dark:text-slate-300">{label}</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

function OpeningSelect({
  value,
  onChange,
  families,
}: {
  value: string
  onChange: (v: string) => void
  families: EcoFamily[]
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 dark:text-slate-300">Opening</span>
      <select
        className="max-w-[180px] truncate rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All openings</option>
        {families.map((f) => (
          <option key={f.range} value={f.range}>
            {f.label} ({f.range})
          </option>
        ))}
      </select>
    </div>
  )
}

export function RatingsHeatmap() {
  const families = getAllEcoFamilies()
  const [bounds, setBounds] = useState<{ min: number; max: number } | null>(null)
  const [fromYear, setFromYear] = useState<number | null>(null)
  const [toYear, setToYear] = useState<number | null>(null)
  const [eco, setEco] = useState('')
  const [mode, setMode] = useState<HeatmapMode>('matchup')

  // Load available years
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch('/api/meta/years')
        if (!r.ok) throw new Error('Failed to load years')
        const j: { minYear: number; maxYear: number } = await r.json()
        setBounds({ min: j.minYear, max: j.maxYear })
        setFromYear(j.minYear)
        setToYear(j.maxYear)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const { data, isPending, error } = useQuery({
    queryKey: ['ratings', 'elo-heatmap', fromYear, toYear, eco],
    queryFn: async () => {
      const params = new URLSearchParams({
        fromYear: String(fromYear),
        toYear: String(toYear),
      })
      if (eco) params.set('eco', eco)
      const r = await fetch(`/api/ratings/elo-heatmap?${params}`)
      if (!r.ok) throw new Error('Failed to load heatmap')
      return (await r.json()) as EloHeatmapResponse
    },
    enabled: fromYear !== null && toYear !== null,
    staleTime: 1000 * 60 * 5,
  })

  const selectedOpening = eco ? families.find((f) => f.range === eco)?.label : null

  const title = selectedOpening
    ? `Elo matchup heatmap – ${selectedOpening}`
    : 'Elo matchup heatmap'

  const filters = bounds && fromYear !== null && toYear !== null && (
    <div className="flex flex-wrap items-center gap-3">
      <YearSelect value={fromYear} onChange={setFromYear} min={bounds.min} max={toYear} label="From" />
      <YearSelect value={toYear} onChange={setToYear} min={fromYear} max={bounds.max} label="to" />
      <OpeningSelect value={eco} onChange={setEco} families={families} />
    </div>
  )

  return (
    <DashboardCard
      title={title}
      right={filters}
      info={
        <p className="mb-0 text-xs">
          Heatmap showing game frequency between different Elo rating buckets.
          {eco && ' Filtered by the selected opening family.'}
          {' '}Switch between Matchups (density) and Results (white/black advantage) views.
        </p>
      }
      minHeightClassName="min-h-[32rem]"
    >
      {error ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-xs text-red-500">Failed to load heatmap data.</div>
        </div>
      ) : isPending || !data ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="aspect-square w-full max-w-[500px] animate-pulse rounded-xl bg-slate-200/40 dark:bg-slate-800/40" />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <Heatmap data={data} mode={mode} onModeChange={setMode} showLegend />
          </div>
        </div>
      )}
    </DashboardCard>
  )
}
