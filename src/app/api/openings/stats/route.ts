import { NextResponse } from 'next/server'
import { getOpeningStats } from '@/lib/data'
import { YyyyMm } from '@/types'

export const revalidate = 600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') as YyyyMm
  const to = searchParams.get('to') as YyyyMm
  const eco = searchParams.get('eco')

  if (!from || !to) {
    return NextResponse.json({ error: 'from & to required' }, { status: 400 })
  }
  if (!eco) {
    return NextResponse.json({ error: 'eco required' }, { status: 400 })
  }

  const data = await getOpeningStats(from, to, eco)
  return NextResponse.json(data)
}
