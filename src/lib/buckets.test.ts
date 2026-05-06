import { describe, it, expect } from 'vitest'
import { inferBucketStep, formatBucketRange } from './buckets'

describe('inferBucketStep', () => {
  it('returns the smallest positive gap', () => {
    expect(inferBucketStep([800, 1000, 1200, 1400])).toBe(200)
  })

  it('handles irregular gaps by returning the minimum', () => {
    expect(inferBucketStep([800, 1000, 1500])).toBe(200)
  })

  it('falls back for fewer than two buckets', () => {
    expect(inferBucketStep([])).toBe(200)
    expect(inferBucketStep([1500])).toBe(200)
    expect(inferBucketStep([], 100)).toBe(100)
  })

  it('falls back when no positive gap exists', () => {
    expect(inferBucketStep([1500, 1500, 1500])).toBe(200)
    expect(inferBucketStep([1500, 1400], 50)).toBe(50)
  })
})

describe('formatBucketRange', () => {
  it('formats with default separator', () => {
    expect(formatBucketRange(1800, 200)).toBe('1800\u20131999')
  })

  it('honors custom separator', () => {
    expect(formatBucketRange(800, 100, '-')).toBe('800-899')
  })
})
