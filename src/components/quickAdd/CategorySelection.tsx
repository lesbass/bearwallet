import {
  Button,
  ButtonGroup,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import useTranslation from 'next-translate/useTranslation'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Loader from 'components/loader/Loader'
import { Category } from 'interfaces/NotionModels'
import { useAppDispatch } from 'lib/useAppDispatch'
import { renderIcon } from 'lib/utils'
import { getCategories } from 'store/category/category.selectors'
import { setCurrentCategorySuccess } from 'store/category/category.store'

const CategorySelection: React.VFC = () => {
  const { t } = useTranslation('quickAdd')
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const categories = useSelector(getCategories)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelect = (category: Category) => {
    dispatch(setCurrentCategorySuccess(category))
    handleClose()
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return categories ? (
    <>
      <CardHeader
        avatar={<AddIcon />}
        sx={{ paddingBottom: 0 }}
        title={t('title')}
        titleTypographyProps={{ variant: 'h6' }}
      />

      <Grid container component={CardContent} spacing={2} sx={{ marginBottom: '10px' }}>
        {categories
          ?.filter((category) => category.top)
          .map((category, index) => (
            <Grid key={index} item xs>
              <Button fullWidth color="secondary" variant="contained" onClick={() => handleSelect(category)}>
                <Grid container direction={'column'}>
                  <Typography display="block" variant="h5">
                    {renderIcon(category.icon)}
                  </Typography>
                  <Typography display="block" variant="caption">
                    {category.label}
                  </Typography>
                </Grid>
              </Button>
            </Grid>
          ))}
      </Grid>

      <Grid container alignItems="center" direction="column">
        {categories && (
          <Grid item sx={{ fontStyle: 'italic', marginBottom: '10px' }} xs={12}>
            {t('or')}
          </Grid>
        )}
        <ButtonGroup
          ref={anchorRef}
          aria-label="split button"
          color={'primary'}
          disabled={!categories}
          variant="contained"
        >
          <Button onClick={handleToggle}>{t('select_a_category')} </Button>
          <Button
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="menu"
            aria-label="select merge strategy"
            color="primary"
            size="small"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          disablePortal
          transition
          anchorEl={anchorRef.current}
          open={open}
          role={undefined}
          style={{ zIndex: 10 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {categories?.map((option, index) => (
                      <MenuItem key={index} onClick={() => handleSelect(option)}>
                        <div
                          style={{
                            display: 'inline-block',
                            textAlign: 'center',
                            width: '30px',
                          }}
                        >
                          {renderIcon(option.icon)}
                        </div>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </>
  ) : (
    <Loader />
  )
}

export default CategorySelection
