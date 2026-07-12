import Image from 'next/image'

/**
 * Pre-rendered board image for an opening family. The SVGs live in
 * `public/openings/` and are produced by `npm run gen:boards`.
 */
export function StaticMiniBoard({ range }: { range: string }) {
  return (
    <Image
      src={`/openings/${range}.svg`}
      alt=""
      width={120}
      height={120}
      unoptimized
      className="h-30 w-30 rounded"
    />
  )
}

