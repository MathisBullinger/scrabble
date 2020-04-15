import { takeEvery, select, call } from 'redux-saga/effects'
import act, { assemble as a } from './actions'
// import { send } from '../rtc'

let send: (data: any) => void = () => {}
export const registerSend = (handler: typeof send) => {
  send = handler
}

function* connected(action: a<'SET_CONNECTION'>) {
  // yield put(act('CREATE_PLAYER', 0))
}

function* selectTile(action: a<'SELECT_TILE'>) {
  const data = yield select()
  const { activePlayer, meId } = data.game
  if (activePlayer === meId) yield send(action)
}

function* placeTile(action: a<'PLACE_TILE'>) {
  const data = yield select()
  const { activePlayer, meId } = data.game
  if (activePlayer === meId) yield send(action)
}

export default function* () {
  yield takeEvery('SET_CONNECTION', connected)
  yield takeEvery('SELECT_TILE', selectTile)
  yield takeEvery('PLACE_TILE', placeTile)
}
