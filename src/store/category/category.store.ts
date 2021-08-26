import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Category } from 'interfaces/NotionModels'

export const CategoryStore = createSlice({
  initialState: {
    current: null as Category | null,
    data: undefined as Category[] | undefined,
  },
  name: 'client',
  reducers: {
    setCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.data = action.payload
    },
    setCurrentCategorySuccess(state, action: PayloadAction<Category | null>) {
      state.current = action.payload
    },
  },
})

export const { setCategoriesSuccess, setCurrentCategorySuccess } = CategoryStore.actions
