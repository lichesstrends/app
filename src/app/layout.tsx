import './globals.css'
import { ThemeProvider } from '@/contexts/theme/ThemeProvider'
import { QueryProvider } from '@/contexts/query/QueryProvider'
import { MonthsProvider } from '@/contexts/meta/MonthsProvider'
import { Navbar } from '@/components/nav/NavBar'
import { Footer } from '@/components/layout/Footer'
import { Atkinson_Hyperlegible } from 'next/font/google'
import { defaultMetadata } from '@/lib/metadata'

export const metadata = defaultMetadata

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400','700'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${atkinson.className} flex min-h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <MonthsProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8">{children}</main>
                <Footer />
              </div>
            </MonthsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}