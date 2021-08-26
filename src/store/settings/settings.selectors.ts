import { RootState } from 'pages'

export const getHideValues = (state: RootState) => {
  return state.settings.hideValues
}
export const getError = (state: RootState) => {
  return state.settings.error
}
export const getProcessing = (state: RootState) => {
  return state.settings.processing
}
