import { createAsyncThunk } from '@reduxjs/toolkit'

import { Category } from 'interfaces/NotionModels'
import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setCategoriesSuccess } from './category.store'

export const setCategories = createAsyncThunk(
  'category/setCategories',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const categories = await api.getCategories(false)

      dispatch(setCategoriesSuccess(categories))

      return payload
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'setCategories', status: 'error' }))

      return rejectWithValue('get Categories fails!')
    }
  }
)
