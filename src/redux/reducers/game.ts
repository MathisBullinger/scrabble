import defaultState from '../defaultState'
import { assemble as a } from '../actions'

export default function (
  state = defaultState.game,
  action:
    | a<'SELECT_TILE'>
    | a<'PLACE_TILE'>
    | a<'SET_ANIMATION_START'>
    | a<'CREATE_PLAYER'>
    | a<'SET_ME_ID'>
    | a<'SET_ACTIVE_PLAYER'>
    | a<'DRAW_TILES'>
    | a<'NEXT_TURN'>
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
    case 'CREATE_PLAYER':
      return {
        ...state,
        players: [...state.players, { id: action.value, tray: [] }],
      }
    case 'SET_ME_ID':
      return {
        ...state,
        meId: action.value,
      }
    case 'SET_ACTIVE_PLAYER':
      return {
        ...state,
        activePlayer: action.value,
      }
    case 'DRAW_TILES':
      return {
        ...state,
        players: state.players.map((player) =>
          player.id !== state.activePlayer
            ? player
            : { ...player, tray: [...player.tray, ...action.value] }
        ),
      }
    case 'NEXT_TURN':
      return {
        ...state,
        turn: state.turn + 1,
      }
    default:
      return state
  }
}
