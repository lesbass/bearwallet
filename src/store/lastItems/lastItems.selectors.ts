import { RootState } from 'pages'

export const getLastItems = (state: RootState) => {
  return state.lastItems.data
}
