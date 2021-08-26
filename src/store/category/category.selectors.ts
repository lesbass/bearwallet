import { RootState } from 'pages'

export const getCategories = (state: RootState) => {
  return state.category.data
}

export const getCurrentCategory = (state: RootState) => {
  return state.category.current
}
