import { Metadata } from 'next'

const SITE_NAME = 'LichessTrends'

/**
 * Creates consistent page metadata with standardized title format.
 * @param title - The page-specific title (e.g., "About", "Openings")
 * @param description - Optional page description
 * @returns Metadata object for Next.js
 */
export function createMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} - ${SITE_NAME}`,
    ...(description && { description }),
  }
}

/**
 * Default metadata for the home page.
 */
export const defaultMetadata: Metadata = {
  title: SITE_NAME,
  description: 'Explore Lichess openings, results, and trends over time.',
}
