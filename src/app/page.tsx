import OverviewDashboard from '@/components/OverviewDashboard'

export const revalidate = Number(process.env.REVALIDATE_SECONDS ?? 600)

export default function OverviewPage() {
  return <OverviewDashboard />
}
