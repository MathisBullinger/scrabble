import action, { Actions, assemble } from './redux/actions'
import { store } from './redux/store'
import { subscribe, onConnect } from './rtc'
import { drawTiles } from './utils/game'

const syncInbound: (keyof Actions)[] = [
  'SELECT_TILE',
  'DRAW_TILES',
  'PLACE_TILE',
  'CREATE_PLAYER',
  'SET_ACTIVE_PLAYER',
]

onConnect(() => {
  console.log('on connect')
  store.dispatch(action('SET_ME_ID', 0))
  store.dispatch(action('SET_ACTIVE_PLAYER', 0))
  store.dispatch(action('CREATE_PLAYER', 0))
  store.dispatch(action('DRAW_TILES', drawTiles(7)))
})

const me = () =>
  store
    .getState()
    .game.players.find(({ id }) => id === store.getState().game.meId)
const isCurrentPlayer = () =>
  me() && me()?.id === store.getState().game.activePlayer

const handlers: Handlers = {
  SELECT_TILE: [
    () => {
      store.dispatch(
        action('SET_ANIMATION_START', { x: (window.innerWidth / 2) | 0, y: 0 })
      )
    },
  ],
  SET_ACTIVE_PLAYER: [
    () => {
      if (!isCurrentPlayer()) return
      if (!me()?.tray?.length)
        store.dispatch(action('DRAW_TILES', drawTiles(7)))
    },
  ],
  CREATE_PLAYER: [
    (a) => {
      if (!me()) {
        store.dispatch(action('SET_ME_ID', a.value + 1))
        store.dispatch(action('CREATE_PLAYER', a.value + 1))
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

subscribe(function (msg: any) {
  console.log(msg)
  if (typeof msg === 'string') return
  handlers[msg.type as keyof Actions]?.forEach((handler: Function) =>
    handler(msg)
  )
})
