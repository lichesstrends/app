/**
 * Shared formatting utilities for consistent number display across the app.
 */

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

export function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return (n * 100).toFixed(1) + '%'
}

export function formatOneIn(share: number): string {
  if (!Number.isFinite(share) || share <= 0) return '—'
  const oneIn = Math.round(1 / share)
  if (!Number.isFinite(oneIn) || oneIn <= 0) return '—'
  return oneIn.toLocaleString()
}

export function safeAverage(total: number, count: number): number {
  if (count <= 0 || !Number.isFinite(total)) return 0
  return total / count
}

const SHORT_MONTH_NAMES = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.',
]

/** Format a `YYYY-MM` string as `Jan. 2026`. Returns the input on parse failure. */
export function formatYyyyMmShort(yyyyMm: string | null | undefined): string {
  if (!yyyyMm) return ''
  const m = /^(\d{4})-(\d{2})$/.exec(yyyyMm)
  if (!m) return yyyyMm
  const monthIdx = Number(m[2]) - 1
  if (monthIdx < 0 || monthIdx > 11) return yyyyMm
  return `${SHORT_MONTH_NAMES[monthIdx]} ${m[1]}`
}
