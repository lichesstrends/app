import { z } from 'zod'
import type { YyyyMm } from '@/types'

export const YyyyMmSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM format')
  .transform((v) => v as YyyyMm)

const ECO_CODE = /^[A-E]\d{2}$/
const ECO_RANGE = /^[A-E]\d{2}-[A-E]\d{2}$/

export const EcoCodeSchema = z.string().regex(ECO_CODE, 'Expected ECO code (e.g. B20)')
export const EcoRangeSchema = z
  .string()
  .refine((v) => ECO_CODE.test(v) || ECO_RANGE.test(v), 'Expected ECO code or range (e.g. B20 or B20-B99)')

export const YearSchema = z.coerce.number().int().min(1900).max(2100)

export const MonthRangeSchema = z
  .object({ from: YyyyMmSchema, to: YyyyMmSchema })
  .refine(({ from, to }) => from <= to, { message: '`from` must be <= `to`' })

export const YearRangeSchema = z
  .object({ fromYear: YearSchema, toYear: YearSchema })
  .refine(({ fromYear, toYear }) => fromYear <= toYear, { message: '`fromYear` must be <= `toYear`' })

export const PositiveIntSchema = (max: number, fallback?: number) =>
  z
    .union([
      z.coerce.number().int().min(1).max(max),
      z.literal('').transform(() => fallback ?? 1),
    ])
    .pipe(z.number().int().min(1).max(max))
