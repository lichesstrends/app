import { NextResponse } from 'next/server';
import { getMinMaxMonths } from '@/lib/data';

export const revalidate = 600;

export async function GET() {
  const { minMonth, maxMonth } = await getMinMaxMonths();
  const minYear = Number(minMonth.slice(0,4));
  const maxYear = Number(maxMonth.slice(0,4));
  return NextResponse.json({ minYear, maxYear });
}