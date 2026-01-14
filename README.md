![LichessTrends logo](docs/lichesstrends.svg "LichessTrends logo")

The **LichessTrends App** is a nice dashboard for visualizing trends from monthly Lichess classical game dumps: total games, result shares, rating-bucket activity, Elo matchups, and opening popularity.

## Tech Stack

Next.js 15, React 18, TypeScript, Tailwind CSS v4, Recharts, TanStack Query, next-themes, mysql2.

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL-compatible database

### Setup

```bash
npm install
```

Create **.env.local**:
```bash
DATABASE_URL="mysql://user:password@host:port/dbname"
```

### Database

This app reads from an `aggregates` table with monthly aggregates. Required columns:
- `month` (YYYY-MM)
- `games`, `white_wins`, `black_wins`, `draws`
- `white_bucket`, `black_bucket`
- `eco_group`

Use the [LichessTrends Aggregator](https://github.com/lichesstrends/aggregator) to populate this table from Lichess database dumps.

### Run

```bash
npm run dev      # Development (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
```

## License
This project is licensed under the terms of the MIT license. Fork it, steal it, make it better (or worse), make it yours!