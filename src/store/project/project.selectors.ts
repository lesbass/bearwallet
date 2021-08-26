import { RootState } from 'pages'

export const getProjects = (state: RootState) => {
  return state.project.data
}

export const getCurrentProject = (state: RootState) => {
  return state.project.current
}
