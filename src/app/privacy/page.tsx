export const revalidate = 3600

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Last updated: October 08, 2025
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Introduction</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          LichessTrends is a simple tool for exploring chess data from Lichess.org&apos;s public dumps. We built this as an open-source project, and we&apos;re committed to keeping things transparent and user-friendly. This policy explains what information we handle (spoiler: none) when you visit the site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Information We Collect</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We don&apos;t collect or store any personal information from users. No names, emails, IP addresses, or anything like that. The site doesn&apos;t use cookies, trackers, or analytics tools. All the data you see comes from aggregated public chess game stats provided by Lichess - nothing tied to individuals.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Third-Party Links</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We link to external sites like Lichess.org, GitHub, and maybe others. Those sites have their own privacy policies, so check them out if you click through. We&apos;re not responsible for what happens on other sites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Changes to This Policy</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          If we ever need to update this (unlikely, but who knows), we&apos;ll post the changes here with a new date. Continued use of the site means you accept the updates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact Us</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Questions? Open an issue on our GitHub repo or reach out via the contact info in the footer.
        </p>
      </section>
    </div>
  )
}