'use client'
import Link from 'next/link'
import { Database, BookOpen, Plug } from 'lucide-react'

export default function Intro() {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        Welcome to LichessTrends!
      </h2>

      <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">
        <strong>LichessTrends</strong> is an open-source project that
        aggregates the monthly Lichess classical game dumps into nice charts. It&apos;s built on top of{' '}
        <Link
          href="https://lichess.org/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          Lichess
        </Link>
        , a free and open-source chess platform with an open-data initiative. Beyond the dashboard,{' '}
        <strong>LichessTrends</strong> lets you visualize many statistics:
        {` `}♟️ opening popularity, ⚖️ win/draw rates, 🎯 performance by Elo buckets, and 📈 evolution over time.
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
          href="https://lichess.org/api"
          newTab
          icon={<Plug size={16} />}
          title="API"
          body="Access the API documentation."
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
      className="group block rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition
                 hover:-translate-y-0.5 hover:shadow-md focus:outline-none
                 dark:border-slate-800 dark:bg-slate-900"
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