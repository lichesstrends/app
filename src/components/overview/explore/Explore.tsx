'use client'

import { CardLink } from '@/components/ui/CardLink'

const items = [
  {
    href: '/openings',
    title: 'Openings',
    description: 'Popularity and performance of opening families across time and ratings.',
  },
  {
    href: '/ratings',
    title: 'Ratings',
    description: 'Distribution of games across rating buckets and trends over time.',
  },
] as const

export default function Explore() {
  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">Explore</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((it) => (
          <CardLink
            key={it.href}
            href={it.href}
            title={it.title}
            body={it.description}
            cta="Explore →"
            size="md"
          />
        ))}
      </div>
    </section>
  )
}
