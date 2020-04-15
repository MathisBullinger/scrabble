import { takeEvery, select } from 'redux-saga/effects'
import { syncOutbound } from '../sync'

import { send } from '../rtc'

function* syncOut(action: any) {
  const data = yield select()
  const { activePlayer, meId } = data.game
  if (activePlayer === meId) yield send(action)
}

export default function* () {
  for (const action of syncOutbound) yield takeEvery(action, syncOut)
}
