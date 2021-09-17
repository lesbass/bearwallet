import styled from '@emotion/styled'
import {
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LoadingButton from '@material-ui/lab/LoadingButton'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import useAuthentication from 'hooks/useAuthentication'
import { useAppDispatch } from 'lib/useAppDispatch'
import { getHideValues } from 'store/settings/settings.selectors'
import { setHideValuesSuccess } from 'store/settings/settings.store'

const GreyPaper = styled(Paper)({
  background: '#222222',
})
const paperStyle = { my: { md: 6, xs: 3 }, p: { md: 3, xs: 2 } }

const LoginForm: React.VFC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('login')

  const { logIn } = useAuthentication()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const hideValues = useSelector(getHideValues)

  const submitForm = useCallback(() => {
    if (!username.length || !password.length) {
      alert(t('wrong_credentials'))
      return
    }
    setIsLoading(true)
    logIn(username, password).then((isValid) => {
      !isValid && alert(t('wrong_credentials'))
      setIsLoading(false)
    })
  }, [logIn, password, username, t])
  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      submitForm()
    }
  }
  return (
    <GreyPaper sx={paperStyle} variant="outlined">
      <Box sx={{ textAlign: 'center' }}>
        <Typography gutterBottom variant="h6">
          {t('access')}
        </Typography>
        <Box noValidate autoComplete="off" component="form" onKeyDown={onKeyDown}>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="username">{t('username')}</InputLabel>
                <Input
                  required
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="password">{t('password')}</InputLabel>
                <Input
                  required
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={hideValues} onChange={(e) => dispatch(setHideValuesSuccess(e.target.checked))} />
                }
                label={t('hide_values')}
                sx={{
                  display: 'block',
                  marginBottom: '10px',
                }}
              />
            </Grid>
          </Grid>

          <Stack alignContent={'center'} direction="row" spacing={2} sx={{ marginTop: '20px' }}>
            <LoadingButton
              color="primary"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<LockOpenIcon />}
              variant="contained"
              onClick={submitForm}
            >
              {t('submit')}
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </GreyPaper>
  )
}

export default LoginForm
