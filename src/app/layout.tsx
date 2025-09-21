import './globals.css'
import { ThemeProvider } from '@/contexts/theme/ThemeProvider'
import { QueryProvider } from '@/contexts/query/QueryProvider'
import { MonthsProvider } from '@/contexts/meta/MonthsProvider'
import { Navbar } from '@/components/nav/NavBar'

export const metadata = {
  title: 'Lichess Trends',
  description: 'Explore Lichess openings, results, and trends over time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <MonthsProvider>
              <Navbar />
              <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">{children}</main>
            </MonthsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
