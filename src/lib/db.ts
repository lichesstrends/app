import mysql from 'mysql2/promise'

let pool: mysql.Pool | undefined

export function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  const useSSL = String(process.env.MYSQL_SSL ?? 'true') !== 'false'

  pool = mysql.createPool({
    uri: url,
    ssl: useSSL ? { minVersion: 'TLSv1.2' } : undefined,
    connectionLimit: 5,
  })
  return pool
}
