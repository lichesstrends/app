import { NextResponse } from 'next/server'
import { getTopOpening, apiRevalidate } from '@/lib/data'
import { getEcoFamily } from '@/lib/eco'
import { YyyyMm } from '@/types'

export const revalidate = apiRevalidate

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') as YyyyMm
  const to = searchParams.get('to') as YyyyMm
  if (!from || !to) return NextResponse.json({ error: 'from & to required' }, { status: 400 })

  const top = await getTopOpening(from, to)
  return NextResponse.json(top)
}
