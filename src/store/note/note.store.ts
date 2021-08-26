import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface NoteRow {
  category: string
  data: string[]
}

export const NoteStore = createSlice({
  initialState: {
    data: [] as NoteRow[],
  },
  name: 'client',
  reducers: {
    setNotesSuccess(state, action: PayloadAction<NoteRow>) {
      state.data = [...state.data.filter((row) => row.category !== action.payload.category), action.payload]
    },
  },
})

export const { setNotesSuccess } = NoteStore.actions
