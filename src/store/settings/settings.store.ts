import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const SettingsStore = createSlice({
  initialState: {
    error: null as string | null,
    hideValues: true,
    processing: false,
  },
  name: 'client',
  reducers: {
    setErrorSuccess(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setHideValuesSuccess(state, action: PayloadAction<boolean>) {
      state.hideValues = action.payload
    },
    setProcessingSuccess(state, action: PayloadAction<boolean>) {
      state.processing = action.payload
    },
  },
})

export const { setErrorSuccess, setHideValuesSuccess, setProcessingSuccess } = SettingsStore.actions
