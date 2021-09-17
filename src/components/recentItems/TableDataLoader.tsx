import { CircularProgress } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import { StyledTableCell, StyledTableRow } from 'lib/styledTable'
import { getCurrentCategory } from 'store/category/category.selectors'

const TableDataLoader: React.VFC = () => {
  const currentCategory = useSelector(getCurrentCategory)
  const colSpan = currentCategory ? 3 : 4
  return (
    <StyledTableRow>
      <StyledTableCell align={'center'} colSpan={colSpan} sx={{ padding: '30px' }}>
        <CircularProgress />
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default TableDataLoader
