'use client'

import Marquee from 'react-fast-marquee'
import type { EcoFamily } from '@/lib/eco'
import { OpeningCard } from './OpeningCard'

/** One marquee row of opening cards; two rows scroll in opposite directions. */
export function OpeningsRow({
  items,
  reverse = false,
  speed = 16,
  gap = 16,
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
            onClick={() => onOpen?.(f)}
          />
        </div>
      ))}
      {/* Final spacer so the loop boundary also has a gap */}
      <div style={{ width: gap }} />
    </Marquee>
  )
}
