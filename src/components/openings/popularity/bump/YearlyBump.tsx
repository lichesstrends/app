'use client'

import { ResponsiveBump } from '@nivo/bump'
import type { YearlyBumpResponse, YearlyBumpPoint } from '@/types'

type Datum = YearlyBumpPoint & {
  /** Duplicate the opening name so we never depend on internal Nivo types */
  name: string
}

type Serie = {
  id: string   // opening NAME (so default tooltip shows names)
  label: string
  data: Datum[]
}

export function YearlyBump({ data }: { data: YearlyBumpResponse }) {
  // Map series so each point carries its opening name; id/label = name
  const chartSeries: Serie[] = (data.series ?? []).map((s) => ({
    id: s.label,
    label: s.label,
    data: s.data.map((d) => ({ ...d, name: s.label })),
  }))

  return (
    <div className="h-[420px] w-full">
      <ResponsiveBump<Datum, Serie>
        data={chartSeries}
        xPadding={0.7}
        colors={{ scheme: 'category10' }}
        lineWidth={3}
        inactiveLineWidth={2}
        inactiveOpacity={0.35}
        pointSize={10}
        inactivePointSize={6}
        activePointSize={12}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serie.color' }}
        axisTop={{ tickValues: data.years, tickSize: 0, tickPadding: 8, format: (y) => String(y) }}
        axisBottom={{ tickValues: data.years, tickSize: 0, tickPadding: 8, format: (y) => String(y) }}
        axisLeft={{ tickSize: 0, tickPadding: 8, format: (r) => `#${r}` }}
        margin={{ top: 30, right: 160, bottom: 40, left: 40 }}
        endLabel={(serie) => serie.label}
        enableGridX
        enableGridY={false}
        theme={{
          text: { fill: 'currentColor' },
          axis: { ticks: { text: { fill: 'currentColor' } } },
          grid: { line: { stroke: 'currentColor', opacity: 0.08 } },
          // keep default bump tooltip (shows series name = opening name)
          tooltip: {
            container: {
              background: 'white',
              color: '#0f172a',
              fontSize: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              padding: '12px',
              border: '1px solid #cbd5e1',
            },
          },
        }}
      />
    </div>
  )
}
