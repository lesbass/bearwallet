import { FormControl, Grid, Input, InputLabel, Stack } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import GetAppIcon from '@material-ui/icons/GetApp'
import LoadingButton from '@material-ui/lab/LoadingButton'
import * as FileSaver from 'file-saver'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'

import api from 'lib/local-api'

export const ExportToExcel: React.VFC = () => {
  const { t } = useTranslation('excel')
  const lastMonthDate = moment().subtract(1, 'months')
  const [startDate, setStartDate] = useState(lastMonthDate.startOf('month').format('yyyy-MM-DD'))
  const [endDate, setEndDate] = useState(lastMonthDate.endOf('month').format('yyyy-MM-DD'))
  const [isLoading, setIsLoading] = useState(false)

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const fileName = `export-bearwallet_${startDate}_${endDate}`

  const exportToCSV = async () => {
    setIsLoading(true)
    const apiData = await api.exportItems(startDate, endDate)
    const ws = XLSX.utils.json_to_sheet(apiData)
    const wb = { SheetNames: ['data'], Sheets: { data: ws } }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
    setIsLoading(false)
  }

  return (
    <Box noValidate autoComplete="off" component="form">
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="start-data">{t('start_date')}</InputLabel>
            <Input
              required
              id="start-data"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="end-data">{t('end_date')}</InputLabel>
            <Input required id="end-data" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormControl>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} sx={{ marginTop: '20px' }}>
        <LoadingButton
          color="secondary"
          loading={isLoading}
          loadingPosition="start"
          startIcon={<GetAppIcon />}
          variant="contained"
          onClick={exportToCSV}
        >
          {t('create_report')}
        </LoadingButton>
      </Stack>
    </Box>
  )
}

export default ExportToExcel
