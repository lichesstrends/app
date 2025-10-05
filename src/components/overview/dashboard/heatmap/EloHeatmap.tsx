'use client'
import { EloHeatmapResponse } from '@/types'
import { useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { axisLabelCls } from '@/lib/chartStyles'

export type HeatMode = 'matchup' | 'result'

/** 0..1 remap with log-like compression. logK=0 => linear. */
function makeLogTransform(logK: number) {
  if (!(logK > 1e-9)) return (r: number) => Math.max(0, Math.min(1, r))
  const denom = Math.log1p(logK)
  return (r: number) => Math.log1p(logK * Math.max(0, Math.min(1, r))) / denom
}

/** 0..1 → red→yellow→green with variable alpha */
function rampColor(t01: number, alphaBase = 0.25, alphaGain = 0.7) {
  const t = Math.max(0, Math.min(1, t01))
  const hue = Math.round(120 * t) // 0=red → 120=green
  const alpha = alphaBase + alphaGain * t
  return `hsl(${hue} 85% 45% / ${alpha})`
}

export function EloHeatmap({
  data,
  logK = 9,
  mode,
  onModeChange,
  initialMode = 'matchup',
}: {
  data: EloHeatmapResponse
  logK?: number
  mode?: HeatMode
  onModeChange?: (m: HeatMode) => void
  initialMode?: HeatMode
}) {
  // Controlled/uncontrolled
  const [inner, setInner] = useState<HeatMode>(initialMode)
  const m = mode ?? inner
  const setMode = (nm: HeatMode) => {
    // make the switch feel instant (no debounce, no async)
    if (!mode) setInner(nm)
    onModeChange?.(nm)
  }

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const NEUTRAL = isDark
    ? 'hsl(215 16% 24% / 0.35)' // dark mode: subtle grey
    : 'hsl(215 20% 92% / 0.8)'  // light mode: much lighter neutral

  // Index cells + max for density
  const { idx, maxGames } = useMemo(() => {
    const m = new Map<string, (typeof data.cells)[number]>()
    let mg = 0
    for (const c of data.cells) {
      const key = `${c.whiteBucket}:${c.blackBucket}`
      m.set(key, c)
      if (c.games > mg) mg = c.games
    }
    return { idx: m, maxGames: Math.max(1, mg) }
  }, [data])

  // X axis = WHITE buckets, Y axis = BLACK buckets
  const xBuckets = data.buckets.slice() // white → left→right
  const yBuckets = data.buckets.slice().reverse() // black → low at bottom (flip vertically)

  // Step for Elo range in tooltips (fallback 200)
  const step = useMemo(() => {
    if (data.buckets.length < 2) return 200
    let best = Number.POSITIVE_INFINITY
    for (let i = 1; i < data.buckets.length; i++) {
      const d = data.buckets[i] - data.buckets[i - 1]
      if (d > 0 && d < best) best = d
    }
    return Number.isFinite(best) ? best : 200
  }, [data.buckets])

  const tDensity = useMemo(() => makeLogTransform(logK), [logK])

  // Tooltip theming
  const tipBg     = isDark ? 'rgba(2,6,23,0.92)' : 'rgba(255,255,255,0.98)'
  const tipText   = isDark ? '#e5e7eb' : '#0f172a'
  const tipBorder = isDark ? '1px solid rgba(148,163,184,.35)' : '1px solid rgba(148,163,184,.45)'
  const divider   = isDark ? 'rgba(148,163,184,.35)' : 'rgba(148,163,184,.45)'

  return (
    <div className="flex gap-3">
      {/* Heatmap + axis labels */}
      <div className="flex-1">
        <div className="grid grid-cols-[auto_1fr] items-stretch gap-2">
          {/* Y label (BLACK goes bottom→top) */}
          <div className="flex items-center justify-center">
            <div className={`${axisLabelCls} rotate-180 [writing-mode:vertical-rl]`}>
              Black Elo bucket
            </div>
          </div>

          {/* Grid */}
          <div>
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${xBuckets.length}, minmax(0,1fr))`,
                gridAutoRows: '1fr',
                aspectRatio: '1 / 1',
                gap: '2px',
              }}
            >
              {yBuckets.map((bb) =>
                xBuckets.map((wb) => {
                  const cell = idx.get(`${wb}:${bb}`)
                  const g = Number(cell?.games ?? 0)
                  const ww = Number(cell?.whiteWins ?? 0)
                  const bw = Number(cell?.blackWins ?? 0)
                  const dr = Number(cell?.draws ?? 0)

                  let color = NEUTRAL
                  if (g > 0) {
                    if (m === 'matchup') {
                      color = rampColor(tDensity(g / maxGames), 0.25, 0.7)
                    } else {
                      const balance01 = ((ww - bw) / g + 1) / 2
                      const decisiveness = 1 - dr / g
                      color = rampColor(balance01, 0.35, 0.5 + 0.3 * decisiveness)
                    }
                  }

                  const loW = wb, hiW = wb + step - 1
                  const loB = bb, hiB = bb + step - 1
                  const pct  = data.totalGames > 0 ? (g / data.totalGames) * 100 : 0
                  const wPct = g ? (ww / g) * 100 : 0
                  const dPct = g ? (dr / g) * 100 : 0
                  const bPct = g ? (bw / g) * 100 : 0

                  return (
                    <div key={`${wb}-${bb}`} className="group relative">
                      <div className="h-full w-full rounded-[3px]" style={{ background: color }} />

                      {/* Tooltip (theme-aware, with separator; result icons are white/grey/black) */}
                      <div
                        className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 w-60 -translate-y-1/2 rounded-lg p-3 opacity-0 shadow-sm ring-1 transition-opacity duration-75 group-hover:opacity-100"
                        style={{ background: tipBg, color: tipText, border: tipBorder }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-medium">White Elo</div>
                          <div className="tabular-nums">{loW}–{hiW}</div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-medium">Black Elo</div>
                          <div className="tabular-nums">{loB}–{hiB}</div>
                        </div>

                        <div className="my-2 h-px w-full" style={{ background: divider }} />

                        {m === 'matchup' ? (
                          <div className="mt-1 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="inline-block h-3 w-3 rounded-[3px]" style={{ background: color }} />
                              <span>Games</span>
                            </div>
                            <div className="tabular-nums">
                              {g.toLocaleString()} ({pct.toFixed(2)}%)
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-3 w-3 rounded-[3px] ring-1 ring-slate-400"
                                  style={{ background: '#ffffff' }}
                                />
                                <span>White</span>
                              </div>
                              <div className="tabular-nums">{wPct.toFixed(1)}% ({ww.toLocaleString()})</div>
                            </div>
                            <div className="flex items-center justify-between opacity-95">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-3 w-3 rounded-[3px] ring-1 ring-slate-400"
                                  style={{ background: '#9ca3af' }} // neutral grey
                                />
                                <span>Draw</span>
                              </div>
                              <div className="tabular-nums">{dPct.toFixed(1)}% ({dr.toLocaleString()})</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-3 w-3 rounded-[3px] ring-1 ring-slate-400"
                                  style={{ background: '#0b0b0b' }}
                                />
                                <span>Black</span>
                              </div>
                              <div className="tabular-nums">{bPct.toFixed(1)}% ({bw.toLocaleString()})</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* X label */}
            <div className={`mt-2 text-center ${axisLabelCls}`}>
              White Elo bucket
            </div>
          </div>
        </div>
      </div>

      {/* Legend (narrow) + vertical segmented toggle underneath */}
      <div className="w-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 text-[11px] shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 text-center font-medium text-slate-700 dark:text-slate-200">
            {m === 'matchup' ? 'Density' : 'Result'}
          </div>

          <div className="mx-auto flex items-stretch gap-2">
            <div
              className="h-20 w-3 rounded-full ring-1 ring-slate-300/50 dark:ring-slate-700/50"
              style={{ background: 'linear-gradient(to top, hsl(0 85% 45%), hsl(60 85% 45%), hsl(120 85% 45%))' }}
            />
            <div className="flex h-20 flex-col justify-between text-[11px] text-slate-600 dark:text-slate-300">
              {m === 'matchup' ? (
                <>
                  <div>High</div>
                  <div /> {/* nothing in the middle now */}
                  <div>Low</div>
                </>
              ) : (
                <>
                  <div>White</div>
                  <div>Balanced</div>
                  <div>Black</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Vertical segmented toggle under the legend */}
        <div className="mt-2 flex w-full flex-col overflow-hidden rounded-xl border border-slate-300 text-[11px] dark:border-slate-700">
          <button
            onClick={() => setMode('matchup')}
            className={`cursor-pointer px-2 py-1 transition-colors ${
              m === 'matchup'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}

          >
            Matchups
          </button>
          <div className="h-px w-full bg-slate-300/70 dark:bg-slate-700/70" />
          <button
            onClick={() => setMode('result')}
            className={`cursor-pointer px-2 py-1 transition-colors ${
              m === 'result'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Results
          </button>
        </div>
      </div>
    </div>
  )
}
