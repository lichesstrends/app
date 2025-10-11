'use client'
import type { TopOpeningsResponse } from '@/types'
import { MiniOpeningBoard } from './MiniOpeningBoard'

export function TopOpeningItem({
  item,
  index,
}: {
  item: TopOpeningsResponse['items'][0] | undefined
  index: number
}) {
  if (!item) {
    return <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
  }

  return (
    <div className="min-w-0 flex h-full items-center rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      {/* LEFT: mini chessboard */}
      <div className="flex-shrink-0">
        <MiniOpeningBoard san={item.sampleMovesSAN} />
      </div>

      {/* RIGHT: info */}
      <div className="ml-3 flex-1 min-w-0">
        <div
          className="block w-full truncate text-sm font-medium"
          title={item.displayName}
        >
          {index + 1}. {item.displayName}
        </div>

        <div className="mt-0.5">
          <span
            title={item.ecoGroup}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5
                       text-[11px] font-medium text-slate-700 shadow-sm select-none
                       dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {item.ecoGroup}
          </span>
        </div>

        <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          {(item.share * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}
