import memoryCache, { CacheClass } from 'memory-cache'

import { ExportMovement } from 'interfaces/NotionModels'
import { User } from 'interfaces/User'
import log from 'lib/log'
import api from 'lib/notion-client'
import withSession from 'lib/session'

const memCache: CacheClass<string, ExportMovement[]> = memoryCache

const getOrSetData = async (startDate: string, endDate: string, refresh = false) => {
  const cacheKey = `exportItems-${startDate}-${endDate}`
  const timeInMinutes = 120

  let cachedData = memCache.get(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await api.exportItems(startDate, endDate)
    memCache.put(cacheKey, cachedData, timeInMinutes * 60 * 1000)
  } else {
    log('INFO', 'cached data found', 'api.exportItems.getOrSetData')
  }

  return cachedData
}

export default withSession(async (request, response) => {
  const user = request.session.get<User>('user')
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.exportItems')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')
      const { endDate, refresh, startDate } = request.body
      const data = await getOrSetData(startDate, endDate, refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.exportItems')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.exportItems')
    response.status(500).send('Generic error')
  }
})
