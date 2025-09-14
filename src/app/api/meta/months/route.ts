import { NextResponse } from 'next/server'
import { getMinMaxMonths } from '@/lib/data'
import { apiRevalidate } from '@/lib/data'

export const revalidate = apiRevalidate

export async function GET() {
  const data = await getMinMaxMonths()
  return NextResponse.json(data)
}
