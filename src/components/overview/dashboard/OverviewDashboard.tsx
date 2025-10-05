'use client'
import { TimeToggle } from '../TimeToggle'
import { LinkCards } from '../LinkCards'
import { OverviewProvider } from '@/contexts/overview/OverviewContext'
import { TotalGamesCard } from './total/TotalGamesCard'
import { ResultSharesCard } from './results/ResultSharesCard'
import { ActivityDistributionCard } from './activity/ActivityDistributionCard'
import { EloHeatmapCard } from './heatmap/EloHeatmapCard'
import { TopOpeningsCard } from './openings/TopOpeningsCard'

export default function OverviewDashboard() {
  return (
    <OverviewProvider>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Overview</h1>
          <TimeToggle />
        </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid grid-rows-[2fr_3fr] gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
  <div className="md:col-span-2">
    <TotalGamesCard />
  </div>
  <div className="md:col-span-1">
    <ResultSharesCard />
  </div>
</div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 h-full">
                <div className="h-full"><ActivityDistributionCard /></div>
                <div className="h-full"><EloHeatmapCard /></div>
              </div>
            </div>

            <TopOpeningsCard />
          </div>

        <LinkCards />
      </div>
    </OverviewProvider>
  )
}
