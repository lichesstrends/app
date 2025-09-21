'use client'
import { ActivityBucketPoint } from '@/types'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { axisLabelCls } from '@/lib/chartStyles'

export function ActivityDistribution({ points }: { points: ActivityBucketPoint[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Prepare data
  const data = useMemo(
    () =>
      points
        .slice()
        .sort((a, b) => a.bucket - b.bucket)
        .map((p) => ({
          bucket: p.bucket,
          label: String(p.bucket),
          pct: Math.round(p.pct * 10000) / 100, // 2 decimals
        })),
    [points]
  )

  // Infer bucket step (fallback 200)
  const step = useMemo(() => {
    if (data.length < 2) return 200
    let best = Number.POSITIVE_INFINITY
    for (let i = 1; i < data.length; i++) {
      const d = data[i].bucket - data[i - 1].bucket
      if (d > 0 && d < best) best = d
    }
    return Number.isFinite(best) ? best : 200
  }, [data])

  // Theme-aware colors
  const barFill    = isDark ? '#60a5fa' : '#0ea5e9'
  const axisColor  = isDark ? '#94a3b8' : '#475569'
  const cursorFill = isDark ? 'rgba(148,163,184,.18)' : 'rgba(15,23,42,.08)'

  // Tooltip theming
  const tipBg     = isDark ? 'rgba(2,6,23,0.92)' : 'rgba(255,255,255,0.96)'
  const tipText   = isDark ? '#e5e7eb' : '#0f172a'
  const tipBorder = isDark
    ? '1px solid rgba(148,163,184,.35)'
    : '1px solid rgba(148,163,184,.45)'

  return (
    <div className="flex h-56 flex-col">
      <div className="flex flex-1">
        {/* Y axis label */}
        <div className="flex items-center justify-center">
          <div className={`${axisLabelCls} rotate-180 [writing-mode:vertical-rl]`}>
            % of games
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: axisColor }} />
              <YAxis domain={[0, 'dataMax']} tick={{ fontSize: 10, fill: axisColor }} />

              <Tooltip
                cursor={{ fill: cursorFill }}
                formatter={(v: number, _name, { payload }) => {
                  const lo = payload.bucket
                  const hi = lo + step - 1
                  return [`${(v as number).toFixed(2)}%`, `Elo ${lo}–${hi}`]
                }}
                labelFormatter={() => ''}
                wrapperStyle={{ outline: 'none' }}
                contentStyle={{
                  background: tipBg,
                  color: tipText,
                  border: tipBorder,
                  borderRadius: 10,
                  boxShadow: 'none',
                  padding: '10px 12px',
                }}
                labelStyle={{ color: tipText }}
                itemStyle={{ color: tipText, textTransform: 'none' }}
              />
              <Bar dataKey="pct" fill={barFill} fillOpacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* X axis label */}
      <div className={`mt-1 text-center ${axisLabelCls}`}>
        Elo bucket
      </div>
    </div>
  )
}
