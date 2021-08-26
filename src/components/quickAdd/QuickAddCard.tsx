import { CardActions } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import ColorCard from 'components/template/ColorCard'
import { getCurrentCategory } from 'store/category/category.selectors'
import { getError, getProcessing } from 'store/settings/settings.selectors'

import CategorySelection from './CategorySelection'
import InputForm from './InputForm'

const QuickAddCard: React.VFC = () => {
  const { t } = useTranslation('quickAdd')
  const processing = useSelector(getProcessing)
  const error = useSelector(getError)
  const currentCategory = useSelector(getCurrentCategory)

  return (
    <ColorCard>
      {!currentCategory ? <CategorySelection /> : <InputForm />}
      {(processing || error) && (
        <CardActions>
          {processing && (
            <Alert severity="info" sx={{ marginTop: '20px', width: '100%' }}>
              {t('saving')}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ marginTop: '20px', width: '100%' }}>
              {error}
            </Alert>
          )}
        </CardActions>
      )}
    </ColorCard>
  )
}

export default QuickAddCard
