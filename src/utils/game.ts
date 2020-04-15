import { store } from '../redux/store'

export function drawTiles(num: number): Tile['key'][] {
  const pool = store.getState().game.pool
  return Array(Math.min(num, pool.length))
    .fill(0)
    .map(() => pool.splice((Math.random() * pool.length) | 0, 1)[0])
}
