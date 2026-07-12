import { NextResponse } from 'next/server'
import { z, type ZodTypeAny } from 'zod'

export type RouteContext<S extends ZodTypeAny> = {
  query: z.infer<S>
  req: Request
}

export type RouteOptions<S extends ZodTypeAny, R> = {
  /** Zod schema applied to `URLSearchParams` (as a plain object). */
  query?: S
  /** ISR-style revalidation hint, in seconds. Defaults to 600. */
  revalidate?: number
  /** Handler returning a JSON-serializable value or a `NextResponse`. */
  handler: (ctx: RouteContext<S>) => Promise<R | NextResponse>
}

const DEFAULT_REVALIDATE = 600

/**
 * Build a `GET` route handler with declarative input validation, structured
 * error responses, and consistent cache headers.
 *
 * Errors thrown inside `handler` are caught and converted to a generic 500;
 * stack traces are never returned to the client.
 */
export function defineGetRoute<S extends ZodTypeAny, R>(opts: RouteOptions<S, R>) {
  const revalidate = opts.revalidate ?? DEFAULT_REVALIDATE
  // `max-age=0` forces browsers to always revalidate with the origin/CDN instead
  // of relying on heuristic freshness (which can otherwise cache a response for
  // a very long time when there's no explicit max-age). `s-maxage` still lets
  // shared caches (CDN) serve the response fast for `revalidate` seconds, with
  // stale-while-revalidate refreshing it in the background.
  const cacheHeader = `public, max-age=0, s-maxage=${revalidate}, stale-while-revalidate=${Math.max(60, revalidate)}`

  return async (req: Request): Promise<NextResponse> => {
    let query: z.infer<S>
    if (opts.query) {
      const params = Object.fromEntries(new URL(req.url).searchParams.entries())
      const parsed = opts.query.safeParse(params)
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            issues: parsed.error.issues.map((i) => ({
              path: i.path.join('.'),
              message: i.message,
            })),
          },
          { status: 400 },
        )
      }
      query = parsed.data
    } else {
      query = undefined as z.infer<S>
    }

    try {
      const result = await opts.handler({ query, req })
      if (result instanceof NextResponse) return result
      return NextResponse.json(result, { headers: { 'Cache-Control': cacheHeader } })
    } catch (err) {
      console.error('[api]', new URL(req.url).pathname, err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
