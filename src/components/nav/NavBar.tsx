'use client'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Github } from 'lucide-react'
import Image from 'next/image'

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/openings', label: 'Openings' },
  { href: '/ratings', label: 'Ratings' },
  { href: '/about', label: 'About' },
  { href: '/api', label: 'API' },
]

export function Navbar() {
  const pathname = usePathname()

  // same style as ThemeToggle (icon-only)
  const iconBtn =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg ' +
    'border border-slate-300 text-slate-700 transition ' +
    'hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center">
      <div className="m-4 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/20 bg-white/70 p-3 shadow-lg backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
          <Link href="/" className="ml-1 inline-flex items-center" aria-label="LichessTrends home">
            <Image
              src="/logo.svg"
              alt="LichessTrends"
              width={110}
              height={24}
              priority
              className="h-6 w-auto dark:invert"
            />
          </Link>
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

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/your-org/lichesstrends-app"
            target="_blank"
            rel="noreferrer"
            className={iconBtn}
            aria-label="GitHub"
            title="GitHub"
          >
            <Github size={16} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
