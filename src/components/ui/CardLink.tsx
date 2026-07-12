import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { Card } from './Card'

type CardLinkProps = {
  href: string
  title: string
  body?: string
  icon?: ReactNode
  newTab?: boolean
}

export function CardLink({ href, title, body, icon, newTab = false }: CardLinkProps) {
  const external = newTab || /^https?:/.test(href)

  return (
    <Card href={href} newTab={newTab} className="block cursor-pointer p-3">
      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700 dark:text-slate-200">
        {icon && (
          <span className="text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
            {icon}
          </span>
        )}
        <span>{title}</span>
        {external && (
          <ExternalLink
            size={12}
            className="-translate-y-0.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500"
          />
        )}
      </div>
      {body && (
        <p className="mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300">{body}</p>
      )}
    </Card>
  )
}
