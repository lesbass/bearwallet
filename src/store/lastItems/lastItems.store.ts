import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Movement } from 'interfaces/NotionModels'

export const LastItemsStore = createSlice({
  initialState: {
    data: undefined as Movement[] | undefined,
  },
  name: 'client',
  reducers: {
    setLastItemsSuccess(state, action: PayloadAction<Movement[] | undefined>) {
      state.data = action.payload
    },
  },
})

export const { setLastItemsSuccess } = LastItemsStore.actions
