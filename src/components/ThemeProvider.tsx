'use client'
import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

type Props = React.PropsWithChildren<ThemeProviderProps>

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} {...props}>
      {children}
    </NextThemesProvider>
  )
}