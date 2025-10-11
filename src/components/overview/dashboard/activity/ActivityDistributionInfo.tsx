import { ReactNode } from 'react'

export function ActivityDistributionInfo(): ReactNode {
  return (
    <p className="mb-0 text-xs">
      Percentage of games by Elo bucket in the period. Each game counts twice (White and Black). Bars sum to 100%.
    </p>
  )
}