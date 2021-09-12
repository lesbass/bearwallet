import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Movement } from 'interfaces/NotionModels'

interface MovementRow {
  category: string | null
  page: number
  data: Movement[]
}

export const LastItemsStore = createSlice({
  initialState: {
    data: undefined as MovementRow[] | undefined,
  },
  name: 'client',
  reducers: {
    setLastItemsSuccess(state, action: PayloadAction<MovementRow>) {
      state.data = (state.data ?? []).filter(
        (row) => !(row.page === action.payload.page && row.category === action.payload.category)
      )
      state.data.push(action.payload)
    },
    resetLastItemsSuccess(state) {
      state.data = undefined
    },
  },
})

export const { setLastItemsSuccess, resetLastItemsSuccess } = LastItemsStore.actions
