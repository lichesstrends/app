'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const FIVE_MINUTES_MS = 5 * 60 * 1000

/**
 * Server data is cached daily via `unstable_cache` in `lib/data`. The client
 * cache is intentionally short-lived: it deduplicates requests within a
 * navigation session without holding stale data after the user comes back.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: FIVE_MINUTES_MS,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}