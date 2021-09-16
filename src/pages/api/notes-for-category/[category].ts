import { User } from 'interfaces/User'
import log from 'lib/log'
import api from 'lib/notion-client'
import withSession from 'lib/session'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

const getOrSetData = async (category: string, refresh = false) => {
  const cacheKey = `getLatestNotesForCategory-${category}`

  let cachedData = memoryCache.get<string[]>(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await api.getLatestNotesForCategory(category, false)
    memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
  } else {
    log('INFO', 'cached data found', 'api.getLatestNotesForCategory.getOrSetData')
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
      const { category } = request.query
      response.setHeader('content-type', 'application/json')

      const { refresh } = request.body
      const data = await getOrSetData(category as string, refresh)
      response.status(200).send(data)
    } else {
      log('ERROR', 'Method not allowed', 'api.getLatestNotesForCategory')
      response.status(405).send('')
    }
  } catch (error) {
    log('ERROR', error.message, 'api.getLatestNotesForCategory')
    response.status(500).send('Generic error')
  }
})
