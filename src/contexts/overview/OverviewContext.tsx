'use client'
import { createContext, useContext, useState } from 'react'
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
  return <OverviewCtx.Provider value={{ mode, setMode }}>{children}</OverviewCtx.Provider>
}

export function useOverview() {
  const ctx = useContext(OverviewCtx)
  if (!ctx) throw new Error('useOverview must be used inside <OverviewProvider>')
  return ctx
}

/** Combine global months + current mode into a concrete {from,to} range. */
export function useRangeFromMode(): { from: YyyyMm; to: YyyyMm } | null {
  const { months } = useMonths()
  const { mode } = useOverview()
  if (!months) return null
  const to = months.maxMonth
  const from = mode === OverviewMode.Last ? months.maxMonth : months.minMonth
  return { from, to }
}