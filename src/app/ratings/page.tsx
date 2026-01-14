import { RatingsHeatmap } from '@/components/ratings/RatingsHeatmap'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata('Ratings', 'Explore Elo rating distribution and matchup heatmaps.')

export const revalidate = 3600

export default function RatingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Ratings</h1>
      <RatingsHeatmap />
    </div>
  )
}
