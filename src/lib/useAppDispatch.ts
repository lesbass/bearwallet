import { useDispatch } from 'react-redux'

import { store } from 'pages'

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
