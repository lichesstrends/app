/**
 * Generates one static SVG board per opening family into `public/openings/`.
 *
 * The showcase marquee shows the same fixed position for every family, so we
 * render them once here instead of mounting a live board per card. Re-run with
 * `npm run gen:boards` whenever the opening list in `src/lib/eco.ts` changes.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Chess } from 'chess.js'
import { getAllEcoFamilies } from '../src/lib/eco.ts'

const SQUARE = 45 // matches the cburnett piece viewBox
const SIZE = SQUARE * 8
const LIGHT = '#dfe3e6'
const DARK = '#8ca3ac'

const here = dirname(fileURLToPath(import.meta.url))
const piecesDir = join(here, 'pieces')
const outDir = join(here, '..', 'public', 'openings')

const pieceInner = new Map<string, string>()
for (const file of readdirSync(piecesDir)) {
  if (!file.endsWith('.svg')) continue
  const raw = readFileSync(join(piecesDir, file), 'utf8')
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  pieceInner.set(file.replace('.svg', ''), inner)
}

/** Final FEN placement field after applying a SAN line. */
function placement(san: string): string {
  const game = new Chess()
  for (const m of san.replace(/\d+\./g, ' ').trim().split(/\s+/).filter(Boolean)) {
    try {
      game.move(m)
    } catch {
      break
    }
  }
  return game.fen().split(' ')[0]
}

function boardSvg(san: string): string {
  const squares: string[] = []
  const pieces: string[] = []

  placement(san).split('/').forEach((row, r) => {
    let c = 0
    for (const ch of row) {
      if (ch >= '1' && ch <= '9') {
        for (let i = 0; i < Number(ch); i++, c++) {
          squares.push(square(r, c))
        }
      } else {
        squares.push(square(r, c))
        const name = (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase()
        const inner = pieceInner.get(name)
        if (inner) {
          pieces.push(`<g transform="translate(${c * SQUARE} ${r * SQUARE})">${inner}</g>`)
        }
        c++
      }
    }
  })

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">` +
    squares.join('') +
    pieces.join('') +
    `</svg>`
  )
}

function square(r: number, c: number): string {
  const fill = (r + c) % 2 === 0 ? LIGHT : DARK
  return `<rect x="${c * SQUARE}" y="${r * SQUARE}" width="${SQUARE}" height="${SQUARE}" fill="${fill}"/>`
}

mkdirSync(outDir, { recursive: true })
const families = getAllEcoFamilies()
for (const f of families) {
  writeFileSync(join(outDir, `${f.range}.svg`), boardSvg(f.sampleSan))
}
console.log(`Generated ${families.length} opening boards into public/openings/`)
