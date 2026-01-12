// src/lib/eco.ts
export type EcoFamily = {
  range: string
  label: string
  sampleSan: string // short, robust samples for the mini board
}

const FAMILIES: EcoFamily[] = [
  { range: 'A00', label: 'Polish (Sokolsky)', sampleSan: 'b4' },
  { range: 'A01', label: 'Nimzowitsch–Larsen', sampleSan: 'b3' },
  { range: 'A02-A03', label: "Bird's Opening", sampleSan: 'f4' },
  { range: 'A04-A09', label: 'Reti', sampleSan: 'Nf3' },
  { range: 'A10-A39', label: 'English', sampleSan: 'c4' },
  { range: 'A40-A41', label: "Queen's Pawn", sampleSan: 'd4' },
  { range: 'A42', label: 'Modern (Averbakh)', sampleSan: 'd4 d6 c4 g6 Nc3 Bg7 e4' },
  { range: 'A43-A44', label: 'Old Benoni', sampleSan: 'd4 c5' },
  { range: 'A45-A46', label: "Queen's Pawn Game", sampleSan: 'd4 Nf6' },
  { range: 'A47', label: "Queen's Indian", sampleSan: 'd4 Nf6 Nf3 b6' },
  { range: 'A48-A49', label: "East Indian / KID", sampleSan: 'd4 Nf6 Nf3 g6' },
  { range: 'A50', label: "Queen's Pawn Game", sampleSan: 'd4 Nf6 c4' },
  { range: 'A51-A52', label: 'Budapest', sampleSan: 'd4 Nf6 c4 e5' },
  { range: 'A53-A55', label: 'Old Indian', sampleSan: 'd4 Nf6 c4 d6' },
  { range: 'A56', label: 'Benoni', sampleSan: 'd4 Nf6 c4 c5' },
  { range: 'A57-A59', label: 'Benko Gambit', sampleSan: 'd4 Nf6 c4 c5 d5 b5' },
  { range: 'A60-A79', label: 'Benoni', sampleSan: 'd4 Nf6 c4 c5 d5 e6' },
  { range: 'A80-A99', label: 'Dutch', sampleSan: 'd4 f5' },

  { range: 'B00', label: "King's Pawn Opening", sampleSan: 'e4' },
  { range: 'B01', label: 'Scandinavian', sampleSan: 'e4 d5' },
  { range: 'B02-B05', label: "Alekhine's", sampleSan: 'e4 Nf6' },
  { range: 'B06', label: 'Modern', sampleSan: 'e4 g6' },
  { range: 'B07-B09', label: 'Pirc', sampleSan: 'e4 d6 d4 Nf6 Nc3' },
  { range: 'B10-B19', label: 'Caro-Kann', sampleSan: 'e4 c6' },
  { range: 'B20-B99', label: 'Sicilian', sampleSan: 'e4 c5' },

  { range: 'C00-C19', label: 'French', sampleSan: 'e4 e6' },
  { range: 'C20', label: "King's Pawn Game", sampleSan: 'e4 e5' },
  { range: 'C21-C22', label: 'Center Game', sampleSan: 'e4 e5 d4 exd4' },
  { range: 'C23-C24', label: "Bishop's", sampleSan: 'e4 e5 Bc4' },
  { range: 'C25-C29', label: 'Vienna', sampleSan: 'e4 e5 Nc3' },
  { range: 'C30-C39', label: "King's Gambit", sampleSan: 'e4 e5 f4' },
  { range: 'C40', label: "King's Knight", sampleSan: 'e4 e5 Nf3' },
  { range: 'C41', label: 'Philidor', sampleSan: 'e4 e5 Nf3 d6' },
  { range: 'C42-C43', label: 'Petrov', sampleSan: 'e4 e5 Nf3 Nf6' },
  { range: 'C44', label: "King's Pawn Game", sampleSan: 'e4 e5 Nf3 Nc6' },
  { range: 'C45', label: 'Scotch', sampleSan: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4' },
  { range: 'C46', label: 'Three Knights', sampleSan: 'e4 e5 Nf3 Nc6 Nc3' },
  { range: 'C47-C49', label: 'Four Knights (Scotch)', sampleSan: 'e4 e5 Nf3 Nc6 Nc3 Nf6 d4' },
  { range: 'C50', label: 'Italian Game', sampleSan: 'e4 e5 Nf3 Nc6 Bc4' },
  { range: 'C51-C52', label: 'Evans Gambit', sampleSan: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4' },
  { range: 'C53-C54', label: 'Giuoco Piano', sampleSan: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3' },
  { range: 'C55-C59', label: 'Two Knights', sampleSan: 'e4 e5 Nf3 Nc6 Bc4 Nf6' },
  { range: 'C60-C99', label: 'Ruy Lopez', sampleSan: 'e4 e5 Nf3 Nc6 Bb5' },

  { range: 'D00-D05', label: "Queen's Pawn Games", sampleSan: 'd4 d5' },
  { range: 'D06', label: "Queen's Gambit", sampleSan: 'd4 d5 c4' },
  { range: 'D07-D09', label: 'QGD Chigorin', sampleSan: 'd4 d5 c4 Nc6' },
  { range: 'D10-D19', label: 'Slav', sampleSan: 'd4 d5 c4 c6' },
  { range: 'D20-D29', label: 'QGA', sampleSan: 'd4 d5 c4 dxc4' },
  { range: 'D30-D42', label: 'QGD', sampleSan: 'd4 d5 c4 e6' },
  { range: 'D43-D49', label: 'Semi-Slav', sampleSan: 'd4 d5 c4 e6 Nc3 Nf6 Nf3 c6' },
  { range: 'D50-D69', label: 'QGD 4.Bg5', sampleSan: 'd4 d5 c4 e6 Nc3 Nf6 Bg5' },
  { range: 'D70-D79', label: 'Neo-Grünfeld', sampleSan: 'd4 Nf6 c4 g3 d5' },
  { range: 'D80-D99', label: 'Grünfeld', sampleSan: 'd4 Nf6 c4 g3 Nc3 d5' },

  { range: 'E00', label: "Queen's Pawn", sampleSan: 'd4 Nf6 c4 e6' },
  { range: 'E01-E09', label: 'Catalan', sampleSan: 'd4 Nf6 c4 e6 g3 d5 Bg2' },
  { range: 'E10', label: "Queen's Pawn", sampleSan: 'd4 Nf6 c4 e6 Nf3' },
  { range: 'E11', label: 'Bogo-Indian', sampleSan: 'd4 Nf6 c4 e6 Nf3 Bb4+' },
  { range: 'E12-E19', label: "Queen's Indian", sampleSan: 'd4 Nf6 c4 e6 Nf3 b6' },
  { range: 'E20-E59', label: 'Nimzo-Indian', sampleSan: 'd4 Nf6 c4 e6 Nc3 Bb4' },
  { range: 'E60-E99', label: "King's Indian", sampleSan: 'd4 Nf6 c4 g6' },
]

function inRange(code: string, range: string): boolean {
  // code like "C45" or family like "C60-C99"
  const match = code.match(/^([A-E])(\d{2})$/)
  if (!match) return false
  const letter = match[1]
  const num = Number(match[2])

  if (range.includes('-')) {
    const [start, end] = range.split('-')
    const m1 = start.match(/^([A-E])(\d{2})$/)
    const m2 = end.match(/^([A-E])(\d{2})$/)
    if (!m1 || !m2) return false
    if (m1[1] !== letter || m2[1] !== letter) return false
    const a = Number(m1[2]), b = Number(m2[2])
    return num >= a && num <= b
  } else {
    const m = range.match(/^([A-E])(\d{2})$/)
    return !!m && m[1] === letter && Number(m[2]) === num
  }
}

export function getEcoFamily(ecoGroup: string): EcoFamily {
  // ecoGroup is like "B20-B99" (aggregated) or "C00", etc.
  // If it's already a family label we try by range equality first.
  const direct = FAMILIES.find((f) => f.range === ecoGroup)
  if (direct) return direct

  // If we got a single code like "C45", map it to the containing family.
  const single = FAMILIES.find((f) => inRange(ecoGroup, f.range))
  if (single) return single

  // Fallback
  return { range: ecoGroup, label: ecoGroup, sampleSan: 'e4 e5' }
}

/** Get all ECO families (range + label + sampleSan). */
export function getAllEcoFamilies(): EcoFamily[] {
  return FAMILIES.slice()
}

/**
 * Expand a family range (e.g., "B20-B99") into all individual ECO codes for SQL matching.
 * Returns a list like ["B20", "B21", ..., "B99"].
 * If already a single code (e.g., "A00"), returns ["A00"].
 */
export function expandEcoRange(range: string): string[] {
  if (range.includes('-')) {
    const [start, end] = range.split('-')
    const m1 = start.match(/^([A-E])(\d{2})$/)
    const m2 = end.match(/^([A-E])(\d{2})$/)
    if (!m1 || !m2 || m1[1] !== m2[1]) return [range]
    const letter = m1[1]
    const a = Number(m1[2])
    const b = Number(m2[2])
    const codes: string[] = []
    for (let i = a; i <= b; i++) {
      codes.push(`${letter}${String(i).padStart(2, '0')}`)
    }
    return codes
  }
  return [range]
}