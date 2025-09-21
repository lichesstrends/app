'use client'
import { OverviewMode, useOverview } from '@/contexts/overview/OverviewContext'

export function TimeToggle() {
  const { mode, setMode } = useOverview()
  return (
    <div className="ml-3 inline-flex overflow-hidden rounded-full border border-slate-300 text-xs dark:border-slate-700">
      <button
        className={`px-3 py-1 ${mode === OverviewMode.Last ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : ''}`}
        onClick={() => setMode(OverviewMode.Last)}
      >
        Last month
      </button>
      <button
        className={`px-3 py-1 ${mode === OverviewMode.Ever ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : ''}`}
        onClick={() => setMode(OverviewMode.Ever)}
      >
        All time
      </button>
    </div>
  )
}