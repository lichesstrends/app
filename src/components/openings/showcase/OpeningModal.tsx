'use client'

import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMonths } from '@/contexts/meta/MonthsProvider'
import type { OpeningStatsResponse, YyyyMm } from '@/types'
import { AnimatedMiniBoard } from './AnimatedMiniBoard'
import { ResultsBar } from '@/components/ui/ResultsBar'
import { formatNumber, formatPercent, formatOneIn } from '@/lib/format'

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />
}

function EloDistributionChart({ data }: { data: OpeningStatsResponse['eloDistribution'] }) {
  // Infer bucket step (typically 200)
  const step = useMemo(() => {
    if (data.length < 2) return 200
    const sorted = data.slice().sort((a, b) => a.bucket - b.bucket)
    let best = Number.POSITIVE_INFINITY
    for (let i = 1; i < sorted.length; i++) {
      const d = sorted[i].bucket - sorted[i - 1].bucket
      if (d > 0 && d < best) best = d
    }
    return Number.isFinite(best) ? best : 200
  }, [data])

  const maxPct = Math.max(...data.map((d) => d.pct), 0.01)

  // Format bucket as range (e.g., "1800-1999")
  const formatBucket = (bucket: number) => `${bucket}–${bucket + step - 1}`

  return (
    <div className="space-y-1">
      <div className="flex h-28 items-end gap-0.5">
        {data.map((d) => (
          <div
            key={d.bucket}
            className="group relative flex-1 rounded-t bg-emerald-500 dark:bg-emerald-400 transition-all hover:bg-emerald-600 dark:hover:bg-emerald-300"
            style={{ height: `${(d.pct / maxPct) * 100}%`, minHeight: d.pct > 0 ? 2 : 0 }}
          >
            <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900 pointer-events-none z-10">
              {formatBucket(d.bucket)}: {formatPercent(d.pct)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{data[0] ? formatBucket(data[0].bucket) : ''}</span>
        <span>{data[data.length - 1] ? formatBucket(data[data.length - 1].bucket) : ''}</span>
      </div>
    </div>
  )
}

export function OpeningModal({
  open,
  onClose,
  ecoRange,
  name,
  san,
}: {
  open: boolean
  onClose: () => void
  ecoRange: string
  name: string
  san: string
}) {
  const { months } = useMonths()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const from = months?.minMonth as YyyyMm | undefined
  const to = months?.maxMonth as YyyyMm | undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ['opening-stats', ecoRange, from, to],
    queryFn: async () => {
      const r = await fetch(`/api/openings/stats?eco=${encodeURIComponent(ecoRange)}&from=${from}&to=${to}`)
      if (!r.ok) throw new Error('Failed to load opening stats')
      return (await r.json()) as OpeningStatsResponse
    },
    enabled: open && !!from && !!to && !!ecoRange,
    staleTime: 1000 * 60 * 10,
  })

  // Infer bucket step for range formatting
  const eloStep = useMemo(() => {
    if (!data?.eloDistribution || data.eloDistribution.length < 2) return 200
    const sorted = data.eloDistribution.slice().sort((a, b) => a.bucket - b.bucket)
    let best = Number.POSITIVE_INFINITY
    for (let i = 1; i < sorted.length; i++) {
      const d = sorted[i].bucket - sorted[i - 1].bucket
      if (d > 0 && d < best) best = d
    }
    return Number.isFinite(best) ? best : 200
  }, [data?.eloDistribution])

  const mostCommonElo = useMemo(() => {
    if (!data?.eloDistribution?.length) return '—'
    const best = data.eloDistribution.reduce((a, b) => (b.pct > a.pct ? b : a), data.eloDistribution[0])
    if (!best) return '—'
    return `${best.bucket}–${best.bucket + eloStep - 1}`
  }, [data?.eloDistribution, eloStep])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <AnimatedMiniBoard san={san} playing={true} moveIntervalMs={500} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{name}</h3>
                <div className="mt-1">
                  <span className="inline-flex select-none items-center rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {ecoRange}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {isLoading && (
              <div className="mt-3 flex gap-6">
                <SkeletonBlock className="h-10 w-20" />
                <SkeletonBlock className="h-10 w-20" />
                <SkeletonBlock className="h-10 w-20" />
              </div>
            )}
            {data && (
              <div className="mt-3 flex gap-6">
                <MiniStat label="Total Games" value={formatNumber(data.totalGames)} />
                <MiniStat label="Share" value={formatPercent(data.share)} />
                <MiniStat label="One in" value={formatOneIn(data.share)} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              Failed to load opening statistics. Please try again.
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              <SkeletonBlock className="h-20 w-full" />
              <SkeletonBlock className="h-28 w-full" />
            </div>
          )}

          {data && (
            <div className="space-y-6">
              {/* Result Distribution - needs vertical padding for external labels */}
              <div>
                <h4 className="mb-8 text-sm font-medium text-slate-700 dark:text-slate-300">Result Distribution</h4>
                <ResultsBar white={data.resultsAggregate.white} draw={data.resultsAggregate.draw} black={data.resultsAggregate.black} />
              </div>

              {/* Player Elo Distribution */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Player Elo Distribution</h4>
                <EloDistributionChart data={data.eloDistribution} />
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  Most common: <span className="font-medium text-slate-700 dark:text-slate-200">{mostCommonElo}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
