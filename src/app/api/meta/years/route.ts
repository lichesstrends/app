import { defineGetRoute } from '@/app/api/_lib/handler'
import { getYearRange } from '@/lib/data'

export const revalidate = 600

export const GET = defineGetRoute({
  revalidate,
  handler: () => getYearRange(),
})
