import LockIcon from '@mui/icons-material/Lock'
import { Box, Button } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import useAuthentication from 'hooks/useAuthentication'

const Copyright: React.VFC = () => {
  const { logOut } = useAuthentication()
  const { t } = useTranslation('common')

  return (
    <Box sx={{ marginBottom: '20px' }} textAlign={'center'}>
      <Button size="small" startIcon={<LockIcon />} variant={'outlined'} onClick={logOut}>
        {t('logout')}
      </Button>
    </Box>
  )
}

export default Copyright
