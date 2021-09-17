import { Chip, CircularProgress } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'lib/useAppDispatch'
import { getCategories } from 'store/category/category.selectors'
import { setCurrentCategorySuccess } from 'store/category/category.store'

const CategoryRenderer: React.VFC<{ categoryId: string }> = ({ categoryId }) => {
  const dispatch = useAppDispatch()
  const categories = useSelector(getCategories)

  const category = categories?.find((cat) => cat.id == categoryId)
  return (
    <Chip
      label={category?.label ?? <CircularProgress color={'warning'} size={'1em'} />}
      sx={{
        cursor: 'pointer',
        maxWidth: '100px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      variant={'outlined'}
      onClick={() => category && dispatch(setCurrentCategorySuccess(category))}
    />
  )
}

export default CategoryRenderer
