import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { defineGetRoute } from './handler'

describe('defineGetRoute', () => {
  it('returns 200 with handler value when no schema', async () => {
    const route = defineGetRoute({ handler: async () => ({ ok: true }) })
    const res = await route(new Request('http://x/y'))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true })
    expect(res.headers.get('Cache-Control')).toMatch(/s-maxage=600/)
  })

  it('parses query and forwards to handler', async () => {
    const route = defineGetRoute({
      query: z.object({ n: z.coerce.number().int() }),
      handler: async ({ query }) => ({ doubled: query.n * 2 }),
    })
    const res = await route(new Request('http://x/y?n=21'))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ doubled: 42 })
  })

  it('returns 400 with structured issues on invalid query', async () => {
    const route = defineGetRoute({
      query: z.object({ n: z.coerce.number().int() }),
      handler: async () => ({ ok: true }),
    })
    const res = await route(new Request('http://x/y?n=foo'))
    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string; issues: Array<{ path: string }> }
    expect(body.error).toMatch(/Invalid/)
    expect(body.issues[0]?.path).toBe('n')
  })

  it('returns 500 without leaking the error', async () => {
    const route = defineGetRoute({
      handler: async () => {
        throw new Error('secret')
      },
    })
    const res = await route(new Request('http://x/y'))
    expect(res.status).toBe(500)
    const body = (await res.json()) as { error: string }
    expect(body.error).toBe('Internal server error')
    expect(JSON.stringify(body)).not.toContain('secret')
  })

  it('honors custom revalidate in cache header', async () => {
    const route = defineGetRoute({ revalidate: 30, handler: async () => ({}) })
    const res = await route(new Request('http://x/y'))
    expect(res.headers.get('Cache-Control')).toMatch(/s-maxage=30/)
  })
})
