import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { z } from './zod'

export const registry = new OpenAPIRegistry()

/* ------------------------------------------------------------------ */
/* Reusable primitives                                                 */
/* ------------------------------------------------------------------ */

export const YyyyMm = registry.register(
  'YyyyMm',
  z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .openapi({ description: 'Month in YYYY-MM format', example: '2024-01' }),
)

const Share = z.number().min(0).max(1)
const Int = z.number().int()

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

export const MinMaxMonths = registry.register(
  'MinMaxMonths',
  z.object({ minMonth: YyyyMm, maxMonth: YyyyMm }),
)

export const MinMaxYears = registry.register(
  'MinMaxYears',
  z.object({
    minYear: Int.openapi({ example: 2013 }),
    maxYear: Int.openapi({ example: 2025 }),
  }),
)

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export const TotalGamesResponse = registry.register(
  'TotalGamesResponse',
  z.object({
    from: YyyyMm,
    to: YyyyMm,
    totalGames: Int.openapi({ description: 'Total number of games in the period' }),
  }),
)

export const MonthlyGamesPoint = registry.register(
  'MonthlyGamesPoint',
  z.object({ month: YyyyMm, games: Int }),
)

export const MonthlyGamesResponse = registry.register(
  'MonthlyGamesResponse',
  z.object({ from: YyyyMm, to: YyyyMm, points: z.array(MonthlyGamesPoint) }),
)

export const ResultSharePoint = registry.register(
  'ResultSharePoint',
  z.object({
    month: YyyyMm,
    white: Share.openapi({ description: 'White win rate (0-1)' }),
    black: Share.openapi({ description: 'Black win rate (0-1)' }),
    draw: Share.openapi({ description: 'Draw rate (0-1)' }),
  }),
)

export const ResultSharesResponse = registry.register(
  'ResultSharesResponse',
  z.object({ from: YyyyMm, to: YyyyMm, points: z.array(ResultSharePoint) }),
)

export const ActivityBucketPoint = registry.register(
  'ActivityBucketPoint',
  z.object({
    bucket: Int.openapi({ description: 'Rating bucket (e.g., 1200)' }),
    games: Int.openapi({ description: 'Number of games in this bucket' }),
    pct: Share.openapi({ description: 'Percentage of total games (0-1)' }),
  }),
)

export const ActivityDistributionResponse = registry.register(
  'ActivityDistributionResponse',
  z.object({ from: YyyyMm, to: YyyyMm, points: z.array(ActivityBucketPoint) }),
)

export const EloHeatmapCell = registry.register(
  'EloHeatmapCell',
  z.object({
    whiteBucket: Int.openapi({ description: 'White player rating bucket' }),
    blackBucket: Int.openapi({ description: 'Black player rating bucket' }),
    games: Int,
    whiteWins: Int,
    blackWins: Int,
    draws: Int,
  }),
)

export const EloHeatmapResponse = registry.register(
  'EloHeatmapResponse',
  z.object({
    from: YyyyMm,
    to: YyyyMm,
    buckets: z.array(Int).openapi({ description: 'Sorted list of unique rating buckets' }),
    cells: z.array(EloHeatmapCell),
    totalGames: Int,
  }),
)

export const TopOpeningsItem = registry.register(
  'TopOpeningsItem',
  z.object({
    ecoGroup: z.string().openapi({ description: 'ECO code range (e.g., "B20-B99")' }),
    displayName: z.string().openapi({ description: 'Human-readable opening name' }),
    sampleMovesSAN: z.string().openapi({ description: 'Example moves in SAN notation' }),
    games: Int,
    share: Share.openapi({ description: 'Share of total games (0-1)' }),
  }),
)

export const TopOpeningsResponse = registry.register(
  'TopOpeningsResponse',
  z.object({ from: YyyyMm, to: YyyyMm, items: z.array(TopOpeningsItem) }),
)

/* ------------------------------------------------------------------ */
/* Openings                                                            */
/* ------------------------------------------------------------------ */

export const YearlyBumpPoint = registry.register(
  'YearlyBumpPoint',
  z.object({
    x: Int.openapi({ description: 'Year' }),
    y: Int.nullable().openapi({ description: 'Rank (1 = most popular), null if not in top K' }),
    share: z.number().optional().openapi({ description: 'Share of games that year (0-1)' }),
  }),
)

export const YearlyBumpSeries = registry.register(
  'YearlyBumpSeries',
  z.object({
    id: z.string().openapi({ description: 'ECO code group' }),
    label: z.string().openapi({ description: 'Opening display name' }),
    data: z.array(YearlyBumpPoint),
  }),
)

export const YearlyBumpResponse = registry.register(
  'YearlyBumpResponse',
  z.object({
    years: z.array(Int).openapi({ description: 'List of years covered' }),
    topK: Int.openapi({ description: 'Number of top openings tracked' }),
    series: z.array(YearlyBumpSeries),
  }),
)

export const OpeningEloDistribution = registry.register(
  'OpeningEloDistribution',
  z.object({ bucket: Int, games: Int, pct: Share }),
)

export const OpeningStatsResponse = registry.register(
  'OpeningStatsResponse',
  z.object({
    from: YyyyMm,
    to: YyyyMm,
    ecoGroup: z.string(),
    displayName: z.string(),
    sampleSan: z.string().openapi({ description: 'Example moves in SAN notation' }),
    totalGames: Int,
    share: z.number().openapi({ description: 'Share of all games (0-1)' }),
    resultsAggregate: z.object({
      white: z.number().openapi({ description: 'White win rate (0-1)' }),
      draw: z.number().openapi({ description: 'Draw rate (0-1)' }),
      black: z.number().openapi({ description: 'Black win rate (0-1)' }),
    }),
    eloDistribution: z.array(OpeningEloDistribution),
  }),
)

export const LastMonthSummaryResponse = registry.register(
  'LastMonthSummaryResponse',
  z.object({
    lastMonth: YyyyMm,
    lastGames: Int.openapi({ description: 'Total games for the latest month' }),
    prevGames: Int.openapi({ description: 'Total games for the month before the latest' }),
    pct: z.number().openapi({ description: 'Fractional change vs previous month (0..1)' }),
    series: MonthlyGamesResponse,
  }),
)

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

export const BadRequestResponse = registry.register(
  'BadRequest',
  z.object({
    error: z.string(),
    issues: z
      .array(z.object({ path: z.string(), message: z.string() }))
      .optional(),
  }),
)
