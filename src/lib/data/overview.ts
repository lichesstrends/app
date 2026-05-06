import { unstable_cache } from 'next/cache'
import type { RowDataPacket } from 'mysql2'
import type {
  YyyyMm,
  MonthlyGamesPoint,
  MonthlyGamesResponse,
  TotalGamesResponse,
  ResultSharePoint,
  ResultSharesResponse,
  TopOpeningResponse,
  ActivityDistributionResponse,
  EloHeatmapResponse,
  TopOpeningsResponse,
} from '@/types'
import { lastNMonthsEndingAt, previousMonth } from '../date'
import { getEcoFamily } from '../eco'
import { inferBucketStep } from '../buckets'
import { DAY_SECONDS, resolveMonthRange, selectRows } from './internal/sql'
import { getMinMaxMonths } from './meta'

async function fetchTotalGames(from: YyyyMm, to: YyyyMm): Promise<TotalGamesResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const rows = await selectRows<RowDataPacket>(
    `SELECT COALESCE(SUM(games),0) AS totalGames
     FROM aggregates
     WHERE month BETWEEN ? AND ?`,
    [f, t],
  )
  return { from: f, to: t, totalGames: Number(rows[0]?.totalGames ?? 0) }
}

async function fetchMonthlyGames(from: YyyyMm, to: YyyyMm): Promise<MonthlyGamesResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const rows = await selectRows<RowDataPacket>(
    `SELECT month, SUM(games) AS games
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY month
     ORDER BY month`,
    [f, t],
  )
  const points: MonthlyGamesPoint[] = rows.map((r) => ({
    month: r.month as YyyyMm,
    games: Number(r.games ?? 0),
  }))
  return { from: f, to: t, points }
}

async function fetchLastMonthAndPrev12() {
  const { maxMonth } = await getMinMaxMonths()
  const { from, to } = lastNMonthsEndingAt(maxMonth, 12)
  const series = await getMonthlyGames(from, to)
  const lastMonth = maxMonth
  const monthBefore = previousMonth(maxMonth)

  const lastMap = new Map(series.points.map((p) => [p.month, p.games]))
  const lastGames = lastMap.get(lastMonth) ?? 0
  const prevGames = lastMap.get(monthBefore) ?? 0
  const pct = prevGames > 0 ? (lastGames - prevGames) / prevGames : 0

  return { series, lastMonth, lastGames, prevGames, pct }
}

async function fetchResultShares(from: YyyyMm, to: YyyyMm): Promise<ResultSharesResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const rows = await selectRows<RowDataPacket>(
    `SELECT month,
            SUM(white_wins) AS ww, SUM(black_wins) AS bw, SUM(draws) AS dr
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY month
     ORDER BY month`,
    [f, t],
  )
  const points: ResultSharePoint[] = rows.map((r) => {
    const ww = Number(r.ww ?? 0)
    const bw = Number(r.bw ?? 0)
    const dr = Number(r.dr ?? 0)
    const tot = Math.max(1, ww + bw + dr)
    return { month: r.month as YyyyMm, white: ww / tot, black: bw / tot, draw: dr / tot }
  })
  return { from: f, to: t, points }
}

async function fetchTopOpening(from: YyyyMm, to: YyyyMm): Promise<TopOpeningResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const [topRows, totalRows] = await Promise.all([
    selectRows<RowDataPacket>(
      `SELECT eco_group AS eco, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ?
       GROUP BY eco_group
       ORDER BY g DESC
       LIMIT 1`,
      [f, t],
    ),
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total
       FROM aggregates
       WHERE month BETWEEN ? AND ?`,
      [f, t],
    ),
  ])

  const ecoGroup = (topRows[0]?.eco as string | undefined) ?? 'C60-C99'
  const games = Number(topRows[0]?.g ?? 0)
  const tot = Math.max(1, Number(totalRows[0]?.total ?? 0))
  const oneIn = Math.max(1, Math.round(tot / Math.max(1, games)))

  const meta = getEcoFamily(ecoGroup)
  return {
    from: f,
    to: t,
    ecoGroup,
    games,
    oneIn,
    displayName: meta.label,
    sampleMovesSAN: meta.sampleSan,
  }
}

async function fetchActivityDistribution(
  from: YyyyMm,
  to: YyyyMm,
): Promise<ActivityDistributionResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const [wrows, brows, trow] = await Promise.all([
    selectRows<RowDataPacket>(
      `SELECT white_bucket AS bucket, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ?
       GROUP BY white_bucket
       ORDER BY bucket`,
      [f, t],
    ),
    selectRows<RowDataPacket>(
      `SELECT black_bucket AS bucket, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ?
       GROUP BY black_bucket
       ORDER BY bucket`,
      [f, t],
    ),
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total
       FROM aggregates
       WHERE month BETWEEN ? AND ?`,
      [f, t],
    ),
  ])

  const totalGames = Number(trow[0]?.total ?? 0)
  const totalAppearances = Math.max(1, totalGames * 2)

  const map = new Map<number, number>()
  for (const r of wrows) {
    const k = Number(r.bucket)
    map.set(k, (map.get(k) ?? 0) + Number(r.g ?? 0))
  }
  for (const r of brows) {
    const k = Number(r.bucket)
    map.set(k, (map.get(k) ?? 0) + Number(r.g ?? 0))
  }

  const buckets = Array.from(map.keys()).sort((a, b) => a - b)
  const step = inferBucketStep(buckets)
  const minB = buckets[0]
  const maxB = buckets[buckets.length - 1]
  const points: ActivityDistributionResponse['points'] = []
  if (minB !== undefined && maxB !== undefined) {
    for (let b = minB; b <= maxB; b += step) {
      const g = map.get(b) ?? 0
      points.push({ bucket: b, games: g, pct: g / totalAppearances })
    }
  }
  return { from: f, to: t, points }
}

/**
 * Elo matchup heatmap, optionally filtered to a single ECO group/range.
 *
 * `eco` accepts either a single ECO code (e.g. `B20`) or a stored ECO range
 * (e.g. `B20-B99`); validation lives at the route boundary.
 */
async function fetchEloHeatmap(
  from: YyyyMm,
  to: YyyyMm,
  eco?: string,
): Promise<EloHeatmapResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const ecoClause = eco ? 'AND eco_group = ?' : ''
  const ecoParams: unknown[] = eco ? [eco] : []

  const [rows, trow] = await Promise.all([
    selectRows<RowDataPacket>(
      `SELECT white_bucket AS wb,
              black_bucket AS bb,
              SUM(games)       AS g,
              SUM(white_wins)  AS ww,
              SUM(black_wins)  AS bw,
              SUM(draws)       AS dr
       FROM aggregates
       WHERE month BETWEEN ? AND ? ${ecoClause}
       GROUP BY white_bucket, black_bucket`,
      [f, t, ...ecoParams],
    ),
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total
       FROM aggregates
       WHERE month BETWEEN ? AND ? ${ecoClause}`,
      [f, t, ...ecoParams],
    ),
  ])

  const totalGames = Math.max(1, Number(trow[0]?.total ?? 0))

  const bucketsSet = new Set<number>()
  const cellMap = new Map<string, { games: number; ww: number; bw: number; dr: number }>()

  for (const r of rows) {
    const wb = Number(r.wb)
    const bb = Number(r.bb)
    bucketsSet.add(wb)
    bucketsSet.add(bb)
    cellMap.set(`${wb}:${bb}`, {
      games: Number(r.g ?? 0),
      ww: Number(r.ww ?? 0),
      bw: Number(r.bw ?? 0),
      dr: Number(r.dr ?? 0),
    })
  }

  const buckets = Array.from(bucketsSet).sort((a, b) => a - b)
  const step = inferBucketStep(buckets)
  const minB = buckets[0] ?? 0
  const maxB = buckets[buckets.length - 1] ?? 0

  const cells: EloHeatmapResponse['cells'] = []
  for (let wb = minB; wb <= maxB; wb += step) {
    for (let bb = minB; bb <= maxB; bb += step) {
      const entry = cellMap.get(`${wb}:${bb}`)
      cells.push({
        whiteBucket: wb,
        blackBucket: bb,
        games: entry?.games ?? 0,
        whiteWins: entry?.ww ?? 0,
        blackWins: entry?.bw ?? 0,
        draws: entry?.dr ?? 0,
      })
    }
  }

  const bucketAxis =
    buckets.length === 0
      ? []
      : Array.from({ length: Math.max(0, (maxB - minB) / step + 1) }, (_, i) => minB + i * step)

  return { from: f, to: t, buckets: bucketAxis, cells, totalGames }
}

async function fetchTopOpenings(
  from: YyyyMm,
  to: YyyyMm,
  limit: number,
): Promise<TopOpeningsResponse> {
  const { from: f, to: t } = await resolveMonthRange(from, to)
  const [rows, trow] = await Promise.all([
    selectRows<RowDataPacket>(
      `SELECT eco_group AS eco, SUM(games) AS g
       FROM aggregates
       WHERE month BETWEEN ? AND ?
       GROUP BY eco_group
       ORDER BY g DESC
       LIMIT ?`,
      [f, t, limit],
    ),
    selectRows<RowDataPacket>(
      `SELECT COALESCE(SUM(games),0) AS total
       FROM aggregates
       WHERE month BETWEEN ? AND ?`,
      [f, t],
    ),
  ])

  const total = Math.max(1, Number(trow[0]?.total ?? 0))
  const items = rows.map((r) => {
    const eco = String(r.eco)
    const meta = getEcoFamily(eco)
    const games = Number(r.g ?? 0)
    return {
      ecoGroup: eco,
      displayName: meta.label,
      sampleMovesSAN: meta.sampleSan,
      games,
      share: games / total,
    }
  })
  return { from: f, to: t, items }
}

export const getTotalGames = unstable_cache(fetchTotalGames, ['getTotalGames'], { revalidate: DAY_SECONDS })
export const getMonthlyGames = unstable_cache(fetchMonthlyGames, ['getMonthlyGames'], { revalidate: DAY_SECONDS })
export const getLastMonthAndPrev12 = unstable_cache(fetchLastMonthAndPrev12, ['getLastMonthAndPrev12'], { revalidate: DAY_SECONDS })
export const getResultShares = unstable_cache(fetchResultShares, ['getResultShares'], { revalidate: DAY_SECONDS })
export const getTopOpening = unstable_cache(fetchTopOpening, ['getTopOpening'], { revalidate: DAY_SECONDS })
export const getActivityDistribution = unstable_cache(fetchActivityDistribution, ['getActivityDistribution'], { revalidate: DAY_SECONDS })
export const getEloHeatmap = unstable_cache(fetchEloHeatmap, ['getEloHeatmap'], { revalidate: DAY_SECONDS })
export const getTopOpenings = unstable_cache(fetchTopOpenings, ['getTopOpenings'], { revalidate: DAY_SECONDS })
