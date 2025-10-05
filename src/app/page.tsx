import Dashboard from '@/components/overview/dashboard/Dashboard'
import Explore from '@/components/overview/explore/Explore'
import Intro from '@/components/overview/intro/Intro'

export const revalidate = Number(process.env.REVALIDATE_SECONDS ?? 600)

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <Intro />
      <Dashboard />
      <Explore />
    </div>
  )
}