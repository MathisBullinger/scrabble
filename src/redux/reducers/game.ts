import defaultState from '../defaultState'
import { assemble as a } from '../actions'
import { validate } from '../../utils/game'

export default function (
  state = defaultState.game,
  action:
    | a<'SELECT_TILE'>
    | a<'PLACE_TILE'>
    | a<'SET_ANIMATION_START'>
    | a<'CREATE_PLAYER'>
    | a<'SET_ME_ID'>
    | a<'DRAW_TILES'>
    | a<'SET_STAGE'>
): State['game'] {
  switch (action.type) {
    case 'SELECT_TILE':
      return {
        ...state,
        selected: action.value,
      }
    case 'PLACE_TILE': {
      const newState = {
        ...state,
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
      return {
        ...newState,
        valid: validate(newState),
      }
    }
    case 'SET_ANIMATION_START':
      return {
        ...state,
        animateFrom: action,
      }
    case 'CREATE_PLAYER':
      return {
        ...state,
        players: [
          ...state.players,
          {
            id: action.value,
            tray: [],
            name: `Player ${action.value + 1}`,
          },
        ],
      }
    case 'SET_ME_ID':
      return {
        ...state,
        meId: action.value,
      }
    case 'DRAW_TILES':
      return {
        ...state,
        players: state.players.map((player) =>
          player.id !== state.stage.activePlayer
            ? player
            : { ...player, tray: [...player.tray, ...action.value] }
        ),
      }
    case 'SET_STAGE':
      return {
        ...state,
        stage: action,
      }
    default:
      return state
  }
}
