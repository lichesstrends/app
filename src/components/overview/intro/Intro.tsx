'use client'
import Link from 'next/link'
import { Database, BookOpen, Plug } from 'lucide-react'

export default function Intro() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        What is it?
      </h2>

      <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">
        <strong>LichessTrends</strong> is an open-source project that
        aggregates the monthly Lichess classical game dumps into nice charts. It's built on{' '}
        <Link
          href="https://lichess.org/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          Lichess
        </Link>
        , a free and open-source chess platform with an open-data initiative. Beyond the dahboard,{' '}
        <strong>LichessTrends</strong> lets you visualize many statistics:
        {` `}♟️ opening popularity, ⚖️ win/draw rates, 🎯 performance by Elo buckets, and 📈 evolution over time.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <CardLink
          href="https://database.lichess.org/"
          newTab
          icon={<Database size={16} />}
          title="Data"
          body="Monthly public dumps; we parse games, bucket ratings, and map openings by ECO families."
        />

        <CardLink
          href="/about"
          newTab
          icon={<BookOpen size={16} />}
          title="Learn more"
          body="How the pipeline works, assumptions, and privacy notes. MIT-licensed, contributions welcome."
        />

        <CardLink
          href="https://lichess.org/api"
          newTab
          icon={<Plug size={16} />}
          title="API"
          body="Lightweight JSON feeds here, or tap straight into the official Lichess API for raw games."
        />
      </div>
    </section>
  )
}

function CardLink({
  href,
  title,
  body,
  icon,
  newTab = false,
}: {
  href: string
  title: string
  body: string
  icon?: React.ReactNode
  newTab?: boolean
}) {
  return (
    <Link
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className="group block rounded-xl border border-slate-200 p-3 transition
                 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none
                 focus:ring-2 focus:ring-sky-400 dark:border-slate-800
                 dark:hover:shadow-none"
    >
      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-200">
        {icon && (
          <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
            {icon}
          </span>
        )}
        <span>{title}</span>
      </div>
      <p className="mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300">
        {body}
      </p>
    </Link>
  )
}
