import { takeEvery, select } from 'redux-saga/effects'

const syncOutbound: (keyof import('./actions').Actions)[] = [
  'SELECT_TILE',
  'PLACE_TILE',
  'DRAW_TILES',
  'CREATE_PLAYER',
  'SET_ACTIVE_PLAYER',
]

let _send: typeof import('../rtc').send
export const setSend = (handler: typeof _send) => {
  _send = handler
}

function* syncOut(action: any) {
  const data = yield select()
  const { activePlayer, meId } = data.game
  if (meId !== undefined && activePlayer === meId) {
    console.log('send', action.type)
    if (_send) yield _send(action)
  }
}

export default function* () {
  for (const action of syncOutbound) yield takeEvery(action, syncOut)
}
