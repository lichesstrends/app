import { ReactNode } from 'react'
import clsx from 'clsx'

export function TooltipContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'pointer-events-none z-10 rounded-lg border border-slate-300 bg-white p-3 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
        className
      )}
    >
      {children}
    </div>
  )
}