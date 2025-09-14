import { getPool } from './db'
import type { RowDataPacket } from 'mysql2'
import type { YyyyMm, MinMaxMonths, MonthlyGamesPoint, ResultSharePoint } from '@/types'
import { isYyyyMm, clampRange, lastNMonthsEndingAt, previousMonth } from './date'
import { getEcoFamily } from './eco'

const REVALIDATE_SECONDS = Number(process.env.REVALIDATE_SECONDS ?? 600)
export const apiRevalidate = REVALIDATE_SECONDS

export async function getMinMaxMonths(): Promise<MinMaxMonths> {
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

export async function getTotalGames(from: YyyyMm, to: YyyyMm) {
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

export async function getMonthlyGames(from: YyyyMm, to: YyyyMm) {
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

export async function getLastMonthAndPrev12() {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  const { from, to } = lastNMonthsEndingAt(maxMonth, 12)
  const series = await getMonthlyGames(from, to)
  const lastMonth = maxMonth
  const monthBefore = previousMonth(maxMonth)

  // games last month / prior month
  const lastMap = new Map(series.points.map((p) => [p.month, p.games]))
  const lastGames = lastMap.get(lastMonth) ?? 0
  const prevGames = lastMap.get(monthBefore) ?? 0
  const pct = prevGames > 0 ? (lastGames - prevGames) / prevGames : 0

  return { series, lastMonth, lastGames, prevGames, pct }
}

export async function getResultShares(from: YyyyMm, to: YyyyMm) {
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

export async function getTopOpening(from: YyyyMm, to: YyyyMm) {
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
