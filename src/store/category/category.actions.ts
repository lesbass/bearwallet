import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setCategoriesSuccess } from './category.store'

export const setCategories = createAsyncThunk(
  'category/setCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const categories = await api.getCategories(false)

      dispatch(setCategoriesSuccess(categories))
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'setCategories', status: 'error' }))

      return rejectWithValue('get Categories fails!')
    }
  },
)

export const resetCategories = createAsyncThunk(
  'category/resetCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setCategoriesSuccess(undefined))
      dispatch(setCategories())
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'resetCategories', status: 'error' }))

      return rejectWithValue('resetCategories fails!')
    }
  },
)
