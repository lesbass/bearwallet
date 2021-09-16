import { Card, CardHeader } from '@material-ui/core'
import ListIcon from '@material-ui/icons/List'
import { partition } from 'lodash'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Movement } from 'interfaces/NotionModels'
import { useAppDispatch } from 'lib/useAppDispatch'
import { isFuture } from 'lib/utils'
import { getCurrentCategory } from 'store/category/category.selectors'
import { setLastItems } from 'store/lastItems/lastItems.actions'
import { retrieveLastItems } from 'store/lastItems/lastItems.selectors'

import Header from './Header'
import LoadMore from './LoadMore'
import TableData from './TableData'

const RecentItemsCard: React.VFC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('recentItems')

  const [currentPage, setCurrentPage] = useState(1)
  const [loadingPage, setLoadingPage] = useState(false)
  let items: Movement[] | undefined = undefined

  const currentCategory = useSelector(getCurrentCategory)

  useEffect(() => {
    setCurrentPage(1)
  }, [currentCategory])

  const allItems = useSelector(retrieveLastItems)
  const itemsFilter = { category: currentCategory ? currentCategory.id : null, page: currentPage }
  const filteredItems = allItems?.filter(
    (row) => row.page === itemsFilter.page && row.category === itemsFilter.category
  )
  if (!filteredItems || !filteredItems.length) {
    dispatch(setLastItems(itemsFilter))
  } else {
    items = filteredItems[0].data
  }

  const [futureData, pastData] = partition(items, (item: Movement) => isFuture(item.date))

  return (
    <>
      <Card style={{ backgroundColor: '#051821', marginBottom: '20px' }}>
        <Header backToFirstPage={() => setCurrentPage(1)} hasItems={!!items} />
        <TableData data={items ? pastData : items} />
        {items && (
          <LoadMore
            currentPage={currentPage}
            loadingPage={loadingPage}
            setCurrentPage={setCurrentPage}
            setLoadingPage={setLoadingPage}
          />
        )}
      </Card>
      {!!futureData.length && (
        <Card style={{ backgroundColor: '#252c2f', marginBottom: '20px' }}>
          <CardHeader
            avatar={<ListIcon />}
            sx={{ paddingBottom: 0 }}
            title={t('future_items')}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <TableData data={futureData} />
        </Card>
      )}
    </>
  )
}

export default RecentItemsCard
