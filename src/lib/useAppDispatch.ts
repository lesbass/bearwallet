import { Action, ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { RootState, store } from 'pages'

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>

export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>()
