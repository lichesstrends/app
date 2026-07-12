'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Resets scroll to the top on route change. Next's automatic scroll restoration
 * is unreliable here because of the app's full-height layout, so we do it
 * explicitly. Skipped when navigating to an in-page anchor.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hash) return
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
