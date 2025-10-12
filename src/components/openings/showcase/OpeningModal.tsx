'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export function OpeningModal({
  open,
  onClose,
  name,
  range,
  san,
}: {
  open: boolean
  onClose: () => void
  name: string
  range: string
  san: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <X size={16} />
        </button>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {range}
            </span>
          </div>

          {/* Mock content for now */}
          <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <div><strong>Sample SAN:</strong> <code className="text-[12px]">{san}</code></div>
            <p>
              This is placeholder content. Here you could show deeper stats, lines, popularity by rating,
              win/draw rates, or a larger interactive board.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
