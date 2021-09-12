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
import ListIcon from '@material-ui/icons/List'
import ReplayIcon from '@material-ui/icons/Replay'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { Movement } from 'interfaces/NotionModels'
import { StyledTableCell, StyledTableRow } from 'lib/styledTable'
import { useAppDispatch } from 'lib/useAppDispatch'
import { renderIcon, renderValore as renderValoreWithHide } from 'lib/utils'
import { getCategories, getCurrentCategory } from 'store/category/category.selectors'
import { setCurrentCategorySuccess } from 'store/category/category.store'
import { setLastItems } from 'store/lastItems/lastItems.actions'
import { getLastItems } from 'store/lastItems/lastItems.selectors'
import { getProjects } from 'store/project/project.selectors'
import { getHideValues } from 'store/settings/settings.selectors'
import { setHideValuesSuccess } from 'store/settings/settings.store'

const RecentItemsCard: React.VFC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('recentItems')

  const items = useSelector(getLastItems)
  const categories = useSelector(getCategories)
  const projects = useSelector(getProjects)
  const hideValues = useSelector(getHideValues)
  const currentCategory = useSelector(getCurrentCategory)

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
    const isToday = dateParsed.date() === moment().date()
    const isYesterday = dateParsed.date() + 1 === moment().date()

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
        variant='rounded'
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
    const title = itemProjects
      .map((prj) => prj?.label ?? '')
      .filter(Boolean)
      .join(', ')
    return (
      <>
        <div style={{ color: '#dddddd', fontSize: '0.8em', fontVariant: 'small-caps' }} title={title}>
          <span style={{ color: '#8fcaf9' }}>{'➹'}</span> {title}
        </div>
      </>
    )
  }

  const title = currentCategory
    ? <>{t('title') + ': '}
      <Chip avatar={<Avatar>{renderIcon(currentCategory.icon)}</Avatar>}
            color='primary'
            label={currentCategory.label} /></>
    : t('title')

  const cardHeader = () => (
    <CardHeader
      action={
        <>
          {!!items && (
            <IconButton aria-label='settings' onClick={() => dispatch(setLastItems(true))}>
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
      <StyledTableCell>{renderCategoria(item.categoryId)}</StyledTableCell>
      <StyledTableCell>
        {renderProgetti(item.projectIds)}
        <Link
          color='inherit'
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

  return (
    <Card style={{ backgroundColor: '#051821', marginBottom: '20px' }}>
      {cardHeader()}
      <TableContainer component={CardContent}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('table_date')}</StyledTableCell>
              <StyledTableCell>{t('table_value')}</StyledTableCell>
              <StyledTableCell>{t('table_category')}</StyledTableCell>
              <StyledTableCell>{t('table_description')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!items ? (
              items.map(tableRow)
            ) : (
              <StyledTableRow>
                <StyledTableCell align={'center'} colSpan={4} sx={{ padding: '30px' }}>
                  <CircularProgress />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default RecentItemsCard
