// app/src/components/openings/popularity/Popularity.tsx
'use client'

import { YearlyBumpCard } from './bump/YearlyBumpCard'

export function Popularity() {
  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold">Popularity</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <YearlyBumpCard />
      </div>
    </section>
  )
}
