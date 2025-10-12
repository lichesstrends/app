// app/src/app/openings/page.tsx
import { Popularity } from '@/components/openings/popularity/Popularity'
import { OpeningsShowcase } from '@/components/openings/showcase/OpeningsShowcase'

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
