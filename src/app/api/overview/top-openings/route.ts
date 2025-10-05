import { NextResponse } from 'next/server'
import { getTopOpenings } from '@/lib/data'
import { YyyyMm } from '@/types'

export const revalidate = 600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') as YyyyMm
  const to = searchParams.get('to') as YyyyMm
  const limit = Number(searchParams.get('limit') ?? 3)
  if (!from || !to) return NextResponse.json({ error: 'from & to required' }, { status: 400 })
  const data = await getTopOpenings(from, to, limit)
  return NextResponse.json(data)
}