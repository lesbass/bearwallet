import { CardContent, Grid } from '@material-ui/core'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { StatsMovement } from 'interfaces/NotionModels'
import api from 'lib/local-api'

import StatsMtd from './StatsMtd'
import StatsProjects from './StatsProjects'
import StatsTotal from './StatsTotal'

const StatsCardContent: React.VFC = () => {
  const [items, setItems] = useState<StatsMovement[] | undefined>(undefined)

  useEffect(() => {
    const startDate = '2000-01-01'
    const endDate = moment().format('yyyy-MM-DD')
    api.getStatsItems(startDate, endDate).then((values) => {
      setItems(values)
    })
  }, [])

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <StatsMtd items={items} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <StatsTotal items={items} />
        </Grid>
        <Grid item sm={12} xs={12}>
          <StatsProjects items={items} />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default StatsCardContent
