import { TopOpeningResponse } from '@/types'
import { MetricCard } from './MetricCard'
import { ChessLine } from './chess/ChessLine'

export function TopOpeningCard({ top }: { top: TopOpeningResponse }) {
  return (
    <MetricCard
      title="Most played opening (all time)"
      value={`${top.displayName} · ${top.games.toLocaleString()} games`}
      subtitle={`≈ 1 in ${top.oneIn.toLocaleString()} games`}
      customChart={<ChessLine san={top.sampleMovesSAN} />}
    />
  )
}
