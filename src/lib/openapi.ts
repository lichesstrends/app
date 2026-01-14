// OpenAPI 3.1 specification for LichessTrends API
export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'LichessTrends API',
    version: '1.0.0',
    description: `
The LichessTrends API provides aggregated statistics from Lichess game data.

All data is derived from Lichess monthly database dumps and aggregated by:
- **Month** (YYYY-MM format)
- **Opening** (ECO code groups like "B20-B99")
- **Elo buckets** (200-point ranges: 800, 1000, 1200, etc.)

## Rate Limiting
No rate limiting is currently enforced, but please be reasonable with your requests.

## Caching
All endpoints are cached for 10 minutes (600 seconds) on the server side.
    `.trim(),
    contact: {
      name: 'LichessTrends',
      url: 'https://github.com/lichesstrends',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://lichesstrends.com',
      description: 'Production',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Meta', description: 'Metadata about available data ranges' },
    { name: 'Overview', description: 'General statistics and aggregations' },
    { name: 'Openings', description: 'Opening-specific statistics' },
    { name: 'Ratings', description: 'Rating-based analysis' },
  ],
  paths: {
    '/api/meta/months': {
      get: {
        operationId: 'getMonthRange',
        summary: 'Get available month range',
        description: 'Returns the minimum and maximum months available in the database. Use these values to determine valid date ranges for other endpoints.',
        tags: ['Meta'],
        responses: {
          '200': {
            description: 'The available month range',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MinMaxMonths' },
                example: {
                  minMonth: '2013-01',
                  maxMonth: '2025-12',
                },
              },
            },
          },
        },
      },
    },
    '/api/meta/years': {
      get: {
        operationId: 'getYearRange',
        summary: 'Get available year range',
        description: 'Returns the minimum and maximum years available in the database.',
        tags: ['Meta'],
        responses: {
          '200': {
            description: 'The available year range',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MinMaxYears' },
                example: {
                  minYear: 2013,
                  maxYear: 2025,
                },
              },
            },
          },
        },
      },
    },
    '/api/overview/total': {
      get: {
        operationId: 'getTotalGames',
        summary: 'Get total game count',
        description: 'Returns the total number of games played within the specified date range.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
        ],
        responses: {
          '200': {
            description: 'Total game count for the period',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TotalGamesResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-12',
                  totalGames: 1234567890,
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/overview/monthly-games': {
      get: {
        operationId: 'getMonthlyGames',
        summary: 'Get monthly game counts',
        description: 'Returns the number of games played per month within the specified date range.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
        ],
        responses: {
          '200': {
            description: 'Monthly game counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MonthlyGamesResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-03',
                  points: [
                    { month: '2024-01', games: 123456789 },
                    { month: '2024-02', games: 134567890 },
                    { month: '2024-03', games: 145678901 },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/overview/result-shares': {
      get: {
        operationId: 'getResultShares',
        summary: 'Get result distribution over time',
        description: 'Returns the share of white wins, black wins, and draws per month.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
        ],
        responses: {
          '200': {
            description: 'Result shares per month',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResultSharesResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-03',
                  points: [
                    { month: '2024-01', white: 0.52, black: 0.45, draw: 0.03 },
                    { month: '2024-02', white: 0.51, black: 0.46, draw: 0.03 },
                    { month: '2024-03', white: 0.52, black: 0.45, draw: 0.03 },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/overview/activity-distribution': {
      get: {
        operationId: 'getActivityDistribution',
        summary: 'Get rating activity distribution',
        description: 'Returns the distribution of games across rating buckets for the specified period.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
        ],
        responses: {
          '200': {
            description: 'Activity distribution by rating bucket',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ActivityDistributionResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-12',
                  points: [
                    { bucket: 800, games: 1000000, pct: 0.05 },
                    { bucket: 1000, games: 5000000, pct: 0.15 },
                    { bucket: 1200, games: 8000000, pct: 0.25 },
                    { bucket: 1400, games: 6000000, pct: 0.20 },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/overview/elo-heatmap': {
      get: {
        operationId: 'getEloHeatmap',
        summary: 'Get Elo matchup heatmap',
        description: 'Returns a heatmap of games played between different rating buckets, including win/draw statistics.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
        ],
        responses: {
          '200': {
            description: 'Elo heatmap data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EloHeatmapResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-12',
                  buckets: [800, 1000, 1200, 1400, 1600, 1800, 2000],
                  cells: [
                    { whiteBucket: 1400, blackBucket: 1400, games: 1000000, whiteWins: 520000, blackWins: 450000, draws: 30000 },
                  ],
                  totalGames: 50000000,
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/overview/top-openings': {
      get: {
        operationId: 'getTopOpenings',
        summary: 'Get top openings',
        description: 'Returns the most popular openings for the specified period.',
        tags: ['Overview'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of openings to return',
            schema: { type: 'integer', default: 3, minimum: 1, maximum: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'Top openings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TopOpeningsResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-12',
                  items: [
                    { ecoGroup: 'B20-B99', displayName: 'Sicilian Defence', sampleMovesSAN: '1. e4 c5', games: 5000000, share: 0.15 },
                    { ecoGroup: 'C60-C99', displayName: 'Ruy Lopez', sampleMovesSAN: '1. e4 e5 2. Nf3 Nc6 3. Bb5', games: 3000000, share: 0.09 },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/openings/yearly-bump': {
      get: {
        operationId: 'getYearlyBump',
        summary: 'Get opening popularity over years',
        description: 'Returns the ranking of top openings by popularity for each year, useful for bump charts.',
        tags: ['Openings'],
        parameters: [
          {
            name: 'top',
            in: 'query',
            description: 'Number of top openings to track',
            schema: { type: 'integer', default: 10, minimum: 1, maximum: 20 },
          },
          {
            name: 'from',
            in: 'query',
            description: 'Start year (optional)',
            schema: { type: 'integer', example: 2015 },
          },
          {
            name: 'to',
            in: 'query',
            description: 'End year (optional)',
            schema: { type: 'integer', example: 2025 },
          },
        ],
        responses: {
          '200': {
            description: 'Yearly opening rankings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/YearlyBumpResponse' },
                example: {
                  years: [2020, 2021, 2022, 2023, 2024],
                  topK: 10,
                  series: [
                    {
                      id: 'B20-B99',
                      label: 'Sicilian Defence',
                      data: [
                        { x: 2020, y: 1, share: 0.15 },
                        { x: 2021, y: 1, share: 0.14 },
                        { x: 2022, y: 1, share: 0.14 },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    '/api/openings/stats': {
      get: {
        operationId: 'getOpeningStats',
        summary: 'Get detailed opening statistics',
        description: 'Returns detailed statistics for a specific opening, including result distribution and Elo breakdown.',
        tags: ['Openings'],
        parameters: [
          { $ref: '#/components/parameters/from' },
          { $ref: '#/components/parameters/to' },
          {
            name: 'eco',
            in: 'query',
            required: true,
            description: 'ECO code group (e.g., "B20-B99" for Sicilian)',
            schema: { type: 'string', example: 'B20-B99' },
          },
        ],
        responses: {
          '200': {
            description: 'Opening statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OpeningStatsResponse' },
                example: {
                  from: '2024-01',
                  to: '2024-12',
                  ecoGroup: 'B20-B99',
                  displayName: 'Sicilian Defence',
                  sampleSan: '1. e4 c5',
                  totalGames: 5000000,
                  share: 0.15,
                  resultsAggregate: { white: 0.52, draw: 0.03, black: 0.45 },
                  eloDistribution: [
                    { bucket: 1200, games: 1000000, pct: 0.20 },
                    { bucket: 1400, games: 1500000, pct: 0.30 },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/ratings/elo-heatmap': {
      get: {
        operationId: 'getFilteredEloHeatmap',
        summary: 'Get filtered Elo heatmap',
        description: 'Returns Elo matchup heatmap filtered by year range and optionally by opening.',
        tags: ['Ratings'],
        parameters: [
          {
            name: 'fromYear',
            in: 'query',
            required: true,
            description: 'Start year',
            schema: { type: 'integer', example: 2020 },
          },
          {
            name: 'toYear',
            in: 'query',
            required: true,
            description: 'End year',
            schema: { type: 'integer', example: 2024 },
          },
          {
            name: 'eco',
            in: 'query',
            description: 'ECO code group to filter by (optional)',
            schema: { type: 'string', example: 'B20-B99' },
          },
        ],
        responses: {
          '200': {
            description: 'Filtered Elo heatmap data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EloHeatmapResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
  },
  components: {
    parameters: {
      from: {
        name: 'from',
        in: 'query',
        required: true,
        description: 'Start month in YYYY-MM format',
        schema: { type: 'string', pattern: '^\\d{4}-\\d{2}$', example: '2024-01' },
      },
      to: {
        name: 'to',
        in: 'query',
        required: true,
        description: 'End month in YYYY-MM format',
        schema: { type: 'string', pattern: '^\\d{4}-\\d{2}$', example: '2024-12' },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad request - missing or invalid parameters',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
              },
            },
            example: { error: 'from & to required' },
          },
        },
      },
    },
    schemas: {
      YyyyMm: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}$',
        description: 'Month in YYYY-MM format',
        example: '2024-01',
      },
      MinMaxMonths: {
        type: 'object',
        required: ['minMonth', 'maxMonth'],
        properties: {
          minMonth: { $ref: '#/components/schemas/YyyyMm' },
          maxMonth: { $ref: '#/components/schemas/YyyyMm' },
        },
      },
      MinMaxYears: {
        type: 'object',
        required: ['minYear', 'maxYear'],
        properties: {
          minYear: { type: 'integer', example: 2013 },
          maxYear: { type: 'integer', example: 2025 },
        },
      },
      TotalGamesResponse: {
        type: 'object',
        required: ['from', 'to', 'totalGames'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          totalGames: { type: 'integer', description: 'Total number of games in the period' },
        },
      },
      MonthlyGamesPoint: {
        type: 'object',
        required: ['month', 'games'],
        properties: {
          month: { $ref: '#/components/schemas/YyyyMm' },
          games: { type: 'integer' },
        },
      },
      MonthlyGamesResponse: {
        type: 'object',
        required: ['from', 'to', 'points'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          points: {
            type: 'array',
            items: { $ref: '#/components/schemas/MonthlyGamesPoint' },
          },
        },
      },
      ResultSharePoint: {
        type: 'object',
        required: ['month', 'white', 'black', 'draw'],
        properties: {
          month: { $ref: '#/components/schemas/YyyyMm' },
          white: { type: 'number', minimum: 0, maximum: 1, description: 'White win rate (0-1)' },
          black: { type: 'number', minimum: 0, maximum: 1, description: 'Black win rate (0-1)' },
          draw: { type: 'number', minimum: 0, maximum: 1, description: 'Draw rate (0-1)' },
        },
      },
      ResultSharesResponse: {
        type: 'object',
        required: ['from', 'to', 'points'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          points: {
            type: 'array',
            items: { $ref: '#/components/schemas/ResultSharePoint' },
          },
        },
      },
      ActivityBucketPoint: {
        type: 'object',
        required: ['bucket', 'games', 'pct'],
        properties: {
          bucket: { type: 'integer', description: 'Rating bucket (e.g., 1200)' },
          games: { type: 'integer', description: 'Number of games in this bucket' },
          pct: { type: 'number', minimum: 0, maximum: 1, description: 'Percentage of total games (0-1)' },
        },
      },
      ActivityDistributionResponse: {
        type: 'object',
        required: ['from', 'to', 'points'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          points: {
            type: 'array',
            items: { $ref: '#/components/schemas/ActivityBucketPoint' },
          },
        },
      },
      EloHeatmapCell: {
        type: 'object',
        required: ['whiteBucket', 'blackBucket', 'games', 'whiteWins', 'blackWins', 'draws'],
        properties: {
          whiteBucket: { type: 'integer', description: 'White player rating bucket' },
          blackBucket: { type: 'integer', description: 'Black player rating bucket' },
          games: { type: 'integer', description: 'Number of games' },
          whiteWins: { type: 'integer', description: 'Number of white wins' },
          blackWins: { type: 'integer', description: 'Number of black wins' },
          draws: { type: 'integer', description: 'Number of draws' },
        },
      },
      EloHeatmapResponse: {
        type: 'object',
        required: ['from', 'to', 'buckets', 'cells', 'totalGames'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          buckets: {
            type: 'array',
            items: { type: 'integer' },
            description: 'Sorted list of unique rating buckets',
          },
          cells: {
            type: 'array',
            items: { $ref: '#/components/schemas/EloHeatmapCell' },
          },
          totalGames: { type: 'integer' },
        },
      },
      TopOpeningsItem: {
        type: 'object',
        required: ['ecoGroup', 'displayName', 'sampleMovesSAN', 'games', 'share'],
        properties: {
          ecoGroup: { type: 'string', description: 'ECO code range (e.g., "B20-B99")' },
          displayName: { type: 'string', description: 'Human-readable opening name' },
          sampleMovesSAN: { type: 'string', description: 'Example moves in SAN notation' },
          games: { type: 'integer' },
          share: { type: 'number', minimum: 0, maximum: 1, description: 'Share of total games (0-1)' },
        },
      },
      TopOpeningsResponse: {
        type: 'object',
        required: ['from', 'to', 'items'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/TopOpeningsItem' },
          },
        },
      },
      YearlyBumpPoint: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'integer', description: 'Year' },
          y: { type: ['integer', 'null'], description: 'Rank (1 = most popular), null if not in top K' },
          share: { type: 'number', description: 'Share of games that year (0-1)' },
        },
      },
      YearlyBumpSeries: {
        type: 'object',
        required: ['id', 'label', 'data'],
        properties: {
          id: { type: 'string', description: 'ECO code group' },
          label: { type: 'string', description: 'Opening display name' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/YearlyBumpPoint' },
          },
        },
      },
      YearlyBumpResponse: {
        type: 'object',
        required: ['years', 'topK', 'series'],
        properties: {
          years: {
            type: 'array',
            items: { type: 'integer' },
            description: 'List of years covered',
          },
          topK: { type: 'integer', description: 'Number of top openings tracked' },
          series: {
            type: 'array',
            items: { $ref: '#/components/schemas/YearlyBumpSeries' },
          },
        },
      },
      OpeningEloDistribution: {
        type: 'object',
        required: ['bucket', 'games', 'pct'],
        properties: {
          bucket: { type: 'integer' },
          games: { type: 'integer' },
          pct: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
      OpeningStatsResponse: {
        type: 'object',
        required: ['from', 'to', 'ecoGroup', 'displayName', 'sampleSan', 'totalGames', 'share', 'resultsAggregate', 'eloDistribution'],
        properties: {
          from: { $ref: '#/components/schemas/YyyyMm' },
          to: { $ref: '#/components/schemas/YyyyMm' },
          ecoGroup: { type: 'string' },
          displayName: { type: 'string' },
          sampleSan: { type: 'string', description: 'Example moves in SAN notation' },
          totalGames: { type: 'integer' },
          share: { type: 'number', description: 'Share of all games (0-1)' },
          resultsAggregate: {
            type: 'object',
            required: ['white', 'draw', 'black'],
            properties: {
              white: { type: 'number', description: 'White win rate (0-1)' },
              draw: { type: 'number', description: 'Draw rate (0-1)' },
              black: { type: 'number', description: 'Black win rate (0-1)' },
            },
          },
          eloDistribution: {
            type: 'array',
            items: { $ref: '#/components/schemas/OpeningEloDistribution' },
          },
        },
      },
    },
  },
}
