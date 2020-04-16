import Peer from 'peerjs'
import action from './redux/actions'
import { store } from './redux/store'
import { setSend } from './redux/sagas'

setSend(send)

let peer = new Peer(localStorage.getItem('id') ?? undefined)
const own_id = new Promise((res) => peer.on('open', res))

export async function open() {
  const id = await own_id

  peer.on('connection', (connection) => {
    connection.on('open', () => {
      store.dispatch(action('SET_CONNECTION', { connection }))
    })
  })

  return id
}

let _onConnect = () => {}
export const onConnect = (handler: typeof _onConnect) => {
  _onConnect = handler
}
export async function connect(id: string) {
  await own_id
  const connection = peer.connect(id)
  connection.on('open', () => {
    console.log('open')
    store.dispatch(action('SET_CONNECTION', { connection }))
    _onConnect()
  })
}

let _buffer: any[] = []
let _send: (data: any) => void = (data) => _buffer.push(data)
let _handlers: ((data: any) => void)[] = []
const unsubscribe = store.subscribe(() => {
  const {
    rtc: { connection },
  } = store.getState()
  if (!connection) return
  unsubscribe()
  connection.on('data', (data: any) =>
    _handlers.forEach((handler) => handler(data))
  )
  _send = (data) => connection.send(data)
  _buffer.forEach(_send)
})

export function subscribe(handler: typeof _handlers[0]) {
  _handlers.push(handler)
}

export function send(data: any) {
  if (_send) _send(data)
}
