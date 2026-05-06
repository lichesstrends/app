type YearRangeFiltersProps = {
  fromYear: number
  toYear: number
  minYear: number
  maxYear: number
  onFromChange: (year: number) => void
  onToChange: (year: number) => void
  fromLabel?: string
  toLabel?: string
}

function range(min: number, max: number): number[] {
  const out: number[] = []
  for (let y = min; y <= max; y++) out.push(y)
  return out
}

const SELECT_CLS =
  'rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

export function YearRangeFilters({
  fromYear,
  toYear,
  minYear,
  maxYear,
  onFromChange,
  onToChange,
  fromLabel = 'From',
  toLabel = 'to',
}: YearRangeFiltersProps) {
  const fromOptions = range(minYear, toYear)
  const toOptions = range(fromYear, maxYear)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 dark:text-slate-300">{fromLabel}</span>
      <select
        className={SELECT_CLS}
        value={fromYear}
        onChange={(e) => onFromChange(Number(e.target.value))}
      >
        {fromOptions.map((y) => (
          <option key={`from-${y}`} value={y}>
            {y}
          </option>
        ))}
      </select>
      <span className="text-xs text-slate-500 dark:text-slate-400">{toLabel}</span>
      <select
        className={SELECT_CLS}
        value={toYear}
        onChange={(e) => onToChange(Number(e.target.value))}
      >
        {toOptions.map((y) => (
          <option key={`to-${y}`} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
