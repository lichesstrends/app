import { MonthlyGamesPoint, ResultSharePoint, TopOpeningResponse } from '@/types'
import { TrendSparkline } from './TrendSparkLine'
import { StackedArea } from './StackedArea'
import { TopOpeningCard } from './TopOpeningCard'
import { MetricCard } from './MetricCard'

function pctDelta(curr: number, prev: number) {
  if (prev <= 0) return 0
  return ((curr - prev) / prev) * 100
}

export function HeroMetrics({
  totalGamesEver,
  monthlyGames,
  resultShares,
  topOpening,
}: {
  totalGamesEver: number
  monthlyGames: MonthlyGamesPoint[]
  resultShares: ResultSharePoint[]
  topOpening: TopOpeningResponse
}) {
  const last = monthlyGames[monthlyGames.length - 1]?.games ?? 0
  const prev = monthlyGames[monthlyGames.length - 2]?.games ?? 0
  const delta = pctDelta(last, prev)

  const lastShare = resultShares[resultShares.length - 1] ?? { white: 0.0, black: 0.0, draw: 0.0 }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total games ever */}
      <MetricCard
        title="Total games (all time)"
        value={totalGamesEver.toLocaleString()}
        subtitle="Across all months available"
      />

      {/* Last month total + sparkline */}
      <MetricCard
        title="Games last month"
        value={last.toLocaleString()}
        subtitle={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs prior month`}
        customChart={<TrendSparkline data={monthlyGames} />}
      />

      {/* Most played opening family */}
      <TopOpeningCard top={topOpening} />

      {/* Result shares last month + 12m stacked area */}
      <MetricCard
        title="Result shares (last month)"
        value={`W ${(lastShare.white * 100).toFixed(1)}% · D ${(lastShare.draw * 100).toFixed(1)}% · B ${(lastShare.black * 100).toFixed(1)}%`}
        customChart={<StackedArea points={resultShares} />}
      />
    </div>
  )
}
