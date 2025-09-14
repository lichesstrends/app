import { getMinMaxMonths, getMonthlyGames, getResultShares, getTopOpening, getTotalGames } from '@/lib/data'
import { addMonths } from '@/lib/date'
import { HeroMetrics } from '@/components/HeroMetrics'
import { LinkCards } from '@/components/LinkCards'

export const revalidate = Number(process.env.REVALIDATE_SECONDS ?? 600)

export default async function OverviewPage() {
  // 1) discover available range
  const { minMonth, maxMonth } = await getMinMaxMonths()

  // 2) compute the 12-month window ending at maxMonth
  const from12 = addMonths(maxMonth, -11)

  // 3) fetch data for the hero cards
  const [{ totalGames }, monthly, shares, top] = await Promise.all([
    getTotalGames(minMonth, maxMonth),
    getMonthlyGames(from12, maxMonth),
    getResultShares(from12, maxMonth),
    getTopOpening(minMonth, maxMonth),
  ])

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <HeroMetrics
          totalGamesEver={totalGames}
          monthlyGames={monthly.points}
          resultShares={shares.points}
          topOpening={top}
        />
      </section>

      <LinkCards />
    </div>
  )
}
