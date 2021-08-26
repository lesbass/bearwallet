import { createAsyncThunk } from '@reduxjs/toolkit'

import api from 'lib/local-api'
import { setHttpStatus } from 'store/http-status/http-status.store'

import { setProjectsSuccess } from './project.store'

export const setProjects = createAsyncThunk('project/setProjects', async (payload, { dispatch, rejectWithValue }) => {
  try {
    const projects = await api.getProjects(false)

    dispatch(setProjectsSuccess(projects))

    return payload
  } catch (err) {
    dispatch(setHttpStatus({ actionType: 'setProjects', status: 'error' }))

    return rejectWithValue('get Projects fails!')
  }
})
