import Peer from 'peerjs'
import { store } from './redux/store'
import action, { assemble, Actions } from './redux/actions'
import { drawTiles } from './utils/game'
import { registerSend } from './redux/sagas'

let peer = new Peer()
const own_id = new Promise((res) => peer.on('open', res))

export async function open() {
  const id = await own_id

  peer.on('connection', (connection) => {
    connection.on('open', () =>
      store.dispatch(action('SET_CONNECTION', { connection }))
    )
  })

  return id
}

export async function connect(id: string) {
  await own_id

  const connection = peer.connect(id)
  connection.on('open', () => {
    store.dispatch(action('SET_CONNECTION', { connection }))
    const createPlayer = action('CREATE_PLAYER', 0)
    store.dispatch(createPlayer)
    store.dispatch(action('SET_ME_ID', 0))
    send(createPlayer)
    const setActive = action('SET_ACTIVE_PLAYER', 0)
    store.dispatch(setActive)
    send(setActive)
    const draw = action('DRAW_TILES', drawTiles(7))
    store.dispatch(draw)
    send(draw)
    const nextPlayer = action('SET_ACTIVE_PLAYER', 1)
    store.dispatch(nextPlayer)
    send(nextPlayer)
  })
}

let _buffer: any[] = []
let _send: (data: any) => void = (data) => _buffer.push(data)
const unsubscribe = store.subscribe(() => {
  const {
    rtc: { connection },
  } = store.getState()
  if (!connection) return
  unsubscribe()
  // connection.on('data', console.log)
  connection.on('data', handleMessage)
  _send = (data) => connection.send(data)
  _buffer.forEach(_send)
})

export function send(data: any) {
  if (_send) _send(data)
}
registerSend(send)

const on = <T extends keyof Actions>(
  a: { type: T },
  type: T,
  handler: (msg: assemble<T>) => void
) => {
  if (a.type === type) handler(a as assemble<T>)
}

function handleMessage(msg: any) {
  console.log(msg)
  if (typeof msg === 'string') return
  on(msg, 'CREATE_PLAYER', (a) => {
    store.dispatch(a)
    if (store.getState().game.meId === undefined) {
      const act = action('CREATE_PLAYER', a.value + 1)
      store.dispatch(act)
      store.dispatch(action('SET_ME_ID', a.value + 1))
      send(act)
    }
  })
  on(msg, 'SET_ACTIVE_PLAYER', (a) => {
    store.dispatch(a)
    console.log(a.value, store.getState().game.meId)
    if (a.value !== store.getState().game.meId) return
    if (
      !store
        .getState()
        .game.players.find(({ id }) => id === store.getState().game.meId)?.tray
        ?.length
    ) {
      console.log('draw own tiles')
      const draw = action('DRAW_TILES', drawTiles(7))
      store.dispatch(draw)
      send(draw)
    }
  })
  on(msg, 'DRAW_TILES', store.dispatch)
  on(msg, 'PLACE_TILE', store.dispatch)
  on(msg, 'SELECT_TILE', (a) => {
    store.dispatch(a)
    store.dispatch(
      action('SET_ANIMATION_START', { x: (window.innerWidth / 2) | 0, y: 0 })
    )
  })
}
