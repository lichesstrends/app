import { ReactNode } from 'react'
import { OverviewMode } from '@/contexts/overview/OverviewContext'

export function TotalGamesInfo({ mode }: { mode: OverviewMode }): ReactNode {
  return mode === OverviewMode.Last ? (
    <p className="mb-0 text-xs">
      Total games last month + 12-month sparkline. % change vs previous month.
    </p>
  ) : (
    <p className="mb-0 text-xs">
      Cumulative games since first recorded month.
    </p>
  )
}