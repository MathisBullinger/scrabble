import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export default function (
  state = defaultState.game,
  action: a<'SELECT_TILE'> | a<'PLACE_TILE'> | a<'SET_ANIMATION_START'>
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
        selected: undefined,
        board: {
          ...state.board,
          cells: state.board.cells.map((cell) =>
            cell.key === action.value
              ? ({ ...cell, tile: state.selected } as Cell)
              : cell
          ),
        },
        players: state.players.map((player) => ({
          ...player,
          tray: player.tray.filter((tile) => tile !== state.selected),
        })),
      }
    case 'SET_ANIMATION_START':
      return {
        ...state,
        animateFrom: action,
      }
    default:
      return state
  }
}
