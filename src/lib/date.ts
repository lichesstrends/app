// src/lib/date.ts
export type YyyyMm = `${number}${number}${number}${number}-${number}${number}`

export function isYyyyMm(x: unknown): x is YyyyMm {
  return typeof x === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(x)
}

export function ymToInt(ym: YyyyMm): number {
  const y = Number(ym.slice(0, 4))
  const m = Number(ym.slice(5, 7))
  return y * 12 + (m - 1)
}

export function intToYm(i: number): YyyyMm {
  const y = Math.floor(i / 12)
  const m = (i % 12) + 1
  const mm = m < 10 ? `0${m}` : String(m)
  return `${y}-${mm}` as YyyyMm
}

export function addMonths(ym: YyyyMm, delta: number): YyyyMm {
  return intToYm(ymToInt(ym) + delta)
}

export function clampRange(
  min: YyyyMm,
  max: YyyyMm,
  from: YyyyMm,
  to: YyyyMm
): { from: YyyyMm; to: YyyyMm } {
  let f = from
  let t = to
  if (ymToInt(f) < ymToInt(min)) f = min
  if (ymToInt(f) > ymToInt(max)) f = max
  if (ymToInt(t) < ymToInt(min)) t = min
  if (ymToInt(t) > ymToInt(max)) t = max
  if (ymToInt(f) > ymToInt(t)) [f, t] = [t, f]
  return { from: f, to: t }
}

export function lastNMonthsEndingAt(max: YyyyMm, n: number): { from: YyyyMm; to: YyyyMm } {
  const to = max
  const from = addMonths(max, -(n - 1))
  return { from, to }
}

export function previousMonth(ym: YyyyMm): YyyyMm {
  return addMonths(ym, -1)
}
