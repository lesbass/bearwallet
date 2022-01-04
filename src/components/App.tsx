import React, { lazy, Suspense } from 'react'

import useAuthentication from 'hooks/useAuthentication'

import AppLoader from './loader'

const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'))
const LoginForm = lazy(() => import('./login'))

const App: React.VFC = () => {
  const { user } = useAuthentication()

  switch (user?.isLoggedIn) {
    case true:
      return <Suspense fallback={<AppLoader />}><AuthenticatedApp /></Suspense>
    case false:
      return <Suspense fallback={<AppLoader />}><LoginForm /></Suspense>
    default:
      return <AppLoader />
  }
}

export default App
