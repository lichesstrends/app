// app/src/app/changelog/page.tsx
import changelog from '@/lib/changelog.json'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata('Changelog', 'Updates, new features, and fixes for LichessTrends.')

type Release = {
  version: string
  date: string
  summary: string
  changes: string[]
}

export const revalidate = 3600

export default function ChangelogPage() {
  const releases = changelog.releases as Release[]

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Changelog</h1>
      
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Welcome to the LichessTrends changelog! Here&apos;s where we track all the updates, new features, and fixes. We&apos;re just getting started, but stay tuned for more chess data magic. 🚀
      </p>

      {releases.map((release, index) => (
        <section key={release.version} className={`space-y-3 ${index > 0 ? 'border-t border-slate-200 pt-4 dark:border-slate-800' : ''}`}>
          <h2 className="text-lg font-semibold">{release.version} - {release.date}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {release.summary}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {release.changes.map((change, i) => (
              <li key={i}>{change}</li>
            ))}
          </ul>
        </section>
      ))}

      {/* Placeholder for future updates */}
      <section className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800 opacity-50">
        <h2 className="text-lg font-semibold">Coming Soon...</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Exciting updates on the horizon: deeper opening analysis, rating trends, and more interactive features. What would you like to see next? Drop us a note on GitHub!
        </p>
      </section>
    </div>
  )
}