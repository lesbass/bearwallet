import { Box, CircularProgress, Grid } from '@material-ui/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import { StatsMovement } from 'interfaces/NotionModels'
import { formatEuro } from 'lib/utils'

interface Props {
  items: StatsMovement[] | undefined
}

const StatsTotal: React.VFC<Props> = ({ items }) => {
  const { t } = useTranslation('stats')
  const value =
    items !== undefined
      ? items.map((val) => val.value).reduce((accumulator, currentValue) => accumulator + currentValue)
      : undefined

  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        border: '1px solid #555555',
        borderRadius: 1,
        boxShadow: 1,
        p: 2,
      }}
    >
      <Box sx={{ color: 'text.secondary' }}>{t('total')}</Box>
      {value ? (
        <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>{formatEuro(value)}</Box>
      ) : (
        <Grid
          container
          alignItems="center"
          direction="column"
          spacing={4}
          sx={{
            paddingBottom: '20px',
            paddingTop: '20px',
          }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default StatsTotal
