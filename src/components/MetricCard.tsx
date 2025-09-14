import { ReactNode } from 'react'

export function MetricCard({
  title,
  value,
  subtitle,
  customChart,
}: {
  title: string
  value: string
  subtitle?: string
  customChart?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
      {customChart && <div className="mt-3">{customChart}</div>}
    </div>
  )
}
