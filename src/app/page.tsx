import Dashboard from '@/components/overview/dashboard/Dashboard'
import Explore from '@/components/overview/explore/Explore'
import Intro from '@/components/overview/intro/Intro'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata('Overview', 'Explore Lichess classical game trends, results, and statistics.')

export const revalidate = 600;

export default function OverviewPage() {
  return (
    <div className="space-y-4 overflow-x-hidden">
      <Intro />
      <Dashboard />
      <Explore />
    </div>
  )
}