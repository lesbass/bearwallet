import { RootState } from 'pages'

export const retrieveLastItems = (state: RootState) => {
  return state.lastItems.data
}
