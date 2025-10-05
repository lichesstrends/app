'use client'
import { Info } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export function DashboardCard({
  title,
  right,
  info,
  children,
  minHeightClassName = '',
}: {
  title: ReactNode
  right?: ReactNode
  info?: ReactNode
  children: ReactNode
  minHeightClassName?: string
}) {
  const [hoverInfo, setHoverInfo] = useState(false)

  return (
    <div className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${minHeightClassName}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {title}
        </div>

        <div className="flex items-center gap-2">
          {right}
          {info && (
            <div className="relative">
              <button
                type="button"
                aria-label="Info"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                onMouseEnter={() => setHoverInfo(true)}
                onMouseLeave={() => setHoverInfo(false)}
              >
                <Info size={16} />
              </button>

              {hoverInfo && (
                <div className="pointer-events-none absolute right-0 top-7 z-10 w-72 rounded-lg border border-slate-300 bg-white p-3 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {info}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body (vertically centered content) */}
      <div className="flex flex-1 items-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
