'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { getAllEcoFamilies, type EcoFamily } from '@/lib/eco'
import { OpeningsRow } from './OpeningsRow'
import { OpeningCard } from './OpeningCard'
import { OpeningModal } from './OpeningModal'

function splitInHalf<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

export function OpeningsShowcase() {
  const all = getAllEcoFamilies()
  const [first, second] = splitInHalf(all)

  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{
    open: boolean
    item?: EcoFamily
  }>({ open: false })

  const filtered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return all.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.range.toLowerCase().includes(q)
    )
  }, [all, search])

  const onOpen = (item: EcoFamily) => setModal({ open: true, item })
  const onClose = () => setModal({ open: false, item: undefined })

  const clearSearch = () => setSearch('')

  const showMarquee = filtered === null

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">All opening families</h2>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search openings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {showMarquee ? (
        <div className="relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen overflow-hidden">
          <div className="space-y-2">
            <OpeningsRow items={first} reverse={false} speed={14} gap={16} onOpen={onOpen} />
            <OpeningsRow items={second} reverse={true} speed={14} gap={16} onOpen={onOpen} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered && filtered.length > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} opening{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}
          {filtered && filtered.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No openings found for &ldquo;{search}&rdquo;
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-2 text-sm text-sky-600 hover:underline dark:text-sky-400"
              >
                Clear search
              </button>
            </div>
          ) : filtered ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((f) => (
                <OpeningCard
                  key={f.range}
                  name={f.label}
                  range={f.range}
                  san={f.sampleSan}
                  onClick={() => onOpen(f)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      <OpeningModal
        open={modal.open}
        onClose={onClose}
        name={modal.item?.label ?? ''}
        ecoRange={modal.item?.range ?? ''}
        san={modal.item?.sampleSan ?? ''}
      />
    </section>
  )
}
