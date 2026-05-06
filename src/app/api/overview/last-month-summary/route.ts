import { defineGetRoute } from '@/app/api/_lib/handler'
import { getLastMonthAndPrev12 } from '@/lib/data'

export const revalidate = 600

export const GET = defineGetRoute({
  revalidate,
  handler: () => getLastMonthAndPrev12(),
})
