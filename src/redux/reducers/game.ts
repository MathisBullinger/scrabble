import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export default function (
  state = defaultState.game,
  action: a<'SELECT_TILE'> | a<'PLACE_TILE'>
): State['game'] {
  switch (action.type) {
    case 'SELECT_TILE':
      return state.stage.name !== 'SELECT_TILE'
        ? state
        : {
            ...state,
            stage: { name: 'PLACE_TILE' },
            selected: action.value,
          }
    case 'PLACE_TILE':
      return {
        ...state,
        stage: { name: 'SELECT_TILE' },
        selected: null,
        board: {
          ...state.board,
          cells: state.board.cells.map((cell) =>
            cell.key === action.value
              ? ({ ...cell, tile: state.selected } as Cell)
              : cell
          ),
        },
      }
    default:
      return state
  }
}
