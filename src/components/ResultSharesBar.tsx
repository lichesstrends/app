'use client'

export function ResultSharesBar({
  title,
  white, // 0..1
  draw,  // 0..1
  black, // 0..1
  subtitle,
}: {
  title: string
  white: number
  draw: number
  black: number
  subtitle?: string
}) {
  const w = Math.max(0, Math.min(1, white))
  const d = Math.max(0, Math.min(1, draw))
  const b = Math.max(0, Math.min(1, black))
  const total = w + d + b || 1
  const W = (w / total) * 100
  const D = (d / total) * 100
  const B = (b / total) * 100

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
      <div className="mt-3 h-8 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex h-full">
          <div className="h-full" style={{ width: `${W}%` }} title={`White ${(W).toFixed(1)}%`}>
            <div className="h-full w-full bg-white dark:bg-slate-200" />
          </div>
          <div className="h-full" style={{ width: `${D}%` }} title={`Draw ${(D).toFixed(1)}%`}>
            <div className="h-full w-full bg-slate-400 dark:bg-slate-500" />
          </div>
          <div className="h-full" style={{ width: `${B}%` }} title={`Black ${(B).toFixed(1)}%`}>
            <div className="h-full w-full bg-slate-900 dark:bg-slate-800" />
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
        W {(W).toFixed(1)}% · D {(D).toFixed(1)}% · B {(B).toFixed(1)}%
      </div>
      {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
    </div>
  )
}