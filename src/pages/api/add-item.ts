import { NewMovement } from 'interfaces/NotionModels'
import { User } from 'interfaces/User'
import log from 'lib/log'
import api from 'lib/notion-client'
import withSession from 'lib/session'

export default withSession(async (request, response) => {
  const user = request.session.get<User>('user')
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.getLatestNotesForCategory')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')
      response.status(200).send(await api.createItem(request.body as NewMovement))
    } else {
      log('ERROR', 'Method not allowed', 'api.category')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.category')
    response.status(500).send('Generic error')
  }
})
