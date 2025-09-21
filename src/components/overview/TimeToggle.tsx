'use client'
export type TimeMode = 'last' | 'ever'

export function TimeToggle({ mode, onChange }: { mode: TimeMode; onChange: (m: TimeMode) => void }) {
  return (
    <div className="ml-3 inline-flex overflow-hidden rounded-full border border-slate-300 text-xs dark:border-slate-700">
      <button
        className={`px-3 py-1 ${mode === 'last' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : ''}`}
        onClick={() => onChange('last')}
      >
        Last month
      </button>
      <button
        className={`px-3 py-1 ${mode === 'ever' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : ''}`}
        onClick={() => onChange('ever')}
      >
        All time
      </button>
    </div>
  )
}
