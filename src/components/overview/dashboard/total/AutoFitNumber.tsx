'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function AutoFitNumber({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const [scale, setScale] = useState(1)

  // Recompute scale to make text fit wrapper width (never upscale above 1)
  const recompute = () => {
    const wrap = wrapRef.current
    const span = textRef.current
    if (!wrap || !span) return
    // temporarily reset scale to 1 to measure natural width
    span.style.transform = 'scale(1)'
    const cw = wrap.clientWidth
    const tw = span.scrollWidth
    const s = tw > 0 ? Math.min(1, cw / tw) : 1
    setScale(s)
  }

  // ResizeObserver on wrapper
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(recompute)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // Recompute when content changes
  useEffect(() => {
    recompute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <div ref={wrapRef} className="w-full flex justify-center">
      <span
        ref={textRef}
        className={className}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          display: 'inline-block',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </div>
  )
}
