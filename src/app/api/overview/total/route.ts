import { defineGetRoute } from '@/app/api/_lib/handler'
import { getTotalGames } from '@/lib/data'
import { MonthRangeSchema } from '@/lib/validation'

export const revalidate = 600

export const GET = defineGetRoute({
  revalidate,
  query: MonthRangeSchema,
  handler: ({ query }) => getTotalGames(query.from, query.to),
})
