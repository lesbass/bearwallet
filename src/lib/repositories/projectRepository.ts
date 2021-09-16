import { Project } from 'interfaces/NotionModels'
import log from 'lib/log'
import api from 'lib/notion-client'
import { globalCacheTimeInMinutes, memoryCache } from 'lib/utils'

interface ProjectRepository {
  getProjects: (refresh: boolean) => Promise<Project[]>
}

const initRepository = (): ProjectRepository => ({
  async getProjects(refresh = false) {
    const cacheKey = 'projectRepository.getProjects'

    let cachedData = memoryCache.get<Project[]>(cacheKey)
    if (!cachedData || refresh) {
      cachedData = await api.getProjects(false)
      memoryCache.set(cacheKey, cachedData, globalCacheTimeInMinutes * 60)
    } else {
      log('INFO', 'cached data found', 'projectRepository.getProjects')
    }
    return cachedData
  },
})

export default initRepository()
