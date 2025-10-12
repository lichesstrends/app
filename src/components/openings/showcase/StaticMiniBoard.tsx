'use client'

import { useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

/** Static mini-board: shows final position after applying SAN once. */
export function StaticMiniBoard({ san }: { san: string }) {
  const fen = useMemo(() => {
    try {
      const game = new Chess()
      const moves = san.replace(/\d+\./g, ' ').trim().split(/\s+/).filter(Boolean)
      for (const m of moves) {
        try { game.move(m) } catch { break }
      }
      return game.fen()
    } catch {
      return new Chess().fen()
    }
  }, [san])

  return (
    <div className="h-30 w-30 overflow-hidden rounded">
      <Chessboard
        options={{
          position: fen,
          showNotation: false,
          allowDragging: false,
          allowDrawingArrows: false,
          animationDurationInMs: 0,
          darkSquareStyle: { backgroundColor: '#8ca3ac' },
          lightSquareStyle: { backgroundColor: '#dfe3e6' },
        }}
      />
    </div>
  )
}
