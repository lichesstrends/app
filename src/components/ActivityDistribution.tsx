'use client'
import { ActivityBucketPoint } from '@/types'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function ActivityDistribution({ points }: { points: ActivityBucketPoint[] }) {
  const data = points
    .slice()
    .sort((a, b) => a.bucket - b.bucket)
    .map(p => ({ bucket: String(p.bucket), pct: Math.round(p.pct * 1000) / 10 }))

  return (
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <XAxis dataKey="bucket" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} labelFormatter={l => `Bucket ${l}`} />
          <Bar dataKey="pct" fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}