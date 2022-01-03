import log from 'lib/log'
import api from 'lib/notion-client'
import { withSessionRoute } from 'lib/session'

export default withSessionRoute(async (request, response) => {
  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')
      const { password, userName } = request.body
      const isLoggedIn = await api.authenticateUser(userName, password)

      log('INFO', 'isLoggedIn: ' + isLoggedIn, 'api.login')
      if (isLoggedIn) {
        request.session.user = { isLoggedIn, userName }
        await request.session.save()
      }
      log('INFO', 'isLoggedIn: ' + isLoggedIn, 'api.login')

      response.status(200).send(isLoggedIn)
    } else {
      log('ERROR', 'Method not allowed', 'api.login')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.login')
    response.status(500).send('Generic error: ' + error.message)
  }
})
