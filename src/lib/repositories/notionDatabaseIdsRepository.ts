import { NotionDatabaseIds } from 'lib/interfaces/notionDatabaseIds'
import { initApi } from 'lib/notion-client'
import { memoryCache } from 'lib/utils'

const notionDatabaseIds = async (refresh = false) => {
  const cacheKey = 'notionDatabaseIds'

  let cachedData = memoryCache.get<NotionDatabaseIds>(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await initApi().getDatabaseIds()
    memoryCache.set(cacheKey, cachedData)
  }
  return cachedData
}

export default notionDatabaseIds
