'use client'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/openings', label: 'Openings' },
  { href: '/ratings', label: 'Ratings' },
]

export function Navbar() {
  const pathname = usePathname()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Lichess Trends'

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center">
      <div className="m-4 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/20 bg-white/70 p-3 shadow-lg backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
        <div className="font-semibold">{siteName}</div>
        <nav className="hidden gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={clsx(
                'text-sm transition-colors hover:text-sky-600 dark:hover:text-sky-400',
                pathname === n.href ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-300'
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </div>
  )
}