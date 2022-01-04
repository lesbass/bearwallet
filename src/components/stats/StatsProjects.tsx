import { Box, CircularProgress, Grid, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { StatsMovement } from 'interfaces/NotionModels'
import { StyledTableCell, StyledTableRow } from 'lib/styledTable'
import { renderValore } from 'lib/utils'
import { getProjects } from 'store/project/project.selectors'

interface Props {
  items: StatsMovement[] | undefined
}

interface StatsRow {
  data: Date
  projectId: string
  projectName: string
  valore: number
}

const StatsProjects: React.VFC<Props> = ({ items }) => {
  const { t } = useTranslation('stats')
  const projects = useSelector(getProjects)

  const buildFlatProject = (valore: number, projectId: string, data: Date): StatsRow => {
    return {
      data: data,
      projectId: projectId,
      projectName: projects?.find((project) => project.id === projectId)?.label ?? '-',
      valore: valore,
    }
  }

  const maxDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b)

  const buildStats = (statsMovements: StatsMovement[]) => {
    return statsMovements
      .filter((item) => !!item.projectIds.length)
      .map((item) => item.projectIds.map((projectId) => buildFlatProject(item.value, projectId, new Date(item.date))))
      .reduce((accumulator, currentValue) => {
        const currentItem = currentValue[0]
        const prevItem = accumulator.filter((item) => item.projectId === currentItem.projectId)

        return (
          !!prevItem.length
            ? [
                ...accumulator.filter((item) => item.projectId !== currentItem.projectId),
                buildFlatProject(
                  prevItem[0].valore + currentItem.valore,
                  currentItem.projectId,
                  maxDate(currentItem.data, prevItem[0].data)
                ),
              ]
            : [...accumulator, buildFlatProject(currentItem.valore, currentItem.projectId, currentItem.data)]
        ).sort((a, b) => (a.data.getTime() > b.data.getTime() ? -1 : 1))
      }, [])
  }

  const stats = items ? buildStats(items) : []

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
      <Box sx={{ color: 'text.secondary' }}>{t('project_stats')}</Box>
      {items ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>{t('table_project')}</StyledTableCell>
                <StyledTableCell>{t('table_total')}</StyledTableCell>
                <StyledTableCell>{t('table_last_item')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((item, index) => {
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{item.projectName}</StyledTableCell>
                    <StyledTableCell>{renderValore(item.valore, false)}</StyledTableCell>
                    <StyledTableCell>{moment(item.data).format('ll')}</StyledTableCell>
                  </StyledTableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
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

export default StatsProjects
