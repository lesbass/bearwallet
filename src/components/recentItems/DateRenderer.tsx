import { Avatar, Box } from '@mui/material'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import { isToday, isYesterday } from 'lib/utils'

const DateRenderer: React.VFC<{ data: string; dateColor: string }> = ({ data, dateColor }) => {
  const dateParsed = moment(new Date(data))
  const { t } = useTranslation('recentItems')

  const printDate = () => {
    if (isToday(data)) {
      return <b>{t('today')}</b>
    }
    if (isYesterday(data)) {
      return <b>{t('yesterday')}</b>
    }
    return (
      <>
        <b
          style={{
            fontSize: 11,
            fontWeight: 'normal',
            lineHeight: '15px',
          }}
        >
          {dateParsed.format('ddd').toUpperCase()}
        </b>
        <br />
        {dateParsed.format('DD/MM')}
      </>
    )
  }

  return (
    <Avatar
      sx={{
        bgcolor: dateColor,
        color: 'white',
        fontSize: 10,
        height: 32,
        textAlign: 'center',
        width: 32,
      }}
      variant="rounded"
    >
      <Box display={'block'}>{printDate()}</Box>
    </Avatar>
  )
}

export default DateRenderer
