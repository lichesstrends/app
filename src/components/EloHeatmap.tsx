'use client'
import { EloHeatmapResponse } from '@/types'
import { useMemo, useState } from 'react'

type Mode = 'matchup' | 'result'

/** One knob for density compression in matchup mode. 0 = linear; higher = more “loggy”. */
function makeLogTransform(logK: number) {
  if (!(logK > 1e-9)) return (r: number) => Math.max(0, Math.min(1, r))
  const denom = Math.log1p(logK)
  return (r: number) => Math.log1p(logK * Math.max(0, Math.min(1, r))) / denom
}

/** 0..1 → red→yellow→green */
function rampColor(t01: number, alphaBoost = 0.7) {
  const t = Math.max(0, Math.min(1, t01))
  const hue = Math.round(120 * t) // 0=red … 120=green
  const alpha = 0.25 + alphaBoost * t
  return `hsl(${hue} 85% 45% / ${alpha})`
}

export function EloHeatmap({
  data,
  logK = 9,
  /** Controlled mode (optional) */
  mode,
  /** Called whenever user toggles mode */
  onModeChange,
  /** Uncontrolled initial mode (used only if `mode` is not provided) */
  initialMode = 'matchup',
}: {
  data: EloHeatmapResponse
  logK?: number
  mode?: Mode
  onModeChange?: (m: Mode) => void
  initialMode?: Mode
}) {
  const [inner, setInner] = useState<Mode>(initialMode)
  const m = mode ?? inner
  const setMode = (nm: Mode) => {
    if (!mode) setInner(nm)
    onModeChange?.(nm)
  }

  // Index cells + find max for density
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

  const buckets = data.buckets
  const tDensity = useMemo(() => makeLogTransform(logK), [logK])

  return (
    <div className="flex gap-3">
      {/* Left block: y-label + heatmap grid inside a two-col grid so the label height matches the grid exactly */}
      <div className="flex-1">
        <div className="grid grid-cols-[auto_1fr] items-stretch gap-2">
          {/* Vertical Y axis label, aligned to the grid’s height */}
          <div className="flex items-center justify-center">
            <div className="rotate-180 [writing-mode:vertical-rl] text-xs text-slate-600 dark:text-slate-300">
              Black bucket
            </div>
          </div>

          {/* Heatmap grid */}
          <div>
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${buckets.length}, minmax(0,1fr))`,
                gridAutoRows: '1fr',
                aspectRatio: '1 / 1',
                gap: '2px',
              }}
            >
              {buckets.map((wb) =>
                buckets.map((bb) => {
                  const cell = idx.get(`${wb}:${bb}`)
                  const g  = Number(cell?.games ?? 0)
                  const ww = Number(cell?.whiteWins ?? 0)
                  const bw = Number(cell?.blackWins ?? 0)
                  const dr = Number(cell?.draws ?? 0)

                  let color = 'hsl(215 16% 24% / 0.35)' // neutral for empty

                  if (m === 'matchup') {
                    const r = g / maxGames
                    color = rampColor(tDensity(r))
                  } else {
                    if (g > 0) {
                      // balance in [-1..+1] (black→white) → [0..1] for ramp
                      const balance01 = ((ww - bw) / g + 1) / 2
                      // fade draw-heavy cells so decisive cells pop a bit more
                      const decisiveness = 1 - dr / g
                      color = rampColor(balance01, 0.35 + 0.5 * decisiveness)
                    }
                  }

                  const title =
                    m === 'matchup'
                      ? `W ${wb} vs B ${bb}
Games ${g.toLocaleString()} (${((g / data.totalGames) * 100).toFixed(2)}%)`
                      : `W ${wb} vs B ${bb}
Games ${g.toLocaleString()}
White ${(g ? (ww / g) * 100 : 0).toFixed(1)}% (${ww.toLocaleString()})
Draw  ${(g ? (dr / g) * 100 : 0).toFixed(1)}% (${dr.toLocaleString()})
Black ${(g ? (bw / g) * 100 : 0).toFixed(1)}% (${bw.toLocaleString()})`

                  return (
                    <div
                      key={`${wb}-${bb}`}
                      title={title}
                      className="rounded-[3px]"
                      style={{ background: color }}
                    />
                  )
                })
              )}
            </div>

            {/* X axis label */}
            <div className="mt-2 text-center text-xs text-slate-600 dark:text-slate-300">
              White bucket
            </div>
          </div>
        </div>
      </div>

      {/* Compact legend card with embedded toggle (vertical to save space) */}
      <div className="w-28">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 text-[11px] shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-1 text-center font-medium text-slate-700 dark:text-slate-200">
            {m === 'matchup' ? 'Density' : 'Result'}
          </div>

          {/* Vertical gradient */}
          <div
            className="mx-auto h-24 w-4 rounded-full ring-1 ring-slate-300/50 dark:ring-slate-700/50"
            style={{
              background:
                'linear-gradient(to top, hsl(0 85% 45%), hsl(60 85% 45%), hsl(120 85% 45%))',
            }}
          />

          {/* Labels */}
          <div className="mt-1 grid grid-cols-1 gap-0.5 text-[10px] text-slate-600 dark:text-slate-300">
            {m === 'matchup' ? (
              <>
                <div className="text-right">High</div>
                <div className="text-right opacity-70">…</div>
                <div className="text-right">Low</div>
              </>
            ) : (
              <>
                <div className="text-right">White</div>
                <div className="text-right opacity-70">Balanced</div>
                <div className="text-right">Black</div>
              </>
            )}
          </div>

          {/* Toggle inside the card */}
          <div className="mt-2 inline-flex w-full overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setMode('matchup')}
              className={`flex-1 px-2 py-1 ${m === 'matchup' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Match
            </button>
            <button
              onClick={() => setMode('result')}
              className={`flex-1 px-2 py-1 ${m === 'result' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-700 dark:text-slate-300'}`}
            >
              Result
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
