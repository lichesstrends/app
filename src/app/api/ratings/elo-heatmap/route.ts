import { NextResponse } from 'next/server'
import { getEloHeatmapFiltered } from '@/lib/data'

export const revalidate = 600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fromYear = searchParams.get('fromYear')
  const toYear = searchParams.get('toYear')
  const eco = searchParams.get('eco') || undefined

  if (!fromYear || !toYear) {
    return NextResponse.json({ error: 'fromYear & toYear required' }, { status: 400 })
  }

  const from = Number(fromYear)
  const to = Number(toYear)

  if (isNaN(from) || isNaN(to) || from > to) {
    return NextResponse.json({ error: 'Invalid year range' }, { status: 400 })
  }

  const data = await getEloHeatmapFiltered(from, to, eco)
  return NextResponse.json(data)
}
