import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Project } from 'interfaces/NotionModels'

export const ProjectStore = createSlice({
  initialState: {
    current: null as string | undefined | null,
    data: undefined as Project[] | undefined,
  },
  name: 'client',
  reducers: {
    setCurrentProjectSuccess(state, action: PayloadAction<string | undefined | null>) {
      state.current = action.payload
    },
    setProjectsSuccess(state, action: PayloadAction<Project[]>) {
      state.data = action.payload
    },
  },
})

export const { setCurrentProjectSuccess, setProjectsSuccess } = ProjectStore.actions
