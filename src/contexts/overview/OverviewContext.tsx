'use client'
import { createContext, useContext, useMemo, useState } from 'react'
import type { YyyyMm } from '@/types'
import { lastNMonthsEndingAt } from '@/lib/date'
import { useMonths } from '@/contexts/meta/MonthsProvider'

export enum OverviewMode {
  Last = 'last',
  Ever = 'ever',
}

/** How many months "Last" covers, ending at (and including) the latest month. */
export const LAST_MODE_MONTHS = 12

type Ctx = {
  mode: OverviewMode
  setMode: (m: OverviewMode) => void
}

const OverviewCtx = createContext<Ctx | null>(null)

export function OverviewProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<OverviewMode>(OverviewMode.Last)
  const value = useMemo<Ctx>(() => ({ mode, setMode }), [mode])
  return <OverviewCtx.Provider value={value}>{children}</OverviewCtx.Provider>
}

export function useOverview() {
  const ctx = useContext(OverviewCtx)
  if (!ctx) throw new Error('useOverview must be used inside <OverviewProvider>')
  return ctx
}

/** Combine global months + current mode into a concrete `{from, to}` range. */
export function useRangeFromMode(): { from: YyyyMm; to: YyyyMm } | null {
  const { months } = useMonths()
  const { mode } = useOverview()
  if (!months) return null
  if (mode === OverviewMode.Last) {
    return lastNMonthsEndingAt(months.maxMonth, LAST_MODE_MONTHS)
  }
  return { from: months.minMonth, to: months.maxMonth }
}