import { TopOpeningsResponse } from '@/types'

export function TopOpeningsPanel({ data }: { data?: TopOpeningsResponse | null }) {
  const items = Array.isArray(data?.items) ? data!.items.slice(0, 3) : []
  const slots = [items[0], items[1], items[2]]

  return (
    <div className="grid h-full grid-rows-3 gap-3">
      {slots.map((it, i) => (
        <div
          key={it ? `${it.ecoGroup}-${i}` : `empty-${i}`}
          className="flex h-full items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800"
        >
          {it ? (
            <>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{i + 1}. {it.displayName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{it.ecoGroup}</div>
              </div>
              <div className="text-sm tabular-nums">
                {(it.share * 100).toFixed(1)}%
              </div>
            </>
          ) : (
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          )}
        </div>
      ))}
    </div>
  )
}
