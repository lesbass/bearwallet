import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { useAppThunkDispatch } from 'lib/useAppDispatch'
import { getCurrentCategory } from 'store/category/category.selectors'
import { setLastItems } from 'store/lastItems/lastItems.actions'

interface Props {
  currentPage: number
  loadingPage: boolean
  setCurrentPage: (value: number) => void
  setLoadingPage: (value: boolean) => void
}

const LoadMore: React.VFC<Props> = ({ currentPage, loadingPage, setCurrentPage, setLoadingPage }) => {
  const thunkDispatch = useAppThunkDispatch()
  const currentCategory = useSelector(getCurrentCategory)
  const { t } = useTranslation('recentItems')

  const loadMore = () => {
    setLoadingPage(true)
    const nextPage = currentPage + 1
    thunkDispatch(setLastItems({ category: currentCategory ? currentCategory.id : null, page: nextPage })).then(() => {
      setCurrentPage(nextPage)
      setLoadingPage(false)
    })
  }

  return (
    <Box sx={{ marginBottom: '20px' }} textAlign={'center'} onClick={loadMore}>
      <LoadingButton loading={loadingPage} size="small" startIcon={<ArrowDownwardIcon />} variant={'outlined'}>
        {t('load_more')}
      </LoadingButton>
    </Box>
  )
}

export default LoadMore
