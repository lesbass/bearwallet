import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { resetLastItemsSuccess, setLastItemsSuccess } from './lastItems.store'
import { Movement } from 'interfaces/NotionModels'

export const resetLastItems = createAsyncThunk('lastItems/resetLastItems', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(resetLastItemsSuccess())
    await api.resetCache()
  } catch (err) {
    dispatch(setHttpStatus({ actionType: 'resetLastItems', status: 'error' }))

    return rejectWithValue('resetLastItems fails!')
  }
})

export const setLastItems = createAsyncThunk<Movement[], { category: string | null; page: number }>(
  'lastItems/setLastItems',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { category, page } = payload
      const lastItems = await api.getLatestItems(category, page, false)

      dispatch(setLastItemsSuccess({ category: category, page: page, data: lastItems }))

      return lastItems
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'setLastItems', status: 'error' }))

      return rejectWithValue('setLastItems fails!')
    }
  }
)
