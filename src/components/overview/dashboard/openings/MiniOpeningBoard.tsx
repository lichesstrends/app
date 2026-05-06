'use client'

import { AnimatedMiniBoard } from '@/components/openings/showcase/AnimatedMiniBoard'

/**
 * Thin wrapper around AnimatedMiniBoard for the dashboard's top-openings panel.
 * The board always plays (no hover-to-pause behavior here).
 */
export function MiniOpeningBoard({ san }: { san: string }) {
  return (
    <div className="h-30 w-30 overflow-hidden rounded">
      <AnimatedMiniBoard san={san} playing moveIntervalMs={1200} />
    </div>
  )
}
