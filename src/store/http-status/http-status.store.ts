import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HttpStatus {
  actionType: string | null
  status: 'error' | 'success' | null
}

export const httpStatusStore = createSlice({
  initialState: {
    actionType: null,
    status: null,
  } as HttpStatus,
  name: 'httpStatus',
  reducers: {
    setHttpStatus(state, action: PayloadAction<HttpStatus>) {
      state.status = action.payload.status
      state.actionType = action.payload.actionType
    },
  },
})

export const { setHttpStatus } = httpStatusStore.actions
