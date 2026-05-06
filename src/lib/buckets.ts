/**
 * Infer the step size between sorted Elo buckets (e.g. 200 for 800, 1000, 1200).
 * Returns the smallest positive gap; falls back to `fallback` for empty or
 * single-element inputs, or when no positive gap exists.
 */
export function inferBucketStep(buckets: number[], fallback = 200): number {
  if (buckets.length < 2) return fallback
  let best = Number.POSITIVE_INFINITY
  for (let i = 1; i < buckets.length; i++) {
    const a = buckets[i - 1]
    const b = buckets[i]
    if (a === undefined || b === undefined) continue
    const d = b - a
    if (d > 0 && d < best) best = d
  }
  return Number.isFinite(best) ? best : fallback
}

/** Format a single bucket as an inclusive Elo range string (e.g. `1800-1999`). */
export function formatBucketRange(bucket: number, step: number, sep = '–'): string {
  return `${bucket}${sep}${bucket + step - 1}`
}
