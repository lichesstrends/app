'use client'

import { AnimatedMiniBoard } from '@/components/openings/showcase/AnimatedMiniBoard'

/** Dashboard top-openings board; always animating. */
export function MiniOpeningBoard({ san }: { san: string }) {
  return <AnimatedMiniBoard san={san} playing moveIntervalMs={1200} />
}

