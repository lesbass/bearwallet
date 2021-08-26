import { User } from 'interfaces/User'
import log from 'lib/log'
import categoryRepository from 'lib/repositories/categoryRepository'
import withSession from 'lib/session'

export default withSession(async (request, response) => {
  const user = request.session.get<User>('user')
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.getCategories')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')

      const { refresh } = request.body
      const data = await categoryRepository.getCategories(refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.getCategories')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.getCategories')
    response.status(500).send('Generic error')
  }
})
