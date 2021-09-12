import { User } from 'interfaces/User'
import log from 'lib/log'
import withSession from 'lib/session'
import { resetCache } from 'lib/utils'

export default withSession(async (request, response) => {
  const user = request.session.get<User>('user')
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.resetCache')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      resetCache()

      response.status(200).send('')
    } else {
      log('ERROR', 'Method not allowed', 'api.resetCache')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.resetCache')
    response.status(500).send('Generic error')
  }
})
