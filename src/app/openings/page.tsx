// app/src/app/openings/page.tsx
import { Popularity } from '@/components/openings/popularity/Popularity'
import { OpeningsShowcase } from '@/components/openings/showcase/OpeningsShowcase'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata('Openings', 'Explore chess opening popularity trends over time.')

export const revalidate = 3600

export default function OpeningsPage() {
  return (
    <div className="space-y-8">
      {/* Popularity section (title + cards) */}
      <Popularity />
      <OpeningsShowcase />
    </div>
  )
}
