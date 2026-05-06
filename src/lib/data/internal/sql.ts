import type { RowDataPacket } from 'mysql2'
import type { Pool } from 'mysql2/promise'
import { getPool } from '../../db'
import type { YyyyMm } from '@/types'
import { clampRange } from '../../date'
import { getMinMaxMonths } from '../meta'

/**
 * Run a parameterized SELECT and return typed rows.
 *
 * `mysql2` already protects against SQL injection via `?` placeholders, but we
 * never inject user-controlled values into the query string itself.
 */
export async function selectRows<T extends RowDataPacket>(
  sql: string,
  params: ReadonlyArray<unknown> = [],
  pool: Pool = getPool(),
): Promise<T[]> {
  const [rows] = await pool.query<T[]>(sql, params as unknown[])
  return rows
}

/**
 * Resolve a user-supplied `[from, to]` month range against the available data
 * window in the database. Both bounds are clamped, and inverted ranges are
 * swapped.
 */
export async function resolveMonthRange(
  from: YyyyMm,
  to: YyyyMm,
): Promise<{ from: YyyyMm; to: YyyyMm }> {
  const { minMonth, maxMonth } = await getMinMaxMonths()
  return clampRange(minMonth, maxMonth, from, to)
}

export const DAY_SECONDS = 60 * 60 * 24

