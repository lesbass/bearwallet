import log from 'lib/log'
import categoryRepository from 'lib/repositories/categoryRepository'
import { withSessionRoute } from 'lib/session'

export default withSessionRoute(async (request, response) => {
  const user = request.session.user
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
    log('ERROR', (error as Error).message, 'api.getCategories')
    response.status(500).send('Generic error')
  }
})
