import tileDist from '../data/tiles/de.json'

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

      const cell = { key: `${String.fromCharCode(65 + y)}${x + 1}` }
      if (every(nMax)) return { ...cell, type: 'origin' }
      else if (every(nMax - 1) || one(2, nMax - 1) || one(3, nMax) || one(3, 0))
        return { ...cell, type: 'double-letter' }
      else if (every(0, nMax)) return { ...cell, type: 'triple-word' }
      else if (every(1, nMax - 2) && !every(1))
        return { ...cell, type: 'triple-letter' }
      else if (nx === ny) return { ...cell, type: 'double-word' }
      return { ...cell, type: 'default' }
    }
  )

const create = (letter: string, num: number): Tile[] =>
  Array(num)
    .fill(letter.toLowerCase())
    .map((v, i) => ({ letter: v, key: v + i }))

const createTiles = (letters: { [letter: string]: number }) =>
  Object.entries(letters).flatMap(([letter, num]) => create(letter, num))

const tiles = createTiles(tileDist)

const pool = tiles.map(({ key }) => key)

const tray = Array(7)
  .fill(0)
  .map(() => pool.splice((Math.random() * pool.length) | 0, 1)[0])

const defaultState: State = {
  game: {
    board: {
      cells,
      width: ROWS,
      height: ROWS,
    },
    tiles,
    pool,
    stage: { name: 'SELECT_TILE' },
    players: [{ id: 0, tray }],
  },
}

export default defaultState
