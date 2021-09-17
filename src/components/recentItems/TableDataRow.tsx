import { Link } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import { Movement } from 'interfaces/NotionModels'
import { StyledTableCell, StyledTableRow } from 'lib/styledTable'
import { renderValore as renderValoreWithHide } from 'lib/utils'
import { getCurrentCategory } from 'store/category/category.selectors'
import { getHideValues } from 'store/settings/settings.selectors'

import CategoryRenderer from './CategoryRenderer'
import DateRenderer from './DateRenderer'
import ProjectRenderer from './ProjectRenderer'

const TableDataRow: React.VFC<{ item: Movement & { dateColor: string } }> = ({ item }) => {
  const currentCategory = useSelector(getCurrentCategory)
  const hideValues = useSelector(getHideValues)

  const renderValore = (val: number) => renderValoreWithHide(val, hideValues)

  return (
    <StyledTableRow>
      <StyledTableCell>
        <DateRenderer data={item.date} dateColor={item.dateColor} />
      </StyledTableCell>
      <StyledTableCell sx={{ whiteSpace: 'nowrap' }}>{renderValore(item.value)}</StyledTableCell>
      {!currentCategory && (
        <StyledTableCell>
          <CategoryRenderer categoryId={item.categoryId} />
        </StyledTableCell>
      )}
      <StyledTableCell>
        <ProjectRenderer projectIds={item.projectIds} />
        <Link
          color="inherit"
          href={item.url}
          rel={'noreferrer'}
          sx={{
            ':hover': {
              textDecoration: 'underline',
            },
            textDecoration: 'none',
          }}
          target={'_blank'}
        >
          {item.description}
        </Link>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default TableDataRow
