'use client'
import { useEffect, useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

function toMovesArray(san?: string): string[] {
  if (typeof san !== 'string' || san.trim().length === 0) return []
  const stripped = san.replace(/\d+\.(\.\.)?\s*/g, ' ').trim()
  return stripped.split(/\s+/).filter(Boolean)
}

export function ChessLine({ san }: { san?: string }) {
  const [index, setIndex] = useState(0)
  const moves = useMemo(() => toMovesArray(san), [san])

  const fen = useMemo(() => {
    const g = new Chess()
    for (let i = 0; i < index && i < moves.length; i++) {
      try {
        g.move(moves[i]) // no sloppy option in chess.js v1.4
      } catch {
        break
      }
    }
    return g.fen()
  }, [index, moves])

  useEffect(() => {
    if (moves.length === 0) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % (moves.length + 1))
    }, 1200)
    return () => clearInterval(id)
  }, [moves.length])

  return (
    <div className="w-28 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800">
      <Chessboard
        options={{
          position: fen,
          allowDragging: false,   // v5: replaces arePiecesDraggable
          allowDrawingArrows: false,
          showNotation: false,    // v5: replaces showBoardNotation
        }}
      />
    </div>
  )
}
