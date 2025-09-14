import Link from 'next/link'

export function LinkCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Link
        href="/openings"
        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="text-lg font-semibold">Openings</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Popularity and performance of opening families across time and ratings.
        </p>
        <div className="mt-4 text-sm text-sky-600 group-hover:underline dark:text-sky-400">Explore →</div>
      </Link>

      <Link
        href="/ratings"
        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="text-lg font-semibold">Ratings</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Distribution of games across rating buckets and trends over time.
        </p>
        <div className="mt-4 text-sm text-sky-600 group-hover:underline dark:text-sky-400">Explore →</div>
      </Link>
    </div>
  )
}
