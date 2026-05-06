import { z } from './zod'
import {
  registry,
  ActivityDistributionResponse,
  BadRequestResponse,
  EloHeatmapResponse,
  LastMonthSummaryResponse,
  MinMaxMonths,
  MinMaxYears,
  MonthlyGamesResponse,
  OpeningStatsResponse,
  ResultSharesResponse,
  TopOpeningsResponse,
  TotalGamesResponse,
  YearlyBumpResponse,
} from './schemas'

const FromQuery = z
  .string()
  .regex(/^\d{4}-\d{2}$/)
  .openapi({ param: { name: 'from', in: 'query' }, example: '2024-01' })

const ToQuery = z
  .string()
  .regex(/^\d{4}-\d{2}$/)
  .openapi({ param: { name: 'to', in: 'query' }, example: '2024-12' })

const MonthRangeQuery = z.object({ from: FromQuery, to: ToQuery })

const ok = <S extends z.ZodTypeAny>(description: string, schema: S) => ({
  description,
  content: { 'application/json': { schema } },
})

const badRequest = {
  description: 'Bad request - missing or invalid parameters',
  content: { 'application/json': { schema: BadRequestResponse } },
}

registry.registerPath({
  method: 'get',
  path: '/api/meta/months',
  operationId: 'getMonthRange',
  summary: 'Get available month range',
  description:
    'Returns the minimum and maximum months available in the database. Use these values to determine valid date ranges for other endpoints.',
  tags: ['Meta'],
  responses: { 200: ok('The available month range', MinMaxMonths) },
})

registry.registerPath({
  method: 'get',
  path: '/api/meta/years',
  operationId: 'getYearRange',
  summary: 'Get available year range',
  description: 'Returns the minimum and maximum years available in the database.',
  tags: ['Meta'],
  responses: { 200: ok('The available year range', MinMaxYears) },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/total',
  operationId: 'getTotalGames',
  summary: 'Get total game count',
  description: 'Returns the total number of games played within the specified date range.',
  tags: ['Overview'],
  request: { query: MonthRangeQuery },
  responses: {
    200: ok('Total game count for the period', TotalGamesResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/last-month-summary',
  operationId: 'getLastMonthSummary',
  summary: 'Get last-month games summary',
  description:
    'Returns total games for the most recent month, the previous month, the percentage change, and a 12-month sparkline series ending at the latest month. Convenience endpoint that bundles the data shown in the dashboard\'s totals card in a single request.',
  tags: ['Overview'],
  responses: {
    200: ok('Latest month summary with 12-month series', LastMonthSummaryResponse),
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/monthly-games',
  operationId: 'getMonthlyGames',
  summary: 'Get monthly game counts',
  description: 'Returns the number of games played per month within the specified date range.',
  tags: ['Overview'],
  request: { query: MonthRangeQuery },
  responses: {
    200: ok('Monthly game counts', MonthlyGamesResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/result-shares',
  operationId: 'getResultShares',
  summary: 'Get result distribution over time',
  description: 'Returns the share of white wins, black wins, and draws per month.',
  tags: ['Overview'],
  request: { query: MonthRangeQuery },
  responses: {
    200: ok('Result shares per month', ResultSharesResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/activity-distribution',
  operationId: 'getActivityDistribution',
  summary: 'Get rating activity distribution',
  description:
    'Returns the distribution of games across rating buckets for the specified period.',
  tags: ['Overview'],
  request: { query: MonthRangeQuery },
  responses: {
    200: ok('Activity distribution by rating bucket', ActivityDistributionResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/elo-heatmap',
  operationId: 'getEloHeatmap',
  summary: 'Get Elo matchup heatmap',
  description:
    'Returns a heatmap of games played between different rating buckets, including win/draw statistics.',
  tags: ['Overview'],
  request: { query: MonthRangeQuery },
  responses: {
    200: ok('Elo heatmap data', EloHeatmapResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/overview/top-openings',
  operationId: 'getTopOpenings',
  summary: 'Get top openings',
  description: 'Returns the most popular openings for the specified period.',
  tags: ['Overview'],
  request: {
    query: MonthRangeQuery.extend({
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(50)
        .default(3)
        .openapi({ param: { name: 'limit', in: 'query' } }),
    }),
  },
  responses: {
    200: ok('Top openings', TopOpeningsResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/openings/yearly-bump',
  operationId: 'getYearlyBump',
  summary: 'Get opening popularity over years',
  description:
    'Returns the ranking of top openings by popularity for each year, useful for bump charts.',
  tags: ['Openings'],
  request: {
    query: z.object({
      top: z.coerce
        .number()
        .int()
        .min(1)
        .max(20)
        .default(10)
        .openapi({ param: { name: 'top', in: 'query' } }),
      from: z.coerce
        .number()
        .int()
        .optional()
        .openapi({ param: { name: 'from', in: 'query' }, example: 2015 }),
      to: z.coerce
        .number()
        .int()
        .optional()
        .openapi({ param: { name: 'to', in: 'query' }, example: 2025 }),
    }),
  },
  responses: {
    200: ok('Yearly opening rankings', YearlyBumpResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/openings/stats',
  operationId: 'getOpeningStats',
  summary: 'Get detailed opening statistics',
  description:
    'Returns detailed statistics for a specific opening, including result distribution and Elo breakdown.',
  tags: ['Openings'],
  request: {
    query: MonthRangeQuery.extend({
      eco: z
        .string()
        .openapi({ param: { name: 'eco', in: 'query' }, example: 'B20-B99' }),
    }),
  },
  responses: {
    200: ok('Opening statistics', OpeningStatsResponse),
    400: badRequest,
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/ratings/elo-heatmap',
  operationId: 'getFilteredEloHeatmap',
  summary: 'Get filtered Elo heatmap',
  description: 'Returns Elo matchup heatmap filtered by year range and optionally by opening.',
  tags: ['Ratings'],
  request: {
    query: z.object({
      fromYear: z.coerce
        .number()
        .int()
        .openapi({ param: { name: 'fromYear', in: 'query' }, example: 2020 }),
      toYear: z.coerce
        .number()
        .int()
        .openapi({ param: { name: 'toYear', in: 'query' }, example: 2024 }),
      eco: z
        .string()
        .optional()
        .openapi({ param: { name: 'eco', in: 'query' }, example: 'B20-B99' }),
    }),
  },
  responses: {
    200: ok('Filtered Elo heatmap data', EloHeatmapResponse),
    400: badRequest,
  },
})
