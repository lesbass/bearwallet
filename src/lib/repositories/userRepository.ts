import log from 'lib/log'
import api from 'lib/notion-client'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

interface UserRepository {
  getTelegramUsers: (refresh: boolean) => Promise<string[]>
}

const initRepository = (): UserRepository => ({
  async getTelegramUsers(refresh = false) {
    const cacheKey = 'userRepository.getUsers'

    let cachedData = memoryCache.get<string[]>(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getTelegramUsers()
      memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
    } else {
      log('INFO', 'cached data found', 'userRepository.getUsers')
    }
    return cachedData
  },
})

export default initRepository()
