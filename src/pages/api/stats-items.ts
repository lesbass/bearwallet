import { StatsMovement } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'
import { withSessionRoute } from 'lib/session'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

const getOrSetData = async (startDate: string, endDate: string, refresh = false) => {
  const cacheKey = `statsItems-${startDate}-${endDate}`

  let cachedData = memoryCache.get<StatsMovement[]>(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await api.getStatsItems(startDate, endDate)
    memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
  } else {
    log('INFO', 'cached data found', 'api.statsItems.getOrSetData')
  }

  return cachedData
}

export default withSessionRoute(async (request, response) => {
  const user = request.session.user
  if (user?.isLoggedIn !== true) {
    log('ERROR', 'Method not allowed', 'api.statsItems')
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
      log('ERROR', 'Method not allowed', 'api.statsItems')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.statsItems')
    response.status(500).send('Generic error')
  }
})
