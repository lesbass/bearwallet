import { CssBaseline, ThemeProvider } from '@mui/material'
import Container from '@mui/material/Container'
import { StyledEngineProvider } from '@mui/material/styles'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import moment from 'moment'
import Head from 'next/head'
import * as React from 'react'
import 'moment/locale/it'
import { Provider } from 'react-redux'

import App from 'components/App'
import { CategoryStore } from 'store/category/category.store'
import { httpStatusStore } from 'store/http-status/http-status.store'
import { LastItemsStore } from 'store/lastItems/lastItems.store'
import { NoteStore } from 'store/note/note.store'
import { ProjectStore } from 'store/project/project.store'
import { SettingsStore } from 'store/settings/settings.store'
import theme from 'theme/theme'

const rootReducer = combineReducers({
  category: CategoryStore.reducer,
  httpStatus: httpStatusStore.reducer,
  lastItems: LastItemsStore.reducer,
  note: NoteStore.reducer,
  project: ProjectStore.reducer,
  settings: SettingsStore.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer, // se è in produzione non include i devtools
})

const Index: React.VFC = () => {
  moment().locale('it')
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <Head>
            <title>BearWallet</title>
          </Head>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <Container component="main" maxWidth="sm">
            <App />
          </Container>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default Index
