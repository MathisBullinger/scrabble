import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export default function (
  state = defaultState.rtc,
  action: a<'SET_CONNECTION'>
): State['rtc'] {
  switch (action.type) {
    case 'SET_CONNECTION':
      return { ...state, connection: action.connection }

    default:
      return state
  }
}
