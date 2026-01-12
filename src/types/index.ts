export type YyyyMm = `${number}${number}${number}${number}-${number}${number}`

export type MinMaxMonths = {
  minMonth: YyyyMm
  maxMonth: YyyyMm
}

export type TotalGamesResponse = {
  from: YyyyMm
  to: YyyyMm
  totalGames: number
}

export type MonthlyGamesPoint = { month: YyyyMm; games: number }

export type MonthlyGamesResponse = {
  from: YyyyMm
  to: YyyyMm
  points: MonthlyGamesPoint[]
}

export type ResultSharePoint = {
  month: YyyyMm
  white: number // 0..1
  black: number // 0..1
  draw: number  // 0..1
}

export type ResultSharesResponse = {
  from: YyyyMm
  to: YyyyMm
  points: ResultSharePoint[]
}

export type TopOpeningResponse = {
  from: YyyyMm
  to: YyyyMm
  ecoGroup: string       // e.g. "B20-B99"
  displayName: string    // e.g. "Sicilian Defence"
  games: number
  oneIn: number          // "one in X games"
  sampleMovesSAN: string // e.g. "1. e4 c5 2. Nf3 d6 3. d4"
}

export type ActivityBucketPoint = { bucket: number; games: number; pct: number }
export type ActivityDistributionResponse = {
  from: YyyyMm
  to: YyyyMm
  points: ActivityBucketPoint[]
}

export type EloHeatmapCell = {
  whiteBucket: number
  blackBucket: number
  games: number
  whiteWins: number
  blackWins: number
  draws: number
}

export type EloHeatmapResponse = {
  from: YyyyMm
  to: YyyyMm
  buckets: number[]        // sorted unique buckets (e.g., 800, 1000, ...)
  cells: EloHeatmapCell[]
  totalGames: number
}

export type TopOpeningsItem = {
  ecoGroup: string
  displayName: string
  sampleMovesSAN: string
  games: number
  share: number // 0..1
}
export type TopOpeningsResponse = {
  from: YyyyMm
  to: YyyyMm
  items: TopOpeningsItem[]
}

export type YearlyBumpPoint = {
  x: number
  y: number | null
  /** Share of all games that year for this ECO (0..1). Present only when y != null. */
  share?: number
}
export type YearlyBumpSeries = { id: string; label: string; data: YearlyBumpPoint[] }
export type YearlyBumpResponse = { years: number[]; topK: number; series: YearlyBumpSeries[] }

export type OpeningEloDistribution = {
  bucket: number
  games: number
  pct: number
}

export type OpeningStatsResponse = {
  from: YyyyMm
  to: YyyyMm
  ecoGroup: string
  displayName: string
  sampleSan: string
  totalGames: number
  share: number
  resultsAggregate: { white: number; draw: number; black: number }
  eloDistribution: OpeningEloDistribution[]
}
