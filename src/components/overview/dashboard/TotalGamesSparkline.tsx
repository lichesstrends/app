'use client'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from 'next-themes'
import type { MonthlyGamesPoint } from '@/types'

export function TotalGamesSparkline({ series }: { series: MonthlyGamesPoint[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const stroke = isDark ? '#38bdf8' : '#0284c7'

  return (
    <div className="w-32 h-20">
      <ResponsiveContainer>
        <AreaChart data={series}>
          <defs>
            <linearGradient id="sparklineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            position={{ y: 65 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const p = payload[0].payload
              const date = new Date(p.month + '-01')
              return (
                <div className="rounded-lg border border-slate-300 bg-white p-2 text-xs shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <div>{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  <div className="font-semibold">{p.games.toLocaleString()} games</div>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="games"
            stroke={stroke}
            strokeWidth={2}
            fill="url(#sparklineFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
