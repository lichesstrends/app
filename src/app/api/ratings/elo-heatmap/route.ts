import { z } from 'zod'
import { defineGetRoute } from '@/app/api/_lib/handler'
import { getEloHeatmap } from '@/lib/data'
import type { YyyyMm } from '@/types'
import { EcoRangeSchema, YearSchema } from '@/lib/validation'

export const revalidate = 600

const QuerySchema = z
  .object({
    fromYear: YearSchema,
    toYear: YearSchema,
    eco: EcoRangeSchema.optional(),
  })
  .refine(({ fromYear, toYear }) => fromYear <= toYear, {
    message: '`fromYear` must be <= `toYear`',
  })

export const GET = defineGetRoute({
  revalidate,
  query: QuerySchema,
  handler: ({ query }) => {
    const from = `${query.fromYear}-01` as YyyyMm
    const to = `${query.toYear}-12` as YyyyMm
    return getEloHeatmap(from, to, query.eco)
  },
})
