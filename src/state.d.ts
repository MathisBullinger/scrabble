interface State {
  game: {
    board: Board
    tiles: Tile[]
    pool: Tile['key'][]
    stage: Stage
    selected?: Tile['key']
    animateFrom?: { x: number; y: number }
    players: Player[]
  }
}

interface Stage {
  name: 'SELECT_TILE' | 'PLACE_TILE'
}

interface Board {
  cells: Cell[]
  width: number
  height: number
}

interface Cell {
  key: string
  type: CellType
  tile?: Tile['key']
}

type CellType =
  | 'origin'
  | 'triple-word'
  | 'double-word'
  | 'triple-letter'
  | 'double-letter'
  | 'default'

interface Tile {
  key: string
  letter: string
  cell?: Cell['key']
}

interface Player {
  id: number
  tray: Tile['key'][]
}
