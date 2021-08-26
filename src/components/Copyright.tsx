import { Button } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import LockIcon from '@material-ui/icons/Lock'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import useAuthentication from 'hooks/useAuthentication'

const Copyright: React.VFC = () => {
  const { logOut } = useAuthentication()

  const { t } = useTranslation('common')
  return (
    <Box sx={{ marginBottom: '20px' }} textAlign={'center'}>
      <Button size="small" variant={'outlined'} onClick={logOut}>
        <LockIcon /> {t('logout')}
      </Button>
    </Box>
  )
}

export default Copyright
