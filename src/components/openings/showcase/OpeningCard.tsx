'use client'

import { memo } from 'react'
import { StaticMiniBoard } from './StaticMiniBoard'

export const OpeningCard = memo(function OpeningCard({
  name,
  range,
  san,
  onClick,
}: {
  name: string
  range: string
  san: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full min-w-[220px] items-center rounded-xl border border-slate-200 bg-white p-3 shadow-sm outline-none transition
                 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-400
                 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-sky-500"
      title={`${name} (${range})`}
    >
      <div className="flex-shrink-0">
        <StaticMiniBoard san={san} />
      </div>

      <div className="ml-3 min-w-0 text-left">
        <div
          className="truncate text-sm font-medium text-slate-800 group-hover:text-sky-700 group-focus:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300 dark:group-focus:text-sky-300"
        >
          <span className="underline-offset-4 group-hover:underline group-focus:underline">
            {name}
          </span>
        </div>

        <div className="mt-1">
          <span className="inline-flex select-none items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {range}
          </span>
        </div>
      </div>
    </button>
  )
})
