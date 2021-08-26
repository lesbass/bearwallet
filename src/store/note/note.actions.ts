import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setNotesSuccess } from './note.store'

export const setNotes = createAsyncThunk<
  { category: string; refresh: boolean },
  { category: string; refresh: boolean }
>('note/setNotes', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const { category, refresh } = payload

    const notes = await api.getLatestNotesForCategory(category, refresh)

    dispatch(setNotesSuccess({ category, data: notes }))

    return payload
  } catch (err) {
    dispatch(setHttpStatus({ actionType: 'getLatestNotesForCategory', status: 'error' }))

    return rejectWithValue('get notes fails!')
  }
})
