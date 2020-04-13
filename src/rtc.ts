import Peer from 'peerjs'
import { store } from './redux/store'
import action from './redux/actions'

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
  })
}

const unsubscribe = store.subscribe(() => {
  const {
    rtc: { connection },
  } = store.getState()
  if (!connection) return
  unsubscribe()
  connection.on('data', console.log)
})
