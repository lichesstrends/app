import { Pipeline } from '@/components/about/Pipeline'
import { createMetadata } from '@/lib/metadata'

export const revalidate = 3600

export const metadata = createMetadata('About', 'Learn how LichessTrends works — from data ingestion to visualization.')

const techStack = [
  { name: 'Rust', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  { name: 'Next.js', color: 'bg-neutral-500/20 text-neutral-700 dark:text-neutral-300 border-neutral-500/30' },
  { name: 'React', color: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
  { name: 'MySQL', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { name: 'TanStack Query', color: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' },
  { name: 'Tailwind', color: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30' },
  { name: 'Recharts', color: 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30' },
  { name: 'React Flow', color: 'bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30' },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Page title with hint */}
      <div className="flex items-baseline gap-4 mb-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">About</h1>
        <span className="text-sm text-slate-400 dark:text-slate-500">Click on the pipeline steps for more info</span>
      </div>

      {/* Tech Stack - right under title, above flowchart */}
      <div className="pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">Built with</span>
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main pipeline area - break out of container to full viewport width */}
      <div className="flex-1 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
        <Pipeline />
      </div>
    </div>
  )
}
