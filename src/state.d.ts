interface State {
  game: {
    board: Board
    tiles: Tile[]
    stage: Stage
    selected: Tile['key'] | null
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
