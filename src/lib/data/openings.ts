import { unstable_cache } from 'next/cache'
import type { RowDataPacket } from 'mysql2'
import type {
  YyyyMm,
  YearlyBumpResponse,
  YearlyBumpSeries,
  OpeningStatsResponse,
  OpeningEloDistribution,
} from '@/types'
import { getEcoFamily } from '../eco'
import { inferBucketStep } from '../buckets'
import { DAY_SECONDS, resolveMonthRange, selectRows } from './internal/sql'

async function fetchYearlyBumpTopK(
  topK: number,
  fromYear?: number,
  toYear?: number,
): Promise<YearlyBumpResponse> {
  const params: unknown[] = []
  let yearClause = ''
  if (fromYear !== undefined && toYear !== undefined) {
    yearClause = 'WHERE SUBSTRING(month,1,4) BETWEEN ? AND ?'
    params.push(String(fromYear), String(toYear))
  }

  const rows = await selectRows<RowDataPacket>(
    `SELECT SUBSTRING(month,1,4) AS y, eco_group AS eco, SUM(games) AS g
     FROM aggregates
     ${yearClause}
     GROUP BY y, eco
     ORDER BY y, g DESC`,
    params,
  )

  const yearsSet = new Set<number>()
  const byYear = new Map<number, { eco: string; games: number }[]>()
  const totalByYear = new Map<number, number>()
  const gamesByYearEco = new Map<string, number>()

  for (const r of rows) {
    const year = Number(r.y)
    const eco = String(r.eco)
    const games = Number(r.g ?? 0)
    yearsSet.add(year)
    const arr = byYear.get(year) ?? []
    arr.push({ eco, games })
    byYear.set(year, arr)
    totalByYear.set(year, (totalByYear.get(year) ?? 0) + games)
    gamesByYearEco.set(`${year}:${eco}`, games)
  }

  const years = Array.from(yearsSet).sort((a, b) => a - b)
  const topByYear = new Map<number, { eco: string; rank: number }[]>()
  const ecoSet = new Set<string>()
  for (const y of years) {
    const yearRows = (byYear.get(y) ?? []).sort((a, b) => b.games - a.games)
    const top = yearRows.slice(0, topK).map((r, i) => ({ eco: r.eco, rank: i + 1 }))
    topByYear.set(y, top)
    for (const t of top) ecoSet.add(t.eco)
  }

  const series: YearlyBumpSeries[] = []
  for (const eco of ecoSet) {
    const meta = getEcoFamily(eco)
    const data = years.map((y) => {
      const entry = topByYear.get(y)?.find((t) => t.eco === eco)
      if (!entry) return { x: y, y: null }
      const total = Math.max(1, totalByYear.get(y) ?? 1)
      const games = gamesByYearEco.get(`${y}:${eco}`) ?? 0
      return { x: y, y: entry.rank, share: games / total }
    })
    series.push({ id: eco, label: meta.label, data })
  }

  return { years, topK, series }
}

async function fetchOpeningStats(
  from: YyyyMm,
  to: YyyyMm,
  ecoRange: string,
): Promise<OpeningStatsResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const meta = getEcoFamily(ecoRange)

  const [openingRows, globalRows, whiteRows, blackRows] = await Promise.all([
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total,
              COALESCE(SUM(white_wins),0) AS ww,
              COALESCE(SUM(black_wins),0) AS bw,
              COALESCE(SUM(draws),0) AS dr
       FROM aggregates
       WHERE month BETWEEN ? AND ? AND eco_group = ?`,
      [f, t, ecoRange],
    ),
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total FROM aggregates WHERE month BETWEEN ? AND ?`,
      [f, t],
    ),
    selectRows<RowDataPacket>(
      `SELECT white_bucket AS bucket, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ? AND eco_group = ?
       GROUP BY white_bucket`,
      [f, t, ecoRange],
    ),
    selectRows<RowDataPacket>(
      `SELECT black_bucket AS bucket, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ? AND eco_group = ?
       GROUP BY black_bucket`,
      [f, t, ecoRange],
    ),
  ])

  const openingGames = Number(openingRows[0]?.total ?? 0)
  const aggWW = Number(openingRows[0]?.ww ?? 0)
  const aggBW = Number(openingRows[0]?.bw ?? 0)
  const aggDR = Number(openingRows[0]?.dr ?? 0)
  const aggTotal = Math.max(1, aggWW + aggBW + aggDR)
  const globalTotal = Math.max(1, Number(globalRows[0]?.total ?? 0))

  const bucketMap = new Map<number, number>()
  for (const r of whiteRows) {
    const k = Number(r.bucket)
    bucketMap.set(k, (bucketMap.get(k) ?? 0) + Number(r.g ?? 0))
  }
  for (const r of blackRows) {
    const k = Number(r.bucket)
    bucketMap.set(k, (bucketMap.get(k) ?? 0) + Number(r.g ?? 0))
  }

  const buckets = Array.from(bucketMap.keys()).sort((a, b) => a - b)
  const step = inferBucketStep(buckets)
  const minB = buckets[0] ?? 0
  const maxB = buckets[buckets.length - 1] ?? 0
  const totalAppearances = Math.max(1, openingGames * 2)
  const eloDistribution: OpeningEloDistribution[] = []
  for (let b = minB; b <= maxB; b += step) {
    const g = bucketMap.get(b) ?? 0
    eloDistribution.push({ bucket: b, games: g, pct: g / totalAppearances })
  }

  return {
    from: f,
    to: t,
    ecoGroup: ecoRange,
    displayName: meta.label,
    sampleSan: meta.sampleSan,
    totalGames: openingGames,
    share: openingGames / globalTotal,
    resultsAggregate: { white: aggWW / aggTotal, draw: aggDR / aggTotal, black: aggBW / aggTotal },
    eloDistribution,
  }
}

export const getYearlyBumpTopK = unstable_cache(fetchYearlyBumpTopK, ['getYearlyBumpTopK'], {
  revalidate: DAY_SECONDS,
})
export const getOpeningStats = unstable_cache(fetchOpeningStats, ['getOpeningStats'], {
  revalidate: DAY_SECONDS,
})
