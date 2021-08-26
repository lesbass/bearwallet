import { RootState } from 'pages'

export const getNotes = (state: RootState) => {
  return state.note.data
}
