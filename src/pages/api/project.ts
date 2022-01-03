import log from 'lib/log'
import projectRepository from 'lib/repositories/projectRepository'
import { withSessionRoute } from 'lib/session'

export default withSessionRoute(async (request, response) => {
  const user = request.session.user
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.getProjects')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')

      const { refresh } = request.body
      const data = await projectRepository.getProjects(refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.getProjects')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.getProjects')
    response.status(500).send('Generic error')
  }
})
