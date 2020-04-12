interface State {
  game: {
    board: Board
  }
}

interface Board {
  cells: Cell[]
  width: number
  height: number
}

interface Cell {
  type: CellType
}

type CellType =
  | 'origin'
  | 'triple-word'
  | 'double-word'
  | 'triple-letter'
  | 'double-letter'
  | 'default'
