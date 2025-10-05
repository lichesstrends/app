'use client'
import { useId } from 'react'

type Option<T extends string> = {
  label: string
  value: T
  disabled?: boolean
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  orientation = 'horizontal',
  className = '',
}: {
  options: Option<T>[]
  value: T
  onChange: (next: T) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  const id = useId()
  const isVertical = orientation === 'vertical'

  const rootBase =
    'overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700'
  const rootDir = isVertical ? 'flex flex-col' : 'inline-flex'

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={`${rootBase} ${rootDir} ${className}`}
    >
      {options.map((opt, idx) => {
        const selected = opt.value === value

        const baseBtn =
          'cursor-pointer select-none px-3 py-1 text-[11px] transition-colors outline-none ' +
          'focus-visible:ring-2 focus-visible:ring-sky-400 dark:focus-visible:ring-sky-500'

        const selectedBtn =
          'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 ' +
          // lock the hover color for the selected state
          'hover:bg-slate-900 dark:hover:bg-slate-100'

        const unselectedBtn =
          'text-slate-700 dark:text-slate-300 ' +
          'hover:bg-slate-200 dark:hover:bg-slate-800'

        const disabledBtn = 'opacity-50 cursor-not-allowed hover:bg-transparent'

        const divider = isVertical
          ? 'h-px w-full bg-slate-300/70 dark:bg-slate-700/70'
          : 'w-px h-full bg-slate-300/70 dark:bg-slate-700/70'

        return (
          <div key={`${id}-${opt.value}`} className={isVertical ? 'flex flex-col' : 'flex'}>
            <button
              role="tab"
              aria-selected={selected}
              type="button"
              disabled={opt.disabled}
              className={[
                baseBtn,
                opt.disabled ? disabledBtn : selected ? selectedBtn : unselectedBtn,
              ].join(' ')}
              onClick={() => !opt.disabled && onChange(opt.value)}
            >
              {opt.label}
            </button>
            {idx < options.length - 1 && <div className={divider} />}
          </div>
        )
      })}
    </div>
  )
}
