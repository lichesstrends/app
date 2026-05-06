import { z } from 'zod'
import { defineGetRoute } from '@/app/api/_lib/handler'
import { getTopOpenings } from '@/lib/data'
import { MonthRangeSchema, PositiveIntSchema } from '@/lib/validation'

export const revalidate = 600

const QuerySchema = MonthRangeSchema.and(
  z.object({ limit: PositiveIntSchema(50, 3).default(3) }),
)

export const GET = defineGetRoute({
  revalidate,
  query: QuerySchema,
  handler: ({ query }) => getTopOpenings(query.from, query.to, query.limit),
})
