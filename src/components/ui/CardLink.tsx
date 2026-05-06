import Link from 'next/link'
import type { ReactNode } from 'react'

type CardLinkProps = {
  href: string
  title: string
  body?: string
  icon?: ReactNode
  newTab?: boolean
  /** Optional call-to-action shown at the bottom of the card. */
  cta?: string
  /** Use the larger padded layout (matches the legacy `Explore` style). */
  size?: 'sm' | 'md'
}

export function CardLink({
  href,
  title,
  body,
  icon,
  newTab = false,
  cta,
  size = 'sm',
}: CardLinkProps) {
  const padding = size === 'md' ? 'p-6' : 'p-3'
  return (
    <Link
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className={`group block rounded-2xl border border-slate-200 bg-white ${padding} shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none dark:border-slate-800 dark:bg-slate-900`}
    >
      <div
        className={
          size === 'md'
            ? 'text-lg font-semibold'
            : 'flex items-center gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-200'
        }
      >
        {icon && size === 'sm' && (
          <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
            {icon}
          </span>
        )}
        <span>{title}</span>
      </div>
      {body && (
        <p
          className={
            size === 'md'
              ? 'mt-2 text-sm text-slate-600 dark:text-slate-300'
              : 'mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300'
          }
        >
          {body}
        </p>
      )}
      {cta && (
        <div className="mt-4 text-sm text-sky-600 group-hover:underline dark:text-sky-400">{cta}</div>
      )}
    </Link>
  )
}
