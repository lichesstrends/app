'use client'
import { ReactNode } from 'react'
import { Info } from 'lucide-react'

export function HelpTip({ children }: { children: ReactNode }) {
  return (
    <div className="relative group">
      <button
        type="button"
        aria-label="Help"
        className="flex h-5 w-5 items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <Info size={16} strokeWidth={2} />
      </button>

      <div
        className="
          pointer-events-none absolute right-0 z-20 mt-2 w-72 rounded-lg border
          bg-white/95 p-3 text-[13px] leading-relaxed opacity-0 shadow-md backdrop-blur
          transition-opacity duration-150 group-hover:opacity-100
          border-slate-300 text-slate-900
          dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-100
        "
      >
        {children}
      </div>
    </div>
  )
}
