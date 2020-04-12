const ROWS = 15
const cells = Array(ROWS ** 2)
  .fill(null)
  .map(
    (_, i): Cell => {
      const x = i % ROWS
      const y = (i / ROWS) | 0

      const nMax = (ROWS - 1) / 2
      const nx = x <= nMax ? x : nMax - (x - nMax)
      const ny = y <= nMax ? y : nMax - (y - nMax)

      const every = (...v: number[]) => [nx, ny].every((n) => v.includes(n))
      const one = (v1: number, v2: number) =>
        [nx, ny].some((n) => n === v1) && [nx, ny].some((n) => n === v2)

      if (every(nMax)) return { type: 'origin' }
      else if (every(nMax - 1) || one(2, nMax - 1) || one(3, nMax) || one(3, 0))
        return { type: 'double-letter' }
      else if (every(0, nMax)) return { type: 'triple-word' }
      else if (every(1, nMax - 2) && !every(1)) return { type: 'triple-letter' }
      else if (nx === ny) return { type: 'double-word' }
      return { type: 'default' }
    }
  )

const defaultState: State = {
  game: {
    board: {
      cells,
      width: ROWS,
      height: ROWS,
    },
  },
}

export default defaultState