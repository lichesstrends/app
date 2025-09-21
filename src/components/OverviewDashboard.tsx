'use client'

import { useEffect, useMemo, useState } from 'react'
import { TimeToggle, type TimeMode } from './TimeToggle'
import { ActivityDistribution } from './ActivityDistribution'
import { EloHeatmap } from './EloHeatmap'
import { TopOpeningsPanel } from './TopOpeningsPanel'
import { BigNumberCard } from './BigNumberCard'
import { ResultSharesBar } from './ResultSharesBar'
import { LinkCards } from './LinkCards'
import type {
  MinMaxMonths,
  MonthlyGamesResponse,
  ResultSharesResponse,
  TotalGamesResponse,
  ActivityDistributionResponse,
  EloHeatmapResponse,
  TopOpeningsResponse,
  ResultSharePoint,
  MonthlyGamesPoint,
} from '@/types'

export default function OverviewDashboard() {
  const [mode, setMode] = useState<TimeMode>('last')
  const [months, setMonths] = useState<MinMaxMonths | null>(null)

  // per-mode data
  const [total, setTotal] = useState<TotalGamesResponse | null>(null)
  const [shares, setShares] = useState<ResultSharesResponse | null>(null)
  const [monthly, setMonthly] = useState<MonthlyGamesResponse | null>(null)
  const [activity, setActivity] = useState<ActivityDistributionResponse | null>(null)
  const [heatmap, setHeatmap] = useState<EloHeatmapResponse | null>(null)
  const [topN, setTopN] = useState<TopOpeningsResponse | null>(null)

  // 1) fetch available range
  useEffect(() => {
    fetch('/api/meta/months')
      .then((r) => r.json())
      .then((mm: MinMaxMonths) => setMonths(mm))
  }, [])

  // 2) fetch everything that depends on the selected mode (last month vs all time)
  useEffect(() => {
    if (!months) return
    const from = mode === 'last' ? months.maxMonth : months.minMonth
    const to = months.maxMonth

    ;(async () => {
      const [t, s, m, ad, hm, tn] = await Promise.all([
        fetch(`/api/overview/total?from=${from}&to=${to}`).then((r) => r.json()) as Promise<TotalGamesResponse>,
        fetch(`/api/overview/result-shares?from=${from}&to=${to}`).then((r) => r.json()) as Promise<ResultSharesResponse>,
        fetch(`/api/overview/monthly-games?from=${from}&to=${to}`).then((r) => r.json()) as Promise<MonthlyGamesResponse>,
        fetch(`/api/overview/activity-distribution?from=${from}&to=${to}`).then((r) => r.json()) as Promise<ActivityDistributionResponse>,
        fetch(`/api/overview/elo-heatmap?from=${from}&to=${to}`).then((r) => r.json()) as Promise<EloHeatmapResponse>,
        fetch(`/api/overview/top-openings?from=${from}&to=${to}&limit=3`).then((r) => r.json()) as Promise<TopOpeningsResponse>,
      ])
      setTotal(t)
      setShares(s)
      setMonthly(m)
      setActivity(ad)
      setHeatmap(hm)
      setTopN(tn)
    })()
  }, [mode, months])

  // 3) compute the bar values for result shares
  const barShares = useMemo(() => {
    if (!shares || !monthly) return { white: 0, draw: 0, black: 0 }

    // last month: take the last point
    if (mode === 'last') {
      const last = shares.points[shares.points.length - 1] ?? { white: 0, draw: 0, black: 0 }
      return last
    }

    // all time: weighted by monthly game counts
    const weightByMonth = new Map<string, number>(monthly.points.map((p) => [p.month, p.games]))
    let W = 0, D = 0, B = 0, G = 0
    shares.points.forEach((p) => {
      const g = weightByMonth.get(p.month) ?? 0
      W += p.white * g
      D += p.draw * g
      B += p.black * g
      G += g
    })
    if (G <= 0) return { white: 0, draw: 0, black: 0 }
    return { white: W / G, draw: D / G, black: B / G }
  }, [shares, monthly, mode])

  const ready = months && total && shares && monthly && activity && heatmap && topN

  return (
    <div className="space-y-10">
      {/* Header + toggle */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <TimeToggle mode={mode} onChange={setMode} />
      </div>

      {!ready ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-28 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
              <div className="h-28 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-64 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
              <div className="h-64 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
            </div>
          </div>
          <div className="h-[28rem] rounded-2xl bg-slate-200/40 dark:bg-slate-800/40" />
        </div>
      ) : (
        <>
          {/* ===== Row 1 ===== */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Column 1 (two rows) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Row A: total number + result shares bar */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <BigNumberCard
                  title={`Total games (${mode === 'last' ? 'last month' : 'all time'})`}
                  value={total!.totalGames}
                />
                <ResultSharesBar
                  title={`Result shares (${mode === 'last' ? 'last month' : 'all time'})`}
                  white={barShares.white}
                  draw={barShares.draw}
                  black={barShares.black}
                />
              </div>

              {/* Row B: activity distribution + elo heatmap */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Activity distribution ({mode === 'last' ? 'last month' : 'all time'})
                  </div>
                  <div className="mt-2">
                    <ActivityDistribution points={activity!.points} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Elo matchup heatmap ({mode === 'last' ? 'last month' : 'all time'})
                  </div>
                  <div className="mt-2">
                    <EloHeatmap data={heatmap!} logK={1200} />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Top 3 openings stacked */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Top 3 most played openings ({mode === 'last' ? 'last month' : 'all time'})
              </div>
              <div className="mt-3">
                <TopOpeningsPanel data={topN!} />
              </div>
            </div>
          </div>

          {/* ===== Row 2: links ===== */}
          <LinkCards />
        </>
      )}
    </div>
  )
}