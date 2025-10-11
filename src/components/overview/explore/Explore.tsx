'use client'
import Link from 'next/link'

type ExploreItem = {
  href: string
  title: string
  description: string
}

const items: ExploreItem[] = [
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
]

export default function Explore() {
  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold">Explore</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-lg font-semibold">{it.title}</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {it.description}
            </p>
            <div className="mt-4 text-sm text-sky-600 group-hover:underline dark:text-sky-400">
              Explore →
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}