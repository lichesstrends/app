import { RatingsHeatmap } from '@/components/ratings/RatingsHeatmap'

export const revalidate = 3600

export default function RatingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Ratings</h1>
      <RatingsHeatmap />
    </div>
  )
}
