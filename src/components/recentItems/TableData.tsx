import { CardContent, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { blueGrey, grey } from '@material-ui/core/colors'
import { groupBy } from 'lodash'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { Movement } from 'interfaces/NotionModels'
import { StyledTableCell } from 'lib/styledTable'
import { getCurrentCategory } from 'store/category/category.selectors'

import TableDataLoader from './TableDataLoader'
import TableDataRow from './TableDataRow'

const TableData: React.VFC<{ data: Movement[] | undefined }> = ({ data }) => {
  const currentCategory = useSelector(getCurrentCategory)
  const { t } = useTranslation('recentItems')

  const dateColors = [blueGrey[700], grey[700]]

  const enrichItem = (item: Movement, index: number) => {
    return {
      ...item,
      dateColor: dateColors[index % 2 ? 1 : 0],
    }
  }

  return (
    <TableContainer component={CardContent}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <StyledTableCell>{t('table_date')}</StyledTableCell>
            <StyledTableCell>{t('table_value')}</StyledTableCell>
            {!currentCategory && <StyledTableCell>{t('table_category')}</StyledTableCell>}
            <StyledTableCell>{t('table_description')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!data ? (
            Object.values(groupBy(data, 'date'))
              .flatMap((value: Movement[], index: number) => value.map((item) => enrichItem(item, index)))
              .map((item, index) => (
                <TableDataRow key={index} item={item} />
              ))
          ) : (
            <TableDataLoader />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableData
