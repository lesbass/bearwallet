import type { NextApiRequest, NextApiResponse } from 'next'

import log from 'lib/log'
import { isUserAuthorized } from 'lib/telegram'

const checkUser = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method == 'POST') {
    if (request.headers.authorization !== `Bearer ${process.env.TELEGRAM_API_KEY}`) {
      log('ERROR', `Forbidden API Key: ${request.headers.authorization}`, 'telegram.checkUser')
      response.status(403).send('')
    } else {
      const { userName } = request.body
      const isAuthorized = await isUserAuthorized(userName)
      response.status(isAuthorized ? 200 : 404).send('')
    }
  } else {
    log('ERROR', 'Method not allowed', 'telegram.checkUser')
    response.status(405).send('')
  }
}

export default checkUser
