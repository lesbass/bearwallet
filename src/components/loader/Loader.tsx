import { Box, Grid, LinearProgress } from '@material-ui/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

const Loader: React.VFC = () => {
  const { t } = useTranslation('common')
  return (
    <Grid container alignItems="center" direction="column" spacing={4} sx={{ padding: '20px' }}>
      <Grid item textAlign={'center'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={t('appname')} height={70} src={'data:image/png;base64,' + t('logo')} width={70} />
        <br />
        <b>{t('appname')}</b>
      </Grid>
      <Grid item sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Grid>
    </Grid>
  )
}

export default Loader
