import mysql from 'mysql2/promise'

let pool: mysql.Pool | undefined

function buildPool(): mysql.Pool {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  try {
    // Validate URL shape without leaking the value into thrown errors.
    new URL(url)
  } catch {
    throw new Error('DATABASE_URL is not a valid URL')
  }

  const isProd = process.env.NODE_ENV === 'production'
  const created = mysql.createPool({
    uri: url,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: isProd },
    connectionLimit: Number(process.env.DB_POOL_SIZE ?? 15),
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })

  ;(created as unknown as { on: (event: 'error', cb: (err: Error) => void) => void }).on('error', (err) => {
    console.error('[mysql] pool error', err)
  })

  return created
}

export function getPool(): mysql.Pool {
  if (!pool) pool = buildPool()
  return pool
}
