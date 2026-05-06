'use client'
import { ActivityBucketPoint } from '@/types'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from 'recharts'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { inferBucketStep } from '@/lib/buckets'

export function ActivityDistribution({ points }: { points: ActivityBucketPoint[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const sorted = useMemo(
    () => points.slice().sort((a, b) => a.bucket - b.bucket),
    [points],
  )

  const step = useMemo(() => inferBucketStep(sorted.map((p) => p.bucket)), [sorted])

  // Now compute data with midpoints and pct
  const data = useMemo(
    () =>
      sorted.map((p) => ({
        bucket: p.bucket,
        mid: p.bucket + step / 2, // center the bar
        pct: Math.round(p.pct * 10000) / 100, // 2 decimals
      })),
    [sorted, step]
  )


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
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 16 }}>
          <XAxis
            type="number"
            dataKey="mid"
            tick={{ fontSize: 10, fill: axisColor }}
            ticks={sorted.map((p) => p.bucket)}
            domain={[sorted[0]?.bucket ?? 0, (sorted[sorted.length - 1]?.bucket ?? 0) + step]}
          >
            <Label value="Elo bucket" offset={-6} position="insideBottom" style={{ fill: axisColor, fontSize: 11 }} />
          </XAxis>
          <YAxis
            domain={[0, 'dataMax']}
            tick={{ fontSize: 10, fill: axisColor }}
          >
            <Label
              value="% of games"
              angle={-90}
              position="insideLeft"
              dy={40} // push down a bit so it's centered
              style={{ fill: axisColor, fontSize: 11 }}
            />
          </YAxis>
          <Tooltip
            cursor={{ fill: cursorFill, radius: 4 }}
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
          <Bar
            dataKey="pct"
            fill={barFill}
            fillOpacity={0.9}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
