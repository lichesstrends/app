import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Shared shell for the app's cards. Renders as a link or button when given
 * `href`/`onClick`, or a plain container otherwise. Interactive cards get a
 * hover state that grows the border. Callers control layout via `className`.
 */

const CARD_STATIC =
  'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 ' +
  'dark:border-slate-800 dark:bg-slate-900'

const CARD_INTERACTIVE =
  'hover:border-slate-300 hover:shadow-md hover:ring-2 hover:ring-inset hover:ring-slate-200 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400 ' +
  'dark:hover:border-slate-700 dark:hover:ring-slate-700 dark:focus-visible:ring-sky-500'

type CardProps = {
  children: ReactNode
  className?: string
  href?: string
  newTab?: boolean
  onClick?: () => void
  title?: string
  ariaLabel?: string
}

export function Card({ children, className = '', href, newTab, onClick, title, ariaLabel }: CardProps) {
  const interactive = Boolean(href || onClick)
  const cls = `${CARD_STATIC} ${interactive ? CARD_INTERACTIVE : ''} ${className}`

  if (href) {
    const external = newTab || /^https?:/.test(href)
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={cls} title={title} aria-label={ariaLabel}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls} title={title} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} title={title} aria-label={ariaLabel}>
        {children}
      </button>
    )
  }

  return (
    <div className={cls} title={title} aria-label={ariaLabel}>
      {children}
    </div>
  )
}
