import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setLastItemsSuccess } from './lastItems.store'

export const setLastItems = createAsyncThunk<boolean, boolean>(
  'lastItems/setLastItems',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLastItemsSuccess(undefined))

      const lastItems = await api.getLatestItems(payload)

      dispatch(setLastItemsSuccess(lastItems))

      return payload
    } catch (err) {
      dispatch(setHttpStatus({ actionType: 'getContracts', status: 'error' }))

      return rejectWithValue('get Contract fails!')
    }
  }
)
