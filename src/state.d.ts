interface State {
  game: {
    board: Board
    tiles: Tile[]
    pool: Tile['key'][]
    stage: Stage
    selected?: Tile['key']
    animateFrom?: { x: number; y: number }
    players: Player[]
    meId?: Player['id']
    valid?: boolean
  }
  rtc: {
    requireConnection: boolean
    connection?: import('peerjs').DataConnection
  }
}

interface Stage {
  name?: 'DRAW_TILES' | 'PLACE_WORD'
  activePlayer?: Player['id']
  turn: number
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
  column: number
  row: number
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
  name?: string
}
