import log from 'lib/log'
import api from 'lib/notion-client'
import { memoryCache } from 'lib/utils'

interface UserRepository {
  getTelegramUsers: (refresh: boolean) => Promise<string[]>
}

const initRepository = (): UserRepository => ({
  async getTelegramUsers(refresh = false) {
    const cacheKey = 'userRepository.getUsers'
    const timeInMinutes = 120

    let cachedData = memoryCache.get<string[]>(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getTelegramUsers()
      memoryCache.set(cacheKey, cachedData, timeInMinutes * 60)
    } else {
      log('INFO', 'cached data found', 'userRepository.getUsers')
    }
    return cachedData
  },
})

export default initRepository()
