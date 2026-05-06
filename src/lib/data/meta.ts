import { unstable_cache } from 'next/cache'
import type { RowDataPacket } from 'mysql2'
import type { MinMaxMonths } from '@/types'
import { isYyyyMm } from '../date'
import { getPool } from '../db'

const DAY_SECONDS = 60 * 60 * 24

async function fetchMinMaxMonths(): Promise<MinMaxMonths> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT MIN(month) AS minMonth, MAX(month) AS maxMonth FROM aggregates',
  )
  const min = rows[0]?.minMonth
  const max = rows[0]?.maxMonth
  if (!isYyyyMm(min) || !isYyyyMm(max)) {
    throw new Error('No data or invalid month format in aggregates')
  }
  return { minMonth: min, maxMonth: max }
}

async function fetchYearRange(): Promise<{ minYear: number; maxYear: number }> {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  return { minYear: Number(minMonth.slice(0, 4)), maxYear: Number(maxMonth.slice(0, 4)) }
}

export const getMinMaxMonths = unstable_cache(fetchMinMaxMonths, ['getMinMaxMonths'], {
  revalidate: DAY_SECONDS,
})

export const getYearRange = unstable_cache(fetchYearRange, ['getYearRange'], {
  revalidate: DAY_SECONDS,
})
