'use client'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

export function MiniOpeningBoard({ san }: { san: string }) {
  const [fen, setFen] = useState(() => new Chess().fen())

  useEffect(() => {
    const game = new Chess()
    setFen(game.fen())

    // strip move numbers like "1." "2."
    const moves = san.replace(/\d+\./g, '').trim().split(/\s+/)
    let i = 0

    const id = window.setInterval(() => {
      if (i < moves.length) {
        try {
          game.move(moves[i++]!)
          setFen(game.fen())
        } catch {
          i = moves.length // bail out to reset on next tick
        }
      } else {
        game.reset()
        setFen(game.fen())
        i = 0
      }
    }, 1200)

    return () => window.clearInterval(id)
  }, [san])

  return (
    <div className="h-30 w-30 overflow-hidden rounded">
      <Chessboard
        options={{
          position: fen,           // always a FEN (never "start")
          showNotation: false,
          allowDragging: false,
          allowDrawingArrows: false,  
          animationDurationInMs: 300,
        }}
      />
    </div>
  )
}
