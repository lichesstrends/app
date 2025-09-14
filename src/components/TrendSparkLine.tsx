'use client'
import { MonthlyGamesPoint } from '@/types'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function TrendSparkline({ data }: { data: MonthlyGamesPoint[] }) {
  const d = data.map((p) => ({ ...p, label: p.month }))
  return (
    <div className="h-24">
      <ResponsiveContainer>
        <LineChart data={d} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <XAxis dataKey="label" hide />
          <YAxis hide />
          <Tooltip formatter={(v: number) => v.toLocaleString()} labelFormatter={(l) => `Month ${l}`} />
          <Line type="monotone" dataKey="games" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
