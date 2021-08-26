import useSWR from 'swr'

import { User } from 'interfaces/User'
import api from 'lib/local-api'

interface AuthenticationHelpers {
  logIn: (userName: string, password: string) => Promise<boolean>
  logOut: () => Promise<boolean>
  user: User | undefined
}

const useAuthentication = (): AuthenticationHelpers => {
  const { data: user, mutate: mutateUser } = useSWR<User>('/api/user')
  const logIn = (userName: string, password: string) =>
    api
      .authenticateUser(userName, password)
      .then((isValid) => {
        console.log('Login', isValid)
        return mutateUser(<User>{
          isLoggedIn: isValid,
          userName,
        })
      })
      .then((usr) => usr?.isLoggedIn ?? false)

  const logOut = () =>
    api
      .logOutUser()
      .then(() =>
        mutateUser(
          <User>{
            isLoggedIn: false,
            userName: undefined,
          },
          false
        )
      )
      .then((usr) => usr?.isLoggedIn ?? false)

  return {
    logIn,
    logOut,
    user,
  }
}

export default useAuthentication
