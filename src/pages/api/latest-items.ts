import { Movement } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'
import { withSessionRoute } from 'lib/session'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

const getOrSetData = async (category: string | null, page: number, refresh = false) => {
  const cacheKey = 'getLatestItems-' + category + '-' + page

  let cachedData = memoryCache.get<Movement[]>(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await api.getLatestItems(category, page, refresh)
    memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
  } else {
    log('INFO', 'cached data found -> ' + cacheKey, 'api.getLatestItems.getOrSetData')
  }

  return cachedData
}

export default withSessionRoute(async (request, response) => {
  const user = request.session.user
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.getLatestItems')
    response.status(405).send('')
    return
  }

  try {
    if (request.method?.toUpperCase() === 'POST') {
      response.setHeader('content-type', 'application/json')

      const { category, page, refresh } = request.body
      const data = await getOrSetData(category, page, refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.getLatestItems')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', (error as Error).message, 'api.getLatestItems')
    response.status(500).send('Generic error')
  }
})
