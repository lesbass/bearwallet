import React from 'react'

import useAuthentication from 'hooks/useAuthentication'

import AuthenticatedApp from './AuthenticatedApp'
import AppLoader from './loader/AppLoader'
import LoginForm from './login/LoginForm'

const App: React.VFC = () => {
  const { user } = useAuthentication()

  switch (user?.isLoggedIn) {
    case true:
      return <AuthenticatedApp />
    case false:
      return <LoginForm />
    default:
      return <AppLoader />
  }
}

export default App
