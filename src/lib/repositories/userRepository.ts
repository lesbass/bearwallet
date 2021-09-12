import memoryCache, { CacheClass } from 'memory-cache'

import log from 'lib/log'
import api from 'lib/notion-client'

interface UserRepository {
  getTelegramUsers: (refresh: boolean) => Promise<string[]>
}

const memCache: CacheClass<string, string[]> = memoryCache

const initRepository = (): UserRepository => ({
  async getTelegramUsers(refresh = false) {
    const cacheKey = 'userRepository.getUsers'
    const timeInMinutes = 120

    let cachedData = memCache.get(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getTelegramUsers()
      memCache.put(cacheKey, cachedData, timeInMinutes * 60 * 1000)
    } else {
      log('INFO', 'cached data found', 'userRepository.getUsers')
    }
    return cachedData
  },
})

export default initRepository()
