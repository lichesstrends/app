'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Github, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/openings', label: 'Openings' },
  { href: '/ratings', label: 'Ratings' },
  { href: '/about', label: 'About' },
  { href: '/api', label: 'API' },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Refs to ignore "outside click" when target is the toggle button or the menu panel
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close on route change
  useEffect(() => setMenuOpen(false), [pathname])

  // Close when clicking outside (use 'click' so it runs AFTER the toggle's onClick)
  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      if (toggleRef.current?.contains(t)) return
      setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [menuOpen])

  // If we cross to desktop (>= md: 768px), force-close the mobile menu
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && menuOpen) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [menuOpen])

  const iconBtn =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 ' +
    'text-slate-700 transition hover:bg-slate-100 cursor-pointer ' +
    'dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center">
      <div className="m-4 w-full max-w-6xl">
        <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 p-3 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center" aria-label="LichessTrends Home">
            <Image
              src="/logo.svg"
              alt="LichessTrends"
              width={110}
              height={24}
              priority
              className="ml-2 h-6 w-auto dark:invert"
            />
          </Link>

          {/* Center: Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'text-sm font-semibold transition-colors',
                  pathname === href
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/lichesstrends/app"
              target="_blank"
              rel="noreferrer"
              className={clsx('hidden md:inline-flex', iconBtn)}
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={16} />
            </a>

            <ThemeToggle />

            <button
              ref={toggleRef}
              type="button"
              aria-label="Menu"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={clsx('md:hidden', iconBtn)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          className={clsx(
            'absolute left-4 right-4 top-[4.25rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900',
            'transition-all duration-150 md:hidden',
            menuOpen
              ? 'pointer-events-auto opacity-100 translate-y-0'
              : 'pointer-events-none opacity-0 -translate-y-2'
          )}
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-slate-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
