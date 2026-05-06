import { z } from 'zod'
import { defineGetRoute } from '@/app/api/_lib/handler'
import { getYearlyBumpTopK } from '@/lib/data'
import { PositiveIntSchema, YearSchema } from '@/lib/validation'

export const revalidate = 600

const QuerySchema = z
  .object({
    top: PositiveIntSchema(20, 10).default(10),
    from: YearSchema.optional(),
    to: YearSchema.optional(),
  })
  .refine(
    ({ from, to }) => from === undefined || to === undefined || from <= to,
    { message: '`from` must be <= `to`' },
  )

export const GET = defineGetRoute({
  revalidate,
  query: QuerySchema,
  handler: ({ query }) => getYearlyBumpTopK(query.top, query.from, query.to),
})
