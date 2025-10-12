import { unstable_cache } from 'next/cache'
import { getPool } from './db'
import type { RowDataPacket } from 'mysql2'
import type {
  YyyyMm,
  MinMaxMonths,
  MonthlyGamesPoint,
  ResultSharePoint,
  ActivityDistributionResponse,
  EloHeatmapResponse,
  TopOpeningsResponse,
  YearlyBumpSeries,
  YearlyBumpResponse,
} from '@/types'
import { isYyyyMm, clampRange, lastNMonthsEndingAt, previousMonth } from './date'
import { getEcoFamily } from './eco'

const WEEK = 60 * 60 * 24 * 7 // 7 days in seconds

/** ------------------ RAW (uncached) helpers ------------------ */
async function _getMinMaxMonths(): Promise<MinMaxMonths> {
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT MIN(month) AS minMonth, MAX(month) AS maxMonth FROM aggregates`
  )
  const minRaw = rows[0]?.minMonth as unknown
  const maxRaw = rows[0]?.maxMonth as unknown
  if (!isYyyyMm(minRaw) || !isYyyyMm(maxRaw)) {
    throw new Error('No data or invalid month format in aggregates')
  }
  return { minMonth: minRaw, maxMonth: maxRaw }
}

async function _getTotalGames(from: YyyyMm, to: YyyyMm) {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(games),0) AS totalGames
     FROM aggregates
     WHERE month BETWEEN ? AND ?`,
    [f, t]
  )
  return { from: f, to: t, totalGames: Number(rows[0]?.totalGames ?? 0) }
}

async function _getMonthlyGames(from: YyyyMm, to: YyyyMm) {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT month, SUM(games) AS games
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY month
     ORDER BY month`,
    [f, t]
  )
  const points: MonthlyGamesPoint[] = rows.map((r) => ({
    month: r.month as YyyyMm,
    games: Number(r.games ?? 0),
  }))
  return { from: f, to: t, points }
}

async function _getLastMonthAndPrev12() {
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

async function _getResultShares(from: YyyyMm, to: YyyyMm) {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT month,
            SUM(white_wins) AS ww, SUM(black_wins) AS bw, SUM(draws) AS dr
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY month
     ORDER BY month`,
    [f, t]
  )
  const points: ResultSharePoint[] = rows.map((r) => {
    const ww = Number(r.ww || 0), bw = Number(r.bw || 0), dr = Number(r.dr || 0)
    const tot = Math.max(1, ww + bw + dr)
    return { month: r.month as YyyyMm, white: ww / tot, black: bw / tot, draw: dr / tot }
  })
  return { from: f, to: t, points }
}

async function _getTopOpening(from: YyyyMm, to: YyyyMm) {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()

  const [top] = await pool.query<RowDataPacket[]>(
    `SELECT eco_group AS eco, SUM(games) AS g
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY eco_group
     ORDER BY g DESC
     LIMIT 1`,
    [f, t]
  )
  const [total] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(games),0) AS total
     FROM aggregates
     WHERE month BETWEEN ? AND ?`,
    [f, t]
  )

  const ecoGroup = (top[0]?.eco as string | undefined) ?? 'C60-C99'
  const games = Number(top[0]?.g ?? 0)
  const tot = Math.max(1, Number(total[0]?.total ?? 0))
  const oneIn = Math.max(1, Math.round(tot / Math.max(1, games)))

  const meta = getEcoFamily(ecoGroup)

  return {
    from: f,
    to: t,
    ecoGroup,
    games,
    oneIn,
    displayName: meta.label,
    sampleMovesSAN: meta.sampleSan
  }
}

async function _getActivityDistribution(from: YyyyMm, to: YyyyMm): Promise<ActivityDistributionResponse> {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()

  const [wrows] = await pool.query<RowDataPacket[]>(
    `SELECT white_bucket AS bucket, SUM(games) AS g
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY white_bucket
     ORDER BY bucket`, [f, t]
  )
  const [brows] = await pool.query<RowDataPacket[]>(
    `SELECT black_bucket AS bucket, SUM(games) AS g
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY black_bucket
     ORDER BY bucket`, [f, t]
  )
  const [trow] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(games),0) AS total
     FROM aggregates
     WHERE month BETWEEN ? AND ?`, [f, t]
  )

  const totalGames = Number(trow[0]?.total ?? 0)
  const totalAppearances = Math.max(1, totalGames * 2)

  const map = new Map<number, number>()
  for (const r of wrows) map.set(Number(r.bucket), (map.get(Number(r.bucket)) ?? 0) + Number(r.g ?? 0))
  for (const r of brows) map.set(Number(r.bucket), (map.get(Number(r.bucket)) ?? 0) + Number(r.g ?? 0))

  const buckets = Array.from(map.keys()).sort((a, b) => a - b)

  let step = 200
  if (buckets.length > 1) {
    step = Math.min(...buckets.slice(1).map((b, i) => b - buckets[i]).filter(d => d > 0))
  }

  const minB = buckets[0]
  const maxB = buckets[buckets.length - 1]
  const filled: { bucket: number; games: number; pct: number }[] = []

  for (let b = minB; b <= maxB; b += step) {
    const g = map.get(b) ?? 0
    filled.push({ bucket: b, games: g, pct: g / totalAppearances })
  }

  return { from: f, to: t, points: filled }
}

async function _getEloHeatmap(from: YyyyMm, to: YyyyMm): Promise<EloHeatmapResponse> {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT white_bucket AS wb,
            black_bucket AS bb,
            SUM(games)       AS g,
            SUM(white_wins)  AS ww,
            SUM(black_wins)  AS bw,
            SUM(draws)       AS dr
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY white_bucket, black_bucket`,
    [f, t]
  )

  const [trow] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(games),0) AS total
     FROM aggregates
     WHERE month BETWEEN ? AND ?`,
    [f, t]
  )
  const totalGames = Math.max(1, Number(trow[0]?.total ?? 0))

  const bucketsSet = new Set<number>()
  const cellMap = new Map<string, { games: number; ww: number; bw: number; dr: number }>()

  for (const r of rows) {
    const wb = Number(r.wb)
    const bb = Number(r.bb)
    const g  = Number(r.g ?? 0)
    const ww = Number(r.ww ?? 0)
    const bw = Number(r.bw ?? 0)
    const dr = Number(r.dr ?? 0)
    bucketsSet.add(wb); bucketsSet.add(bb)
    cellMap.set(`${wb}:${bb}`, { games: g, ww, bw, dr })
  }

  const buckets = Array.from(bucketsSet).sort((a, b) => a - b)

  let step = 200
  if (buckets.length > 1) {
    step = Math.min(...buckets.slice(1).map((b, i) => b - buckets[i]).filter(d => d > 0))
  }

  const minB = buckets[0]
  const maxB = buckets[buckets.length - 1]

  const cells: EloHeatmapResponse['cells'] = []
  for (let wb = minB; wb <= maxB; wb += step) {
    for (let bb = minB; bb <= maxB; bb += step) {
      const key = `${wb}:${bb}`
      const entry = cellMap.get(key)
      if (entry) {
        cells.push({
          whiteBucket: wb,
          blackBucket: bb,
          games: entry.games,
          whiteWins: entry.ww,
          blackWins: entry.bw,
          draws: entry.dr,
        })
      } else {
        cells.push({ whiteBucket: wb, blackBucket: bb, games: 0, whiteWins: 0, blackWins: 0, draws: 0 })
      }
    }
  }

  return {
    from: f,
    to: t,
    buckets: Array.from({ length: (maxB - minB) / step + 1 }, (_, i) => minB + i * step),
    cells,
    totalGames
  }
}

async function _getTopOpenings(from: YyyyMm, to: YyyyMm, limit = 3): Promise<TopOpeningsResponse> {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from: f, to: t } = clampRange(minMonth, maxMonth, from, to)
  const pool = getPool()

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT eco_group AS eco, SUM(games) AS g
     FROM aggregates
     WHERE month BETWEEN ? AND ?
     GROUP BY eco_group
     ORDER BY g DESC
     LIMIT ?`,
    [f, t, limit]
  )
  const [trow] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(games),0) AS total
     FROM aggregates
     WHERE month BETWEEN ? AND ?`,
    [f, t]
  )
  const total = Math.max(1, Number(trow[0]?.total ?? 0))

  const items = rows.map(r => {
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

// NOTE: months are 'YYYY-MM'. We extract the year with SUBSTRING(month,1,4)
async function _getYearlyOpeningGames() {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT SUBSTRING(month,1,4) AS y, eco_group AS eco, SUM(games) AS g
     FROM aggregates
     GROUP BY y, eco
     ORDER BY y, g DESC`
  );
  return rows.map(r => ({
    year: Number(r.y),
    eco: String(r.eco),
    games: Number(r.g ?? 0),
  })) as { year: number; eco: string; games: number }[];
}

/** Build Top-K ranks per year, include share per (year, eco) for tooltips. */
async function _getYearlyBumpTopK(topK: number): Promise<YearlyBumpResponse> {
  const raw = await _getYearlyOpeningGames();

  // 1) group by year, compute totals & quick lookup
  const years = Array.from(new Set(raw.map(r => r.year))).sort((a, b) => a - b);
  const byYear = new Map<number, { eco: string; games: number }[]>();
  const totalByYear = new Map<number, number>();
  const gamesByYearEco = new Map<string, number>(); // key = `${y}:${eco}`

  for (const r of raw) {
    const arr = byYear.get(r.year) ?? [];
    arr.push({ eco: r.eco, games: r.games });
    byYear.set(r.year, arr);

    totalByYear.set(r.year, (totalByYear.get(r.year) ?? 0) + r.games);
    gamesByYearEco.set(`${r.year}:${r.eco}`, r.games);
  }

  // 2) rankings per year (Top-K)
  const topByYear = new Map<number, { eco: string; rank: number }[]>();
  const ecoSet = new Set<string>();
  for (const y of years) {
    const rows = (byYear.get(y) ?? []).sort((a, b) => b.games - a.games);
    const top = rows.slice(0, topK).map((r, i) => ({ eco: r.eco, rank: i + 1 }));
    topByYear.set(y, top);
    top.forEach(t => ecoSet.add(t.eco));
  }

  // 3) build series with share per year where present
  const series: YearlyBumpSeries[] = [];
  for (const eco of ecoSet) {
    const meta = getEcoFamily(eco);
    const data = years.map((y) => {
      const entry = topByYear.get(y)?.find(t => t.eco === eco);
      if (!entry) return { x: y, y: null as number | null }; // out of Top-K → gap
      const total = Math.max(1, totalByYear.get(y) ?? 1);
      const g = gamesByYearEco.get(`${y}:${eco}`) ?? 0;
      const share = g / total; // 0..1
      return { x: y, y: entry.rank, share };
    });
    series.push({ id: eco, label: meta.label, data });
  }

  return { years, topK, series };
}

/** ------------------ CACHED exports (7 days) ------------------ */
export const getMinMaxMonths = unstable_cache(_getMinMaxMonths, ['getMinMaxMonths'], { revalidate: WEEK })
export const getTotalGames = unstable_cache(_getTotalGames, ['getTotalGames'], { revalidate: WEEK })
export const getMonthlyGames = unstable_cache(_getMonthlyGames, ['getMonthlyGames'], { revalidate: WEEK })
export const getLastMonthAndPrev12 = unstable_cache(_getLastMonthAndPrev12, ['getLastMonthAndPrev12'], { revalidate: WEEK })
export const getResultShares = unstable_cache(_getResultShares, ['getResultShares'], { revalidate: WEEK })
export const getTopOpening = unstable_cache(_getTopOpening, ['getTopOpening'], { revalidate: WEEK })
export const getActivityDistribution = unstable_cache(_getActivityDistribution, ['getActivityDistribution'], { revalidate: WEEK })
export const getEloHeatmap = unstable_cache(_getEloHeatmap, ['getEloHeatmap'], { revalidate: WEEK })
export const getTopOpenings = unstable_cache(_getTopOpenings, ['getTopOpenings'], { revalidate: WEEK })
export const getYearlyBumpTopK = unstable_cache( _getYearlyBumpTopK, ['getYearlyBumpTopK'], { revalidate: WEEK });
