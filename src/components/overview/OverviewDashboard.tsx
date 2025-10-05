'use client'
import { TimeToggle } from './TimeToggle'
import { LinkCards } from './LinkCards'
import { OverviewProvider } from '@/contexts/overview/OverviewContext'
import { TotalGamesCard } from './cards/TotalGamesCard'
import { ResultSharesCard } from './cards/ResultSharesCard'
import { ActivityDistributionCard } from './cards/ActivityDistributionCard'
import { EloHeatmapCard } from './cards/EloHeatmapCard'
import { TopOpeningsCard } from './cards/TopOpeningsCard'

export default function OverviewDashboard() {
  return (
    <OverviewProvider>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <TimeToggle />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Column 1 (two rows) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Row A */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Total games takes 2/3, result shares 1/3 */}
              <div className="md:col-span-2">
                <TotalGamesCard />
              </div>
              <div className="md:col-span-1">
                <ResultSharesCard />
              </div>
            </div>

            {/* Row B */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ActivityDistributionCard />
              <EloHeatmapCard />
            </div>
          </div>

          {/* Column 2 */}
          <TopOpeningsCard />
        </div>

        <LinkCards />
      </div>
    </OverviewProvider>
  )
}
