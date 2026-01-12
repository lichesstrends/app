'use client'

import Marquee from 'react-fast-marquee'
import type { EcoFamily } from '@/lib/eco'
import { OpeningCard } from './OpeningCard'

/**
 * One fast, smooth marquee row (react-fast-marquee).
 * - Two rows will use this with opposite directions.
 * - Consistent spacing: each child has a right margin AND we append a spacer.
 *   This guarantees a gap at the loop boundary.
 */
export function OpeningsRow({
  items,
  reverse = false,
  speed = 16,     // calmer; reduce if you want even slower
  gap = 16,       // px
  onOpen,
}: {
  items: EcoFamily[]
  reverse?: boolean
  speed?: number
  gap?: number
  onOpen?: (o: EcoFamily) => void
}) {
  return (
    <Marquee
      direction={reverse ? 'right' : 'left'}
      speed={speed}
      gradient={false}
      className="py-2"
    >
      {/* Items with trailing margin to keep visual gap */}
      {items.map((f) => (
        <div key={f.range} style={{ marginRight: gap }}>
          <OpeningCard
            name={f.label}
            range={f.range}
            san={f.sampleSan}
            onClick={() => onOpen?.(f)}
          />
        </div>
      ))}
      {/* Final spacer so the loop boundary also has a gap */}
      <div style={{ width: gap }} />
    </Marquee>
  )
}
