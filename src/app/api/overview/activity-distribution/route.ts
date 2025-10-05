import { NextResponse } from 'next/server'
import { getActivityDistribution } from '@/lib/data'
import { YyyyMm } from '@/types'

export const revalidate = 600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') as YyyyMm
  const to = searchParams.get('to') as YyyyMm
  if (!from || !to) return NextResponse.json({ error: 'from & to required' }, { status: 400 })
  const data = await getActivityDistribution(from, to)
  return NextResponse.json(data)
}