import Peer from 'peerjs'
import action from './redux/actions'
import { drawTiles } from './utils/game'

let getStore = import('./redux/store').then(({ store }) => store)

let peer = new Peer(localStorage.getItem('id') ?? undefined)
const own_id = new Promise((res) => peer.on('open', res))

export async function open() {
  const id = await own_id
  const store = await getStore

  peer.on('connection', (connection) => {
    connection.on('open', () =>
      store.dispatch(action('SET_CONNECTION', { connection }))
    )
  })

  return id
}

export async function connect(id: string) {
  await own_id
  const store = await getStore

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
  })
}

let _buffer: any[] = []
let _send: (data: any) => void = (data) => _buffer.push(data)
let _handlers: ((data: any) => void)[] = []
getStore.then((store) => {
  const unsubscribe = store.subscribe(() => {
    const {
      rtc: { connection },
    } = store.getState()
    if (!connection) return
    unsubscribe()
    connection.on('data', (data) =>
      _handlers.forEach((handler) => handler(data))
    )
    _send = (data) => connection.send(data)
    _buffer.forEach(_send)
  })
})

export function subscribe(handler: typeof _handlers[0]) {
  _handlers.push(handler)
}

export function send(data: any) {
  if (_send) _send(data)
}
