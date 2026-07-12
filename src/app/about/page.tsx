import { createMetadata } from '@/lib/metadata'

export const revalidate = 3600

export const metadata = createMetadata('About', 'Learn how LichessTrends works, from data ingestion to visualization.')

const linkClass =
  'underline underline-offset-4 decoration-slate-300 hover:text-slate-900 dark:hover:text-white'

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">About</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">The data</h2>
        <p className="leading-7 text-slate-600 dark:text-slate-300">
          Every month, Lichess publishes a public dump of all the rated games played on the
          platform. You can browse these dumps on the{' '}
          <a href="https://database.lichess.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
            Lichess database
          </a>
          . They are large compressed PGN files, and some months contain well over a hundred
          million games, each one carrying the players ratings, the moves, timestamps, and the
          result.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Aggregation</h2>
        <p className="leading-7 text-slate-600 dark:text-slate-300">
          Rather than downloading those files first, the aggregator streams the compressed dumps
          directly over HTTP and decompresses them on the fly, so it can work through terabytes of
          data with a small memory footprint. Games are parsed in parallel across CPU cores and
          grouped by month, opening family, and the rating range of each player. For every one of
          those combinations it keeps just the totals that matter: how many games were played, and
          how many ended in a white win, a black win, or a draw. A daily GitHub Actions workflow
          runs the whole process and picks up any new dump automatically. The code lives in the{' '}
          <a href="https://github.com/lichesstrends/aggregator" target="_blank" rel="noopener noreferrer" className={linkClass}>
            aggregator repository
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Storage and API</h2>
        <p className="leading-7 text-slate-600 dark:text-slate-300">
          The aggregated data is tiny compared to the raw dumps: what would be terabytes of PGN
          becomes a small table where each row is a single combination of month, opening, and
          rating buckets. A Next.js backend exposes that table through cached REST endpoints
          covering monthly game counts, opening popularity, rating heatmaps, and more. You can try
          them from the{' '}
          <a href="/api" className={linkClass}>
            API reference
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">The site</h2>
        <p className="leading-7 text-slate-600 dark:text-slate-300">
          This site is built with Next.js and React, using TanStack Query to fetch data and
          Recharts to draw the charts. The whole project is open source and contributions are
          welcome on{' '}
          <a href="https://github.com/lichesstrends/app" target="_blank" rel="noopener noreferrer" className={linkClass}>
            GitHub
          </a>
          .
        </p>
        <p className="leading-7 text-slate-600 dark:text-slate-300">
          LichessTrends is an independent project with no affiliation to Lichess.org. It simply
          builds on their open-data initiative.
        </p>
      </section>
    </div>
  )
}
