'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

/**
 * Ultra-responsive board animation:
 * - rAF tick (no setInterval).
 * - IntersectionObserver to pause offscreen.
 * - Controlled by `playing` prop (row hover pauses instantly).
 * - Parses SAN once; robust to odd SAN (try/catch).
 */
export function AnimatedMiniBoard({
  san,
  playing,
  moveIntervalMs = 350,
}: {
  san: string
  playing: boolean
  moveIntervalMs?: number
}) {
  const [fen, setFen] = useState(() => new Chess().fen())
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number>(0)
  const accRef = useRef<number>(0)
  const iRef = useRef(0)
  const gameRef = useRef(new Chess())
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const onScreenRef = useRef(true)

  const moves = useMemo(() => {
    const raw = san.replace(/\d+\./g, ' ').trim().split(/\s+/).filter(Boolean)
    return raw
  }, [san])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        onScreenRef.current = entries[0]?.isIntersecting ?? true
      },
      { root: null, threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const loop = (ts: number) => {
      const last = lastTsRef.current || ts
      const dt = ts - last
      lastTsRef.current = ts

      if (playing && onScreenRef.current) {
        accRef.current += dt
        if (accRef.current >= moveIntervalMs) {
          accRef.current = 0
          const game = gameRef.current
          try {
            if (iRef.current < moves.length) {
              const ok = game.move(moves[iRef.current++]!)
              if (!ok) iRef.current = moves.length
            } else {
              game.reset()
              iRef.current = 0
            }
            setFen(game.fen())
          } catch {
            game.reset()
            iRef.current = 0
            setFen(game.fen())
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [moves, playing, moveIntervalMs])

  return (
    <div ref={wrapRef} className="h-30 w-30 overflow-hidden rounded">
      <Chessboard
        options={{
          position: fen,
          showNotation: false,
          allowDragging: false,
          allowDrawingArrows: false,
          animationDurationInMs: 150,
          darkSquareStyle: { backgroundColor: '#8ca3ac' },
          lightSquareStyle: { backgroundColor: '#dfe3e6' },
        }}
      />
    </div>
  )
}
