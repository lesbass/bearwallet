import { Card, CardContent, CardHeader } from '@material-ui/core'
import BuildIcon from '@material-ui/icons/Build'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import ExportToExcel from './ExportToExcel'

const UtilsCard: React.VFC = () => {
  const { t } = useTranslation('excel')

  return (
    <Card style={{ backgroundColor: '#190210', marginBottom: '20px' }}>
      <CardHeader
        avatar={<BuildIcon />}
        sx={{ paddingBottom: 0 }}
        title={t('title')}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <ExportToExcel />
      </CardContent>
    </Card>
  )
}

export default UtilsCard
