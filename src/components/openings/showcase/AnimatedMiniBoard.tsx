'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

/** Precompute the FEN after each move of a SAN line, starting from the initial position. */
function sanToFrames(san: string): string[] {
  const game = new Chess()
  const frames = [game.fen()]
  const moves = san.replace(/\d+\./g, ' ').trim().split(/\s+/).filter(Boolean)
  for (const m of moves) {
    try {
      game.move(m)
    } catch {
      break
    }
    frames.push(game.fen())
  }
  return frames
}

/**
 * Loops through the positions of a SAN line. Pauses when `playing` is false or
 * when scrolled offscreen.
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
  const frames = useMemo(() => sanToFrames(san), [san])
  const [index, setIndex] = useState(0)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const onScreenRef = useRef(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        onScreenRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || frames.length <= 1) return
    const id = setInterval(() => {
      if (onScreenRef.current) setIndex((i) => (i + 1) % frames.length)
    }, moveIntervalMs)
    return () => clearInterval(id)
  }, [playing, frames, moveIntervalMs])

  return (
    <div ref={wrapRef} className="h-30 w-30 overflow-hidden rounded">
      <Chessboard
        options={{
          position: frames[index] ?? frames[0],
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

