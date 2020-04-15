import action, { Actions, assemble } from './redux/actions'
import { store } from './redux/store'
import { send, subscribe } from './rtc'
import { drawTiles } from './utils/game'

export const syncOutbound: (keyof Actions)[] = ['SELECT_TILE', 'PLACE_TILE']
const syncInbound: (keyof Actions)[] = [
  'SELECT_TILE',
  'DRAW_TILES',
  'PLACE_TILE',
  'CREATE_PLAYER',
  'SET_ACTIVE_PLAYER',
]
const handlers: Handlers = {
  SELECT_TILE: [
    () => {
      store.dispatch(
        action('SET_ANIMATION_START', { x: (window.innerWidth / 2) | 0, y: 0 })
      )
    },
  ],
  SET_ACTIVE_PLAYER: [
    (a) => {
      if (a.value !== store.getState().game.meId) return
      if (
        !store
          .getState()
          .game.players.find(({ id }) => id === store.getState().game.meId)
          ?.tray?.length
      ) {
        const draw = action('DRAW_TILES', drawTiles(7))
        store.dispatch(draw)
        send(draw)
      }
    },
  ],
  CREATE_PLAYER: [
    (a) => {
      if (store.getState().game.meId === undefined) {
        const act = action('CREATE_PLAYER', a.value + 1)
        store.dispatch(act)
        store.dispatch(action('SET_ME_ID', a.value + 1))
        send(act)
      }
    },
  ],
}

type Handlers = {
  [K in keyof Partial<Actions>]: ((msg: assemble<K>) => void)[]
}
syncInbound.forEach((type) => {
  handlers[type] = [
    (msg: any) => store.dispatch(msg),
    // @ts-ignore
    ...(handlers[type] ?? []),
  ]
})

const on = <T extends keyof Actions>(
  a: { type: T },
  type: T,
  handler: (msg: assemble<T>) => void
) => {
  if (a.type === type) handler(a as assemble<T>)
}

subscribe(function (msg: any) {
  console.log(msg)
  if (typeof msg === 'string') return
  handlers[msg.type as keyof Actions]?.forEach((handler: Function) =>
    handler(msg)
  )
})
