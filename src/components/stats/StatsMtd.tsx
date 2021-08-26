import { Box, CircularProgress, Grid } from '@material-ui/core'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'

import { StatsMovement } from 'interfaces/NotionModels'
import { formatEuro } from 'lib/utils'

interface Props {
  items: StatsMovement[] | undefined
}

const StatsMtd: React.VFC<Props> = ({ items }) => {
  const { t } = useTranslation('stats')
  const [value, setValue] = useState<number | undefined>(undefined)
  const [perc, setPerc] = useState<number>(0)

  useEffect(() => {
    if (items !== undefined) {
      const startDate = moment().startOf('month').toDate()
      const endDate = moment().toDate()

      const startDatePrevMonth = moment().subtract(1, 'months').startOf('month').toDate()
      const endDatePrevMonth = moment().subtract(1, 'months').toDate()

      const totalCurrMonth = items
        .filter((value) => {
          const parsedDate = new Date(value.date)
          return parsedDate >= startDate && parsedDate <= endDate
        })
        .map((value) => value.value)
        .reduce((accumulator, currentValue) => accumulator + currentValue)

      const totalPrevMonth = items
        .filter((value) => {
          const parsedDate = new Date(value.date)
          return parsedDate >= startDatePrevMonth && parsedDate <= endDatePrevMonth
        })
        .map((value) => value.value)
        .reduce((accumulator, currentValue) => accumulator + currentValue)

      setValue(totalCurrMonth)
      setPerc(Math.round(((totalCurrMonth - totalPrevMonth) / totalPrevMonth) * 10000) / 100)
    }
  }, [items])

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
      <Box sx={{ color: 'text.secondary' }}>{t('current_month')}</Box>
      {value ? (
        <>
          <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>{formatEuro(value)}</Box>
          <Box component={TrendingUpIcon} sx={{ color: 'success.dark', fontSize: 16, verticalAlign: 'sub' }} />
          <Box
            sx={{
              color: perc < 0 ? 'success.dark' : 'red',
              display: 'inline',
              fontWeight: 'medium',
              mx: 0.5,
            }}
          >
            {perc}%
          </Box>
          <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>{t('vs_prev_month')}</Box>
        </>
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

export default StatsMtd
