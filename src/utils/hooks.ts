import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
  useDispatch,
} from 'react-redux'

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector
export { useDispatch }
