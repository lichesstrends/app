import { NextResponse } from 'next/server'
import { getMinMaxMonths } from '@/lib/data'

export const revalidate = 600;

export async function GET() {
  const data = await getMinMaxMonths()
  return NextResponse.json(data)
}
