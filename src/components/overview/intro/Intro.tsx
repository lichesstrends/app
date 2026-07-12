'use client'

import { Database, BookOpen, Plug } from 'lucide-react'
import { CardLink } from '@/components/ui/CardLink'

export default function Intro() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        LichessTrends
      </h2>

      <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">
        An open-source project that aggregates the monthly{' '}
        <a
          href="https://lichess.org/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          Lichess
        </a>{' '}
        classical game dumps into charts: opening popularity, win and draw rates,
        performance by Elo bucket, and how they evolve over time.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <CardLink
          href="/about"
          newTab
          icon={<BookOpen size={16} />}
          title="Learn more"
          body="Discover how the aggregation pipeline works, and how the app was built."
        />
        <CardLink
          href="https://database.lichess.org/"
          newTab
          icon={<Database size={16} />}
          title="Lichess database"
          body="View the Lichess monthly public dumps that LichessTrends parses and aggregates."
        />
        <CardLink
          href="/api"
          newTab
          icon={<Plug size={16} />}
          title="API"
          body="Access the API documentation."
        />
      </div>
    </section>
  )
}
