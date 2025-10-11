'use client'
import { Info } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { TooltipContent } from '@/components/ui/TooltipContent'

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
      <div className="mb-2 flex justify-between">
        <div className="min-h-[20px] flex items-center text-sm leading-5 text-slate-600 dark:text-slate-300">
          {title}
        </div>

        <div className="flex items-center gap-2">
          {right}
          {info && (
            <div className="relative flex items-center">
              <button
                type="button"
                aria-label="Info"
                className="inline-flex h-5 w-5 items-center justify-center text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onMouseEnter={() => setHoverInfo(true)}
                onMouseLeave={() => setHoverInfo(false)}
              >
                <Info size={16} />
              </button>

              {hoverInfo && (
                <TooltipContent className="absolute right-0 top-7 w-72">
                  {info}
                </TooltipContent>
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