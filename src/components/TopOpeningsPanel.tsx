import { TopOpeningsResponse } from '@/types'

export function TopOpeningsPanel({ data }: { data?: TopOpeningsResponse | null }) {
  const items = Array.isArray(data?.items) ? data!.items : []

  if (items.length === 0) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400">
        No data available.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={`${it.ecoGroup}-${i}`}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800"
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{i + 1}. {it.displayName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{it.ecoGroup}</div>
          </div>
          <div className="text-sm tabular-nums">
            {(it.share * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  )
}