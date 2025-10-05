'use client'
import { useOverview, OverviewMode } from '@/contexts/overview/OverviewContext'
import { SegmentedToggle } from '@/components/ui/SegmentedToggle'

export function TimeToggle() {
  const { mode, setMode } = useOverview()
  return (
    <SegmentedToggle
      orientation="horizontal"
      value={mode}
      onChange={(m) => setMode(m as OverviewMode)}
      options={[
        { label: 'Last month', value: OverviewMode.Last },
        { label: 'All time',   value: OverviewMode.Ever },
      ]}
    />
  )
}
