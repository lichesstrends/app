// app/src/app/api/openings/yearly-bump/route.ts
import { NextResponse } from 'next/server';
import { getYearlyBumpTopK } from '@/lib/data';

export const revalidate = 600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topK = Math.min(20, Math.max(1, Number(searchParams.get('top') ?? 10)));

  const all = await getYearlyBumpTopK(topK);

  // Optional: window the years (from..to) if provided
  const from = Number(searchParams.get('from') ?? all.years[0]);
  const to   = Number(searchParams.get('to')   ?? all.years[all.years.length - 1]);

  const years = all.years.filter(y => y >= from && y <= to);
  const yearSet = new Set(years);

  const series = all.series.map(s => ({
    ...s,
    data: s.data.filter(p => yearSet.has(p.x)),
  }));

  return NextResponse.json({ years, topK: all.topK, series });
}
