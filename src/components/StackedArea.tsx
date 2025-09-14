'use client'
import { ResultSharePoint, YyyyMm } from '@/types'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type DataPoint = {
  month: YyyyMm
  white: number
  draw: number
  black: number
}

export function StackedArea({ points }: { points: ResultSharePoint[] }) {
  const data: DataPoint[] = points.map((p) => ({
    month: p.month,
    white: Math.round(p.white * 1000) / 1000,
    draw: Math.round(p.draw * 1000) / 1000,
    black: Math.round(p.black * 1000) / 1000,
  }))

  // Strongly-typed tooltip formatter
  const fmt = (value: number, key: keyof Omit<DataPoint, 'month'>): [string, string] => {
    return [`${(value * 100).toFixed(1)}%`, key]
  }

  return (
    <div className="h-24">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <XAxis dataKey="month" hide />
          <YAxis hide domain={[0, 1]} />
          <Tooltip
            formatter={(v, k) => fmt(v as number, k as keyof Omit<DataPoint, 'month'>)}
            labelFormatter={(l) => `Month ${l}`}
          />
          <Area type="monotone" dataKey="white" stackId="1" fillOpacity={0.6} />
          <Area type="monotone" dataKey="draw" stackId="1" fillOpacity={0.6} />
          <Area type="monotone" dataKey="black" stackId="1" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
