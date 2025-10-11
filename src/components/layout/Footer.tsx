'use client'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import packageJson from '../../../package.json'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand / byline */}
          <div>
            <Link href="/" className="inline-block text-base font-semibold tracking-tight">
              LichessTrends
            </Link>
            <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
              Open-source charts from monthly Lichess classical game dumps.
            </p>
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Built with ❤️ by{' '}
              <Link
                href="https://github.com/yanncotineau"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 decoration-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                yann
              </Link>
            
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Explore
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-700 hover:underline dark:text-slate-200">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/openings" className="text-slate-700 hover:underline dark:text-slate-200">
                  Openings
                </Link>
              </li>
              <li>
                <Link href="/ratings" className="text-slate-700 hover:underline dark:text-slate-200">
                  Ratings
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Resources
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="https://database.lichess.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:underline dark:text-slate-200"
                >
                  Lichess data <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <Link href="/about" className="text-slate-700 hover:underline dark:text-slate-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-slate-700 hover:underline dark:text-slate-200">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* PROJECT */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Project
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/changelog" className="text-slate-700 hover:underline dark:text-slate-200">
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/lichesstrends"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:underline dark:text-slate-200"
                >
                  Github <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/yourhandle"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-700 hover:underline dark:text-slate-200"
                >
                  X / Twitter <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <div>© {new Date().getFullYear()} LichessTrends v{packageJson.version}.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/sources" className="hover:underline">
              Sources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}