# LichessTrends (Next.js App)

A lightweight dashboard that visualizes trends from monthly Lichess classical game dumps: total games, result shares, rating-bucket activity, Elo matchups/results heatmaps, and top opening groups. The app exposes a small JSON API used by the UI.

## Features
- **Overview dashboard** with interactive cards and tooltips
- **Dark/light theme** via `next-themes`
- **Fast charts** with Recharts
- **Data caching** with Next.js `unstable_cache` and route segment `revalidate`
- **Typed API** and components (TypeScript)
- **Modern UI** powered by Tailwind CSS v4 and Lucide icons

## Tech Stack
- Next.js 15 (App Router, Route Handlers)
- React 18 + TypeScript
- Tailwind CSS v4
- Recharts
- @tanstack/react-query
- next-themes
- mysql2 (connection pool)

## Getting Started

### 1) Prerequisites
- Node.js 18+ (LTS recommended)
- npm or pnpm
- A MySQL-compatible database (e.g., PlanetScale, Aurora, local MySQL)

### 2) Clone & install
```bash
git clone <your-repo-url>
cd <repo>
npm install
# or: pnpm install
```

### 3) Configure environment
Create **.env.local** in the project root:
```bash
# MySQL connection string
DATABASE_URL="mysql://user:password@host:port/dbname"
# Optional: set NODE_ENV, etc.
```

### 4) Database
This app reads from a table named `aggregates` with monthly aggregates. Minimum columns used by queries:
- `month` (YYYY-MM)
- `games`, `white_wins`, `black_wins`, `draws`
- `white_bucket`, `black_bucket`
- `eco_group`

> Populate this table via your ETL/aggregator before running the app.

### 5) Development
```bash
npm run dev
```
Open http://localhost:3000

### 6) Production build
```bash
npm run build
npm start
```
On Vercel, just set `DATABASE_URL` in project settings.

## API (selected routes)
- `GET /api/meta/months`
- `GET /api/overview/total?from=YYYY-MM&to=YYYY-MM`
- `GET /api/overview/monthly-games?from=YYYY-MM&to=YYYY-MM`
- `GET /api/overview/result-shares?from=YYYY-MM&to=YYYY-MM`
- `GET /api/overview/activity-distribution?from=YYYY-MM&to=YYYY-MM`
- `GET /api/overview/elo-heatmap?from=YYYY-MM&to=YYYY-MM`
- `GET /api/overview/top-openings?from=YYYY-MM&to=YYYY-MM&limit=3`

All endpoints return JSON. Inputs are clamped to available data range.

## Caching model (quick note)
- **Functions** in `src/lib/data.ts` are wrapped with `unstable_cache(...)` (defaults here: 7 days).
- **Route handlers/pages** can export `export const revalidate = <seconds>` to let Next.js re-check on a cadence (e.g., 600s) while still serving cached data.

## Scripts
- `dev` – start Next dev server
- `build` – compile for production
- `start` – run production server

## License
MIT
