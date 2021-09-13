import { Category } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'
import { memoryCache } from 'lib/utils'

interface CategoryRepository {
  getCategories: (refresh: boolean) => Promise<Category[]>
}

const initRepository = (): CategoryRepository => ({
  async getCategories(refresh = false) {
    const cacheKey = 'categoryRepository.getCategories'
    const timeInMinutes = 120

    let cachedData = memoryCache.get<Category[]>(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getCategories(false)
      memoryCache.set(cacheKey, cachedData, timeInMinutes * 60)
    } else {
      log('INFO', 'cached data found', 'categoryRepository.getCategories')
    }
    return cachedData
  },
})

export default initRepository()
