import { TopOpeningsResponse } from '@/types'
import { TopOpeningItem } from './TopOpeningItem'

export function TopOpeningsPanel({ data }: { data?: TopOpeningsResponse | null }) {
  const items = Array.isArray(data?.items) ? data!.items.slice(0, 3) : []
  const slots = [items[0], items[1], items[2]]

  return (
    <div className="grid h-full w-full grid-rows-3 gap-3 min-w-0">
      {slots.map((item, i) => (
        <TopOpeningItem key={item ? `${item.ecoGroup}-${i}` : `empty-${i}`} item={item} index={i} />
      ))}
    </div>
  )
}
