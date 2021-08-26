import memoryCache, { CacheClass } from 'memory-cache'

import { Project } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'

interface ProjectRepository {
  getProjects: (refresh: boolean) => Promise<Project[]>
}

const memCache: CacheClass<string, Project[]> = memoryCache

const initRepository = (): ProjectRepository => ({
  async getProjects(refresh = false) {
    const cacheKey = 'projectRepository.getProjects'
    const timeInMinutes = 120

    let cachedData = memCache.get(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getProjects(false)
      memCache.put(cacheKey, cachedData, timeInMinutes * 60 * 1000)
    } else {
      log('INFO', 'cached data found', 'projectRepository.getProjects')
    }
    return cachedData
  },
})

export default initRepository()
