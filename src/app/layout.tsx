import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/NavBar'

export const metadata = {
  title: 'Lichess Trends',
  description: 'Explore Lichess openings, results, and trends over time.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
