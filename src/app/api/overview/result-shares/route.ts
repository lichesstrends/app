import { NextResponse } from 'next/server'
import { getResultShares, apiRevalidate } from '@/lib/data'
import { YyyyMm } from '@/types'

export const revalidate = apiRevalidate

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') as YyyyMm
  const to = searchParams.get('to') as YyyyMm
  if (!from || !to) return NextResponse.json({ error: 'from & to required' }, { status: 400 })
  const data = await getResultShares(from, to)
  return NextResponse.json(data)
}
