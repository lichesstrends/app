'use client'

import { memo } from 'react'
import { Card } from '@/components/ui/Card'
import { StaticMiniBoard } from './StaticMiniBoard'

export const OpeningCard = memo(function OpeningCard({
  name,
  range,
  onClick,
}: {
  name: string
  range: string
  onClick?: () => void
}) {
  return (
    <Card
      onClick={onClick}
      title={`${name} (${range})`}
      className="flex w-full min-w-[220px] cursor-pointer items-center p-3 text-left"
    >
      <div className="flex-shrink-0">
        <StaticMiniBoard range={range} />
      </div>

      <div className="ml-3 min-w-0 text-left">
        <div className="truncate text-sm font-medium text-slate-800 group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
          <span className="underline-offset-4 group-hover:underline">{name}</span>
        </div>

        <div className="mt-1">
          <span className="inline-flex select-none items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {range}
          </span>
        </div>
      </div>
    </Card>
  )
})
