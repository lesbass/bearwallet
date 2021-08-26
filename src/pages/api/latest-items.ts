import memoryCache, { CacheClass } from 'memory-cache'

import { Movement } from 'interfaces/NotionModels'
import { User } from 'interfaces/User'
import log from 'lib/log'
import api from 'lib/notion-client'
import withSession from 'lib/session'

const memCache: CacheClass<string, Movement[]> = memoryCache

const getOrSetData = async (refresh = false) => {
  const cacheKey = 'getLatestItems'
  const timeInMinutes = 120

  if (refresh) {
    memoryCache.clear()
    log('INFO', 'reset cache', 'api.getLatestItems.getOrSetData')
  }

  let cachedData = memCache.get(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await api.getLatestItems(false)
    memCache.put(cacheKey, cachedData, timeInMinutes * 60 * 1000)
  } else {
    log('INFO', 'cached data found', 'api.getLatestItems.getOrSetData')
  }

  return cachedData
}

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

      const { refresh } = request.body
      const data = await getOrSetData(refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.getLatestItems')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.getLatestItems')
    response.status(500).send('Generic error')
  }
})
