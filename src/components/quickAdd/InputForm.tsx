import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/Save'
import LoadingButton from '@material-ui/lab/LoadingButton'
import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Category } from 'interfaces/NotionModels'
import api from 'lib/local-api'
import { useAppDispatch } from 'lib/useAppDispatch'
import { renderIcon } from 'lib/utils'
import { getCurrentCategory } from 'store/category/category.selectors'
import { setCurrentCategorySuccess } from 'store/category/category.store'
import { resetLastItems } from 'store/lastItems/lastItems.actions'
import { setNotes } from 'store/note/note.actions'
import { getNotes } from 'store/note/note.selectors'
import { getCurrentProject } from 'store/project/project.selectors'
import { setCurrentProjectSuccess } from 'store/project/project.store'
import { setErrorSuccess, setProcessingSuccess } from 'store/settings/settings.store'

import ProjectSelect from './ProjectSelect'

const InputForm: React.VFC = () => {
  const { t } = useTranslation('quickAdd')
  const dispatch = useAppDispatch()
  const category = useSelector(getCurrentCategory) as Category
  const dismissForm = () => dispatch(setCurrentCategorySuccess(null))

  useEffect(() => {
    dispatch(setCurrentProjectSuccess(null))
  }, [dispatch])

  const [date, setDate] = useState(moment().format('yyyy-MM-DD'))
  const [dateError, setDateError] = useState(false)
  const [importo, setImporto] = useState<number | null>(null)
  const [importoError, setImportoError] = useState(false)
  const [note, setNote] = useState('')
  const selectedProject = useSelector(getCurrentProject)

  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      submitForm()
    }
  }

  const submitForm = () => {
    let isValid = true
    if (importo === null || importo <= 0) {
      setImportoError(true)
      isValid = false
    }

    if (isValid) {
      dispatch(setProcessingSuccess(true))
      api
        .createItem({
          categoryId: category.id,
          date: date,
          description: note,
          projectId: selectedProject,
          value: importo ?? 0,
        })
        .then(() => {
          dispatch(setProcessingSuccess(false))
          dispatch(resetLastItems(true))
          dispatch(setNotes({ category: category.id, refresh: true }))
        })
        .catch((err) => {
          dispatch(setErrorSuccess(err))
        })

      setTimeout(() => {
        dismissForm()
      }, 500)
    }
  }

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const loading = open && options.length === 0
  useEffect(() => {
    dispatch(setNotes({ category: category.id, refresh: false }))
  }, [category.id, dispatch])
  const notes = useSelector(getNotes).find((item) => item.category === category.id)?.data

  useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    if (active) {
      setOptions(notes ?? [])
    }

    return () => {
      active = false
    }
  }, [loading, notes])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <>
      <CardHeader
        avatar={<ArrowBackIcon sx={{ cursor: 'pointer' }} onClick={dismissForm} />}
        sx={{ paddingBottom: 0 }}
        title={
          <>
            {t('title') + ': '}
            <Chip avatar={<Avatar>{renderIcon(category.icon)}</Avatar>} color="primary" label={category.label} />
          </>
        }
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Box noValidate autoComplete="off" component="form" onKeyDown={onKeyDown}>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="data">{t('date')}</InputLabel>
                <Input
                  required
                  error={dateError}
                  id="data"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onFocus={() => setDateError(false)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="importo">{t('value')}</InputLabel>
                <Input
                  autoFocus
                  required
                  error={importoError}
                  id="importo"
                  startAdornment={<InputAdornment position="start">&euro;</InputAdornment>}
                  type="number"
                  value={importo ?? ''}
                  onChange={(e) => setImporto(+e.target.value)}
                  onFocus={() => setImportoError(false)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                id="descrizione"
                loading={loading}
                loadingText={t('loading')}
                open={open}
                options={options}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                    label={t('notes')}
                    variant="standard"
                    onChange={(e) => setNote(e.target.value)}
                  />
                )}
                value={note}
                onChange={(event, newValue) => {
                  setNote(newValue ?? '')
                }}
                onClose={() => {
                  setOpen(false)
                }}
                onOpen={() => {
                  setOpen(true)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ProjectSelect />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ marginTop: '20px' }}>
            <LoadingButton
              color="primary"
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={submitForm}
            >
              {t('save')}
            </LoadingButton>
            <Button color="secondary" startIcon={<ClearIcon />} variant="contained" onClick={dismissForm}>
              {t('cancel')}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </>
  )
}

export default InputForm
