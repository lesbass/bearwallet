import { Avatar, Chip } from '@material-ui/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { renderIcon } from 'lib/utils'
import { getCurrentCategory } from 'store/category/category.selectors'

const TitleRenderer: React.VFC = () => {
  const currentCategory = useSelector(getCurrentCategory)
  const { t } = useTranslation('recentItems')

  return currentCategory ? (
    <>
      {`${t('title')}: `}
      <Chip
        avatar={<Avatar>{renderIcon(currentCategory.icon)}</Avatar>}
        color="primary"
        label={currentCategory.label}
      />
    </>
  ) : (
    t('title')
  )
}

export default TitleRenderer
