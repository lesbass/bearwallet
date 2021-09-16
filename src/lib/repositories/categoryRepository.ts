import { Category } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

interface CategoryRepository {
  getCategories: (refresh: boolean) => Promise<Category[]>
}

const initRepository = (): CategoryRepository => ({
  async getCategories(refresh = false) {
    const cacheKey = 'categoryRepository.getCategories'

    let cachedData = memoryCache.get<Category[]>(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getCategories(false)
      memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
    } else {
      log('INFO', 'cached data found', 'categoryRepository.getCategories')
    }
    return cachedData
  },
})

export default initRepository()
