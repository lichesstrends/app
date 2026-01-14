import { ApiDocsClient } from './ApiDocsClient'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata('API', 'Interactive API documentation for the LichessTrends API.')

export default function ApiPage() {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 md:px-8 pb-8">
      <div className="max-w-[1800px] mx-auto">
        <div 
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg"
          style={{ height: 'calc(100vh - 10rem)', overflow: 'auto' }}
        >
          <ApiDocsClient />
        </div>
      </div>
    </div>
  )
}
