import { describe, it, expect } from 'vitest'
import {
  YyyyMmSchema,
  EcoCodeSchema,
  EcoRangeSchema,
  YearSchema,
  MonthRangeSchema,
  YearRangeSchema,
  PositiveIntSchema,
} from './validation'

describe('YyyyMmSchema', () => {
  it('accepts valid YYYY-MM', () => {
    expect(YyyyMmSchema.parse('2024-01')).toBe('2024-01')
    expect(YyyyMmSchema.parse('1999-12')).toBe('1999-12')
  })
  it('rejects invalid formats', () => {
    expect(() => YyyyMmSchema.parse('2024-1')).toThrow()
    expect(() => YyyyMmSchema.parse('2024-13')).toThrow()
    expect(() => YyyyMmSchema.parse('2024-00')).toThrow()
    expect(() => YyyyMmSchema.parse('foo')).toThrow()
  })
})

describe('EcoCodeSchema', () => {
  it('accepts a single ECO code', () => {
    expect(EcoCodeSchema.parse('B20')).toBe('B20')
    expect(EcoCodeSchema.parse('A00')).toBe('A00')
    expect(EcoCodeSchema.parse('E99')).toBe('E99')
  })
  it('rejects invalid codes', () => {
    expect(() => EcoCodeSchema.parse('F20')).toThrow()
    expect(() => EcoCodeSchema.parse('B2')).toThrow()
    expect(() => EcoCodeSchema.parse('B200')).toThrow()
  })
})

describe('EcoRangeSchema', () => {
  it('accepts single codes and ranges', () => {
    expect(EcoRangeSchema.parse('B20')).toBe('B20')
    expect(EcoRangeSchema.parse('B20-B99')).toBe('B20-B99')
  })
  it('rejects malformed ranges', () => {
    expect(() => EcoRangeSchema.parse('B20-')).toThrow()
    expect(() => EcoRangeSchema.parse('B20-X99')).toThrow()
  })
})

describe('YearSchema', () => {
  it('coerces strings', () => {
    expect(YearSchema.parse('2020')).toBe(2020)
    expect(YearSchema.parse(2020)).toBe(2020)
  })
  it('rejects out-of-range', () => {
    expect(() => YearSchema.parse('1899')).toThrow()
    expect(() => YearSchema.parse('2200')).toThrow()
  })
})

describe('MonthRangeSchema', () => {
  it('accepts ordered ranges', () => {
    expect(MonthRangeSchema.parse({ from: '2020-01', to: '2024-12' })).toEqual({
      from: '2020-01',
      to: '2024-12',
    })
  })
  it('rejects inverted ranges', () => {
    expect(() => MonthRangeSchema.parse({ from: '2024-12', to: '2020-01' })).toThrow()
  })
})

describe('YearRangeSchema', () => {
  it('accepts ordered year ranges', () => {
    expect(YearRangeSchema.parse({ fromYear: '2018', toYear: '2024' })).toEqual({
      fromYear: 2018,
      toYear: 2024,
    })
  })
  it('rejects inverted', () => {
    expect(() => YearRangeSchema.parse({ fromYear: '2024', toYear: '2020' })).toThrow()
  })
})

describe('PositiveIntSchema', () => {
  const Schema = PositiveIntSchema(50, 3)
  it('coerces strings within range', () => {
    expect(Schema.parse('10')).toBe(10)
    expect(Schema.parse(1)).toBe(1)
    expect(Schema.parse(50)).toBe(50)
  })
  it('falls back on empty string', () => {
    expect(Schema.parse('')).toBe(3)
  })
  it('rejects out-of-range', () => {
    expect(() => Schema.parse('0')).toThrow()
    expect(() => Schema.parse('51')).toThrow()
    expect(() => Schema.parse('foo')).toThrow()
  })
})
