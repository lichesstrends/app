export const revalidate = 3600

export default function TermsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Terms of Use</h1>
      
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Effective date: October 08, 2025
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          By accessing or using LichessTrends, you agree to these terms. If you don&apos;t agree, please don&apos;t use the site. We&apos;re a small open-source project, so these terms are meant to keep things fair and straightforward.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Use of the Site</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Feel free to browse, explore charts, and use the API for personal or non-commercial purposes. Don&apos;t scrape the site excessively, try to hack it, or use it in ways that could harm others. The data comes from Lichess&apos;s public dumps, so respect their guidelines too.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Content and Data</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          All stats and charts are based on aggregated, anonymous game data from Lichess. We don&apos;t claim ownership over the raw data - that&apos;s Lichess&apos;s. Our code is open-source under MIT, so you can fork or contribute if you want.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Disclaimer</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The site is provided &quot;as is&quot; without any warranties. We try to keep things accurate, but chess data can have quirks, and we&apos;re not liable for any issues arising from using this tool. Use at your own risk.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Changes to Terms</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We might tweak these terms occasionally. We&apos;ll update the date here, and your continued use means you accept the changes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Governing Law</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          These terms are governed by the laws of France (since Lichess is based there), without regard to conflict of law principles.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Us</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Got feedback or concerns? Check the GitHub repo or drop us a line through the footer links.
        </p>
      </section>
    </div>
  )
}