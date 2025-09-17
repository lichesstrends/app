'use client'
import { EloHeatmapResponse } from '@/types'
import { useMemo } from 'react'

export function EloHeatmap({ data }: { data: EloHeatmapResponse }) {
  const grid = useMemo(() => {
    const map = new Map<string, number>()
    let maxPct = 0
    for (const c of data.cells) {
      const key = `${c.whiteBucket}:${c.blackBucket}`
      map.set(key, c.pct)
      if (c.pct > maxPct) maxPct = c.pct
    }
    return { map, maxPct }
  }, [data])

  const buckets = data.buckets // ascending

  return (
    <div className="flex gap-3">
      <div className="flex-1">
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
              const pct = grid.map.get(`${wb}:${bb}`) ?? 0
              const intensity = grid.maxPct > 0 ? pct / grid.maxPct : 0
              return (
                <div
                  key={`${wb}-${bb}`}
                  title={`W ${wb} vs B ${bb} • ${(pct * 100).toFixed(2)}% of games`}
                  className="rounded-sm"
                  style={{
                    background: `hsl(210 80% 50% / ${0.15 + 0.85 * intensity})`,
                  }}
                />
              )
            })
          )}
        </div>
      </div>
      <div className="w-28 text-xs text-slate-600 dark:text-slate-300">
        <div className="font-medium mb-1">Legend</div>
        <div>Deeper color ⇒ denser matchup</div>
      </div>
    </div>
  )
}