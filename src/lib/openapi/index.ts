import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import { registry } from './schemas'
import './paths'

const INFO_DESCRIPTION = `
The LichessTrends API provides aggregated statistics from Lichess game data.

All data is derived from Lichess monthly database dumps and aggregated by:
- **Month** (YYYY-MM format)
- **Opening** (ECO code groups like "B20-B99")
- **Elo buckets** (200-point ranges: 800, 1000, 1200, etc.)

## Rate Limiting
No rate limiting is currently enforced, but please be reasonable with your requests.

## Caching
All endpoints are cached for 10 minutes (600 seconds) on the server side.
`.trim()

export function buildOpenApiSpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions)
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'LichessTrends API',
      version: '1.0.0',
      description: INFO_DESCRIPTION,
      contact: { name: 'LichessTrends', url: 'https://github.com/lichesstrends' },
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    servers: [
      { url: 'https://lichesstrends.com', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Local development' },
    ],
    tags: [
      { name: 'Meta', description: 'Metadata about available data ranges' },
      { name: 'Overview', description: 'General statistics and aggregations' },
      { name: 'Openings', description: 'Opening-specific statistics' },
      { name: 'Ratings', description: 'Rating-based analysis' },
    ],
  })
}

export const openApiSpec = buildOpenApiSpec()
