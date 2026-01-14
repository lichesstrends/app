'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Scalar (it's Vue-based under the hood)
const ApiReference = dynamic(
  () => import('@/components/api/ApiReference').then(mod => mod.ApiReference),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <div className="text-slate-400">Loading API documentation...</div>
    </div>
  )}
)

export function ApiDocsClient() {
  return <ApiReference />
}
