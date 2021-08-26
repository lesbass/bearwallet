import memoryCache, { CacheClass } from 'memory-cache'

import { Category } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'

interface CategoryRepository {
  getCategories: (refresh: boolean) => Promise<Category[]>
}

const memCache: CacheClass<string, Category[]> = memoryCache

const initRepository = (): CategoryRepository => ({
  async getCategories(refresh = false) {
    const cacheKey = 'categoryRepository.getCategories'
    const timeInMinutes = 120

    let cachedData = memCache.get(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getCategories(false)
      memCache.put(cacheKey, cachedData, timeInMinutes * 60 * 1000)
    } else {
      log('INFO', 'cached data found', 'categoryRepository.getCategories')
    }
    return cachedData
  },
})

export default initRepository()
