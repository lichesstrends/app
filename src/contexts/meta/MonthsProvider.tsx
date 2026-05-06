'use client'
import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { MinMaxMonths } from '@/types'

type MonthsCtx = {
  months: MinMaxMonths | null
  isLoading: boolean
}

const Ctx = createContext<MonthsCtx | null>(null)

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export function MonthsProvider({ children }: { children: React.ReactNode }) {
  const q = useQuery({
    queryKey: ['meta', 'months'],
    queryFn: async () => {
      const r = await fetch('/api/meta/months')
      if (!r.ok) throw new Error('Failed to load months')
      return (await r.json()) as MinMaxMonths
    },
    staleTime: ONE_DAY_MS,
  })

  const value = useMemo<MonthsCtx>(
    () => ({ months: q.data ?? null, isLoading: q.isLoading }),
    [q.data, q.isLoading],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMonths() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMonths must be used inside <MonthsProvider>')
  return ctx
}