'use client'

import { useState } from 'react'
import { getAllEcoFamilies, type EcoFamily } from '@/lib/eco'
import { OpeningsRow } from './OpeningsRow'
import { OpeningModal } from './OpeningModal'

function splitInHalf<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

/**
 * Full-bleed, two-row showcase.
 * - Uses react-fast-marquee for speed & smoothness.
 * - Split openings into halves (no duplication across rows).
 * - Click a card to open a modal (mock content for now).
 */
export function OpeningsShowcase() {
  const all = getAllEcoFamilies()
  const [first, second] = splitInHalf(all)

  const [modal, setModal] = useState<{
    open: boolean
    item?: EcoFamily
  }>({ open: false })

  const onOpen = (item: EcoFamily) => setModal({ open: true, item })
  const onClose = () => setModal({ open: false, item: undefined })

  return (
    <section className="space-y-4">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold">All opening families</h2>
      </div>

      {/* full-bleed wrapper */}
      <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen">
        <div className="space-y-2">
          <OpeningsRow items={first}  reverse={false} speed={14} gap={16} onOpen={onOpen} />
          <OpeningsRow items={second} reverse={true}  speed={14} gap={16} onOpen={onOpen} />
        </div>
      </div>

      <OpeningModal
        open={modal.open}
        onClose={onClose}
        name={modal.item?.label ?? ''}
        range={modal.item?.range ?? ''}
        san={modal.item?.sampleSan ?? ''}
      />
    </section>
  )
}
