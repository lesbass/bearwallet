import memoryCache, { CacheClass } from 'memory-cache'

import { NotionDatabaseIds } from 'lib/interfaces/notionDatabaseIds'
import { initApi } from 'lib/notion-client'

const memCache: CacheClass<string, NotionDatabaseIds> = memoryCache
const notionDatabaseIds = async (refresh = false) => {
  const cacheKey = 'notionDatabaseIds'

  let cachedData = memCache.get(cacheKey)
  if (!cachedData || refresh) {
    cachedData = await initApi().getDatabaseIds()
    memCache.put(cacheKey, cachedData)
  }
  return cachedData
}

export default notionDatabaseIds
