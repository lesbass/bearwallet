import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setCategoriesSuccess } from './category.store'
import { useSelector } from 'react-redux'
import { getCategories } from './category.selectors'

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

export const resetCategories = createAsyncThunk(
  'category/resetCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setCategoriesSuccess(undefined))
      useSelector(getCategories)
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'resetCategories', status: 'error' }))

      return rejectWithValue('resetCategories fails!')
    }
  }
)
