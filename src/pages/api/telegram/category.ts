import { NextApiRequest, NextApiResponse } from 'next'

import log from 'lib/log'
import categoryRepository from 'lib/repositories/categoryRepository'
import { isUserAuthorized } from 'lib/telegram'

const category = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method == 'POST') {
      const { userName } = request.body
      if (
        request.headers.authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}` ||
        !(await isUserAuthorized(userName))
      ) {
        log('ERROR', `Forbidden API Key: ${request.headers.authorization}`, 'telegram.getCategories')
        response.status(403).send('')
      } else {
        response.setHeader('content-type', 'application/json')

        const { refresh } = request.body
        const data = await categoryRepository.getCategories(refresh)
        response.status(200).send(data)
      }
    } else {
      log('ERROR', 'Method not allowed', 'telegram.getCategories')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'telegram.getCategories')
    response.status(500).send('Generic error')
  }
}

export default category
