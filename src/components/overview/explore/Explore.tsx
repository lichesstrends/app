'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'

/**
 * Two feature cards with a decorative layer of scattered objects. On hover the
 * objects snap into a slightly rotated, zoomed pose and the card tints. All
 * transitions share the same timing so they move together. Motion is disabled
 * for users who prefer reduced motion.
 */

// Snappy easing (slight overshoot), short duration, no per-object delay so every
// object starts and ends at the same time.
const OBJECT_BASE =
  'pointer-events-none absolute select-none leading-none ' +
  'transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:!transform-none'

function OpeningsDecor() {
  const piece = 'text-sky-300/50 group-hover:text-sky-400/70 dark:text-sky-500/25 dark:group-hover:text-sky-400/50'
  return (
    <div className="absolute inset-0" aria-hidden>
      <span className={`${OBJECT_BASE} ${piece} -left-4 top-5 text-8xl [transform:rotate(-14deg)] group-hover:[transform:rotate(-26deg)_scale(1.14)]`}>
        ♞
      </span>
      <span className={`${OBJECT_BASE} ${piece} right-6 -top-6 text-7xl [transform:rotate(12deg)] group-hover:[transform:rotate(24deg)_scale(1.14)]`}>
        ♝
      </span>
      <span className={`${OBJECT_BASE} ${piece} right-12 -bottom-4 text-8xl [transform:rotate(-8deg)] group-hover:[transform:rotate(-20deg)_scale(1.14)]`}>
        ♜
      </span>
    </div>
  )
}

function RatingsDecor() {
  const bar = 'bg-emerald-300/50 group-hover:bg-emerald-400/70 dark:bg-emerald-500/25 dark:group-hover:bg-emerald-400/50'
  const bars = [
    { key: 'a', h: 'h-16', hover: 'group-hover:h-24' },
    { key: 'b', h: 'h-24', hover: 'group-hover:h-32' },
    { key: 'c', h: 'h-14', hover: 'group-hover:h-20' },
    { key: 'd', h: 'h-32', hover: 'group-hover:h-40' },
  ]
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="absolute -bottom-4 right-6 flex items-end gap-3">
        {bars.map((b) => (
          <div
            key={b.key}
            className={`w-6 rounded-t-lg transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${bar} ${b.h} ${b.hover}`}
          />
        ))}
      </div>
    </div>
  )
}

const cards = [
  {
    href: '/openings',
    title: 'Openings',
    body: 'Popularity and performance of opening families across time and ratings.',
    decor: <OpeningsDecor />,
    hoverBg: 'group-hover:bg-sky-50/70 dark:group-hover:bg-sky-950/20',
  },
  {
    href: '/ratings',
    title: 'Ratings',
    body: 'Distribution of games across rating buckets and trends over time.',
    decor: <RatingsDecor />,
    hoverBg: 'group-hover:bg-emerald-50/70 dark:group-hover:bg-emerald-950/20',
  },
] as const

export default function Explore() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Explore</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.href} className={`block p-6 ${c.hoverBg}`}>
            {c.decor}
            <div className="relative z-10">
              <div className="text-lg font-semibold">{c.title}</div>
              <p className="mt-2 max-w-[22rem] text-sm text-slate-600 dark:text-slate-300">{c.body}</p>
              <Link
                href={c.href}
                className="mt-4 inline-flex items-center rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Explore {c.title}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
