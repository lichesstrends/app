export const revalidate = 3600

export default function SourcesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Data Sources</h1>
      
      <p className="text-sm text-slate-600 dark:text-slate-300">
        LichessTrends aggregates and visualizes public chess data. Here&apos;s where it all comes from.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Primary Source: Lichess Database</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          All the game data we use is pulled from Lichess.org&apos;s monthly public dumps. These include millions of classical chess games played on their platform, anonymized and available for anyone to analyze.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          You can download the raw data yourself from <a href="https://database.lichess.org/" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline dark:text-sky-400">database.lichess.org</a>. We process these dumps to create the charts and stats you see here - grouping by openings, ratings, and more.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Processing and Aggregation</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Our backend parses the PGN files from Lichess, buckets ratings (e.g., 1600-1799), maps moves to ECO codes for openings, and tallies results. No personal data is involved - it&apos;s all about the games.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          For details on how we handle the data, check our <a href="/about" className="text-sky-600 hover:underline dark:text-sky-400">About page</a> or the open-source repos linked in the footer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">No Affiliation</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          LichessTrends is an independent, open-source project built by a fan of Lichess. We&apos;re not officially affiliated with, endorsed by, or connected to Lichess.org in any way. We just love their open-data initiative and wanted to make the stats more accessible.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          If you&apos;re from Lichess and have any concerns, feel free to reach out via our GitHub issues.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Other Sources</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          - Opening names and sample lines: Based on standard ECO classifications.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          - Icons and assets: From open-source libraries like Lucide.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Everything else is custom-built for this project.
        </p>
      </section>
    </div>
  )
}