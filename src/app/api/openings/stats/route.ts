import { z } from 'zod'
import { defineGetRoute } from '@/app/api/_lib/handler'
import { getOpeningStats } from '@/lib/data'
import { EcoRangeSchema, MonthRangeSchema } from '@/lib/validation'

export const revalidate = 600

const QuerySchema = MonthRangeSchema.and(z.object({ eco: EcoRangeSchema }))

export const GET = defineGetRoute({
  revalidate,
  query: QuerySchema,
  handler: ({ query }) => getOpeningStats(query.from, query.to, query.eco),
})
