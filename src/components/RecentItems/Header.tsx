import { CardHeader, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import ListIcon from '@material-ui/icons/List'
import ReplayIcon from '@material-ui/icons/Replay'
import React from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch, useAppThunkDispatch } from 'lib/useAppDispatch'
import { resetCategories } from 'store/category/category.actions'
import { getCurrentCategory } from 'store/category/category.selectors'
import { resetLastItems } from 'store/lastItems/lastItems.actions'
import { setNotes } from 'store/note/note.actions'
import { getHideValues } from 'store/settings/settings.selectors'
import { setHideValuesSuccess } from 'store/settings/settings.store'


import TitleRenderer from './TitleRenderer'


interface Props {
  backToFirstPage: () => void
  hasItems: boolean
}

const Header: React.VFC<Props> = ({ backToFirstPage, hasItems }) => {
  const hideValues = useSelector(getHideValues)
  const thunkDispatch = useAppThunkDispatch()
  const dispatch = useAppDispatch()
  const currentCategory = useSelector(getCurrentCategory)

  const reset = async () => {
    await thunkDispatch(resetLastItems())
    await thunkDispatch(resetCategories())

    currentCategory && dispatch(setNotes({ category: currentCategory.id, refresh: true }))
    backToFirstPage()
  }

  return (
    <CardHeader
      action={
        <>
          {hasItems && (
            <IconButton aria-label="settings" onClick={reset}>
              <ReplayIcon sx={{ cursor: 'pointer', float: 'right' }} />
            </IconButton>
          )}
          <IconButton onClick={() => dispatch(setHideValuesSuccess(!hideValues))}>
            {hideValues ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </>
      }
      avatar={<ListIcon />}
      sx={{ paddingBottom: 0 }}
      title={<TitleRenderer />}
      titleTypographyProps={{ variant: 'h6' }}
    />
  )
}

export default Header
