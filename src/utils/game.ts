import { store } from '../redux/store'

export function drawTiles(num: number): Tile['key'][] {
  const pool = store.getState().game.pool
  return Array(Math.min(num, pool.length))
    .fill(0)
    .map(() => pool.splice((Math.random() * pool.length) | 0, 1)[0])
}

export function advance(): State['game']['stage'] {
  const { stage, players } = store.getState().game

  if (!stage.name) return { ...stage, name: 'DRAW_TILES', activePlayer: 0 }
  if (stage.name === 'DRAW_TILES') {
    const active = players.findIndex(({ id }) => id === stage.activePlayer)
    if (active < players.length - 1)
      return { ...stage, activePlayer: players[active + 1].id }
    else return { ...stage, name: 'PLACE_WORD', activePlayer: players[0].id }
  }
  return stage
}

export function validate({ tiles, board }: State['game']): boolean {
  const get = (x: number, y: number): Cell | undefined =>
    x >= 0 && y >= 0 && x < board.width && y < board.height
      ? board.cells[y * board.width + x]
      : undefined
  const origin = get((board.width - 1) / 2, (board.height - 1) / 2)
  if (!origin) return false

  let visited: [number, number][] = []
  const search = (x: number, y: number): any[] => {
    const tile = get(x, y)?.tile
    if (!tile) return []
    visited.push([x, y])
    return [
      tile,
      ...[
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ]
        .filter(([x, y]) => !visited.find((v) => v[0] === x && v[1] === y))
        .flatMap(([x, y]) => search(x, y)),
    ]
  }

  search(origin.column, origin.row)
  const unreachable = board.cells.filter(
    ({ column, row, tile }) =>
      tile && !visited.find(([x, y]) => column === x && row === y)
  )
  return unreachable.length === 0
}
