import OverviewDashboard from '@/components/overview/OverviewDashboard'

export const revalidate = Number(process.env.REVALIDATE_SECONDS ?? 600)

export default function OverviewPage() {
  return <OverviewDashboard />
}

// TODO : put all the overview layout here instead of using a wrapper.