import action, { Actions, assemble } from './redux/actions'
import { store } from './redux/store'
import { subscribe, onConnect } from './rtc'
import { drawTiles, advance } from './utils/game'

const syncInbound: (keyof Actions)[] = [
  'SELECT_TILE',
  'DRAW_TILES',
  'PLACE_TILE',
  'CREATE_PLAYER',
  'SET_STAGE',
]

onConnect(() => {
  store.dispatch(action('SET_ME_ID', 0))
  store.dispatch(action('CREATE_PLAYER', 0))
})

const handlers: Handlers = {
  SELECT_TILE: [
    () => {
      store.dispatch(
        action('SET_ANIMATION_START', { x: (window.innerWidth / 2) | 0, y: 0 })
      )
    },
  ],

  CREATE_PLAYER: [
    (a) => {
      if (!me()) {
        store.dispatch(action('SET_ME_ID', a.value + 1))
        store.dispatch(action('CREATE_PLAYER', a.value + 1))
        store.dispatch(action('SET_STAGE', advance()))
      }
    },
  ],
}

function handleStageChange({ name }: Stage) {
  if (name === 'DRAW_TILES') store.dispatch(action('DRAW_TILES', drawTiles(7)))
  store.dispatch(action('SET_STAGE', advance()))
}

let lastStage: Stage
store.subscribe(() => {
  const { stage, meId } = store.getState().game
  if (!stage) return
  if (
    stage.name === lastStage?.name &&
    stage.activePlayer === lastStage?.activePlayer
  )
    return
  lastStage = stage
  if (stage.activePlayer !== meId) return
  handleStageChange(stage)
})

const me = () =>
  store
    .getState()
    .game.players.find(({ id }) => id === store.getState().game.meId)

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
