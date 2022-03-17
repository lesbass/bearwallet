import log from 'lib/log'
import { withSessionRoute } from 'lib/session'
import { resetCache } from 'lib/utils'

export default withSessionRoute((request, response) => {
  const user = request.session.user
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
    log('ERROR', (error as Error).message, 'api.resetCache')
    response.status(500).send('Generic error')
  }
})
