import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { blueGrey, grey } from '@material-ui/core/colors'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ListIcon from '@material-ui/icons/List'
import ReplayIcon from '@material-ui/icons/Replay'
import { LoadingButton } from '@material-ui/lab'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Movement } from 'interfaces/NotionModels'
import { StyledTableCell, StyledTableRow } from 'lib/styledTable'
import { useAppDispatch, useAppThunkDispatch } from 'lib/useAppDispatch'
import { renderIcon, renderValore as renderValoreWithHide } from 'lib/utils'
import { getCategories, getCurrentCategory } from 'store/category/category.selectors'
import { setCurrentCategorySuccess } from 'store/category/category.store'
import { resetLastItems, setLastItems } from 'store/lastItems/lastItems.actions'
import { retrieveLastItems } from 'store/lastItems/lastItems.selectors'
import { getProjects } from 'store/project/project.selectors'
import { getHideValues } from 'store/settings/settings.selectors'
import { setHideValuesSuccess } from 'store/settings/settings.store'

const RecentItemsCard: React.VFC = () => {
  const dispatch = useAppDispatch()
  const thunkDispatch = useAppThunkDispatch()
  const { t } = useTranslation('recentItems')

  const [currentPage, setCurrentPage] = useState(1)
  const [loadingPage, setLoadingPage] = useState(false)
  let items: Movement[] | undefined = undefined

  const categories = useSelector(getCategories)
  const projects = useSelector(getProjects)
  const hideValues = useSelector(getHideValues)
  const currentCategory = useSelector(getCurrentCategory)

  useEffect(() => {
    setCurrentPage(1)
  }, [currentCategory])

  const loadMore = () => {
    setLoadingPage(true)
    const nextPage = currentPage + 1
    thunkDispatch(setLastItems({ category: currentCategory ? currentCategory.id : null, page: nextPage })).then(() => {
      setCurrentPage(nextPage)
      setLoadingPage(false)
    })
  }

  const allItems = useSelector(retrieveLastItems)
  const itemsFilter = { category: currentCategory ? currentCategory.id : null, page: currentPage }
  const filteredItems = allItems?.filter(
    (row) => row.page === itemsFilter.page && row.category === itemsFilter.category
  )
  if (!filteredItems || !filteredItems.length) {
    dispatch(setLastItems(itemsFilter))
  } else {
    items = filteredItems[0].data
  }

  const renderValore = (val: number) => renderValoreWithHide(val, hideValues)

  let prevDate = ''
  const dateColors = [blueGrey[700], grey[700]]
  let dateColorIndex = 1
  const renderData = (data: string) => {
    const dateParsed = moment(new Date(data))
    if (prevDate !== data) {
      dateColorIndex = dateColorIndex === 0 ? 1 : 0
      prevDate = data
    }
    const isToday = dateParsed.isSame(moment(), 'day')
    const isYesterday = dateParsed.add(1, 'day').isSame(moment(), 'day')

    const printDate = () => {
      if (isToday) {
        return <b>{t('today')}</b>
      }
      if (isYesterday) {
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
          bgcolor: dateColors[dateColorIndex],
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

  const renderCategoria = (categoryId: string) => {
    const category = categories?.find((cat) => cat.id == categoryId)
    return (
      <Chip
        label={category?.label ?? <CircularProgress color={'warning'} size={'1em'} />}
        sx={{
          cursor: 'pointer',
          maxWidth: '100px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        variant={'outlined'}
        onClick={() => category && dispatch(setCurrentCategorySuccess(category))}
      />
    )
  }

  const renderProgetti = (projectIds: string[]) => {
    if (!projectIds.length) return <></>

    const itemProjects = projectIds.map((projectId) => projects?.find((prj) => prj.id == projectId))
    const projectTitle = itemProjects
      .map((prj) => prj?.label ?? '')
      .filter(Boolean)
      .join(', ')
    return (
      <>
        <div style={{ color: '#dddddd', fontSize: '0.8em', fontVariant: 'small-caps' }} title={projectTitle}>
          <span style={{ color: '#8fcaf9' }}>{'➹'}</span> {projectTitle}
        </div>
      </>
    )
  }

  const title = currentCategory ? (
    <>
      {t('title') + ': '}
      <Chip
        avatar={<Avatar>{renderIcon(currentCategory.icon)}</Avatar>}
        color="primary"
        label={currentCategory.label}
      />
    </>
  ) : (
    t('title')
  )

  const reset = () => {
    dispatch(resetLastItems(true))
    setCurrentPage(1)
  }

  const cardHeader = () => (
    <CardHeader
      action={
        <>
          {!!items && (
            <IconButton aria-label="settings" onClick={reset}>
              <ReplayIcon sx={{ cursor: 'pointer', float: 'right' }} />
            </IconButton>
          )}
          <IconButton onClick={() => dispatch(setHideValuesSuccess(!hideValues))}>
            {hideValues ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </>
      }
      avatar={<ListIcon />}
      sx={{ paddingBottom: 0 }}
      title={title}
      titleTypographyProps={{ variant: 'h6' }}
    />
  )

  const tableRow = (item: Movement, index: number) => (
    <StyledTableRow key={index}>
      <StyledTableCell>{renderData(item.date)}</StyledTableCell>
      <StyledTableCell sx={{ whiteSpace: 'nowrap' }}>{renderValore(item.value)}</StyledTableCell>
      {!currentCategory && <StyledTableCell>{renderCategoria(item.categoryId)}</StyledTableCell>}
      <StyledTableCell>
        {renderProgetti(item.projectIds)}
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

  const renderLoader = () => {
    const colSpan = currentCategory ? 3 : 4
    return (
      <StyledTableRow>
        <StyledTableCell align={'center'} colSpan={colSpan} sx={{ padding: '30px' }}>
          <CircularProgress />
        </StyledTableCell>
      </StyledTableRow>
    )
  }

  return (
    <Card style={{ backgroundColor: '#051821', marginBottom: '20px' }}>
      {cardHeader()}
      <TableContainer component={CardContent}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('table_date')}</StyledTableCell>
              <StyledTableCell>{t('table_value')}</StyledTableCell>
              {!currentCategory && <StyledTableCell>{t('table_category')}</StyledTableCell>}
              <StyledTableCell>{t('table_description')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{!!items ? items.map(tableRow) : renderLoader()}</TableBody>
        </Table>
      </TableContainer>

      {items && (
        <Box sx={{ marginBottom: '20px' }} textAlign={'center'} onClick={loadMore}>
          <LoadingButton loading={loadingPage} size="small" startIcon={<ArrowDownwardIcon />} variant={'outlined'}>
            {t('load_more')}
          </LoadingButton>
        </Box>
      )}
    </Card>
  )
}

export default RecentItemsCard
