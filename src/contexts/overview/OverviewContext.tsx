'use client'
import { createContext, useContext, useMemo, useState } from 'react'
import type { YyyyMm } from '@/types'
import { useMonths } from '@/contexts/meta/MonthsProvider'

export enum OverviewMode {
  Last = 'last',
  Ever = 'ever',
}

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

/**
 * Combine global months + current mode into a concrete `{from, to}` range.
 *
 * - `Last` covers only the latest available month (single-month range).
 * - `Ever` covers the full data window.
 */
export function useRangeFromMode(): { from: YyyyMm; to: YyyyMm } | null {
  const { months } = useMonths()
  const { mode } = useOverview()
  if (!months) return null
  if (mode === OverviewMode.Last) {
    return { from: months.maxMonth, to: months.maxMonth }
  }
  return { from: months.minMonth, to: months.maxMonth }
}