import { ReactNode } from 'react'
import { HeatMode } from './EloHeatmap'

export function EloHeatmapInfo({ mode }: { mode: HeatMode }): ReactNode {
  return mode === 'matchup' ? (
    <p className="mb-0 text-xs">
      Color intensity shows game density for White (X) vs Black (Y) Elo buckets. Grey means no games.
    </p>
  ) : (
    <p className="mb-0 text-xs">
      Color leans green for White advantage, red for Black, in each bucket pair. Grey means no games. Hover for W/D/B split.
    </p>
  )
}